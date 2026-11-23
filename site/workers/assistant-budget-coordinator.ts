import {
  DEFAULT_MONTHLY_EXTRA_AI_BUDGET_NANOS,
  disableNewReservations, newBudgetMonth, reserveWorstCase, settleKnownCost, utcBillingMonth,
  worstCaseRequestNanos,
  type BudgetMonth, type FrozenModelCostCeiling, type ReserveDecision,
} from "../src/features/assistant/ai-budget";

/**
 * A4.2 *unwired* Cloudflare Durable Object persistence adapter.
 *
 * No Worker entrypoint, wrangler migration or live provider exists in A4.2.
 * In A4.3 a single globally named SQLite-backed DO must be the exclusive
 * preflight authority for ALL provider requests, with storage.transactionSync.
 * This adapter is injectable/testable without cloudflare:workers dependencies.
 */
interface DurableObjectKv {
  get<T>(key: string): T | undefined;
  put(key: string, value: unknown): void;
}

export interface TransactionalDurableStore {
  kv: DurableObjectKv;
  transactionSync<T>(closure: () => T): T;
}

const emergencyStopKey = "recipavo-ai-budget-v1:emergency-stop";

export class AssistantBudgetCoordinator {
  constructor(
    private readonly storage: TransactionalDurableStore,
    private readonly approvedPolicy: FrozenModelCostCeiling,
    private readonly limitNanos = DEFAULT_MONTHLY_EXTRA_AI_BUDGET_NANOS,
  ) {}

  private key(period: string): string { return `recipavo-ai-budget-v1:${period}`; }

  private readOrCreate(period: string): BudgetMonth {
    const previous = this.storage.kv.get<BudgetMonth>(this.key(period));
    if (!previous) return newBudgetMonth(period, this.limitNanos);
    if (previous.schemaVersion !== 1 || previous.utcMonth !== period || previous.limitNanos !== this.limitNanos) {
      throw new Error("Budget policy or state changed; fail closed until reviewed");
    }
    return previous;
  }

  /** Called only from a trusted, authenticated internal RPC with server-generated ID. */
  reserve(requestId: string, now = new Date()): ReserveDecision {
    const period = utcBillingMonth(now);
    const maximum = worstCaseRequestNanos(this.approvedPolicy);
    return this.storage.transactionSync(() => {
      const before = this.readOrCreate(period);
      // A persisted stop applies to every month, including a newly created ledger.
      const emergencyStop = this.storage.kv.get<unknown>(emergencyStopKey) !== undefined;
      const state = emergencyStop ? disableNewReservations(before) : before;
      const result = reserveWorstCase(state, requestId, maximum);
      if (result.allowed) this.storage.kv.put(this.key(period), result.month);
      return result;
    });
  }

  /**
   * A provider timeout must NOT call settle: keep the worst-case hold.
   * No prompt, token content or IP is stored, only a generated ID and amounts.
   */
  settle(period: string, requestId: string, measuredNanodollars: number): "SETTLED" | "ALREADY_SETTLED" | "CEILING_BREACH" {
    return this.storage.transactionSync(() => {
      const month = this.readOrCreate(period);
      const result = settleKnownCost(month, requestId, measuredNanodollars);
      if (result.outcome !== "ALREADY_SETTLED") this.storage.kv.put(this.key(period), result.month);
      if (result.outcome === "CEILING_BREACH") this.storage.kv.put(emergencyStopKey, true);
      return result.outcome;
    });
  }

  /** Stops new reservations across all UTC months while allowing settlement of existing holds. */
  disable(period: string): void {
    this.storage.transactionSync(() => {
      const month = this.readOrCreate(period);
      this.storage.kv.put(this.key(period), disableNewReservations(month));
      this.storage.kv.put(emergencyStopKey, true);
    });
  }

  readMonth(period: string): BudgetMonth {
    return this.storage.transactionSync(() => this.readOrCreate(period));
  }
}
