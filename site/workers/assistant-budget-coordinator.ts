import {
  DEFAULT_MONTHLY_EXTRA_AI_BUDGET_NANOS,
  newBudgetMonth, reserveWorstCase, settleKnownCost, utcBillingMonth,
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
      const result = reserveWorstCase(before, requestId, maximum);
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
      return result.outcome;
    });
  }

  /** Enables an operator's emergency OFF switch in persistent state. */
  disable(period: string): void {
    this.storage.transactionSync(() => {
      const month = this.readOrCreate(period);
      this.storage.kv.put(this.key(period), { ...month, disabled: true });
    });
  }

  readMonth(period: string): BudgetMonth {
    return this.storage.transactionSync(() => this.readOrCreate(period));
  }
}
