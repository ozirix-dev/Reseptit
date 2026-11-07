/**
 * A4.2 offline budget state machine. No provider integration or deployment.
 *
 * Every AI request must reserve a worst-case cost BEFORE a chargeable call,
 * and the reservation remains held on timeouts or uncertain provider usage.
 * A production implementation needs a single global, persistent atomic
 * coordinator (such as one SQLite-backed Cloudflare Durable Object).
 *
 * Units are integer nano-USD (1 USD = 1_000_000_000 nano-USD).
 * This gate caps provider inference reservations only. It cannot by itself
 * cap Cloudflare infrastructure, exchange rates, tax or external account fees.
 */
export const NANODOLLARS_PER_USD = 1_000_000_000;
export const DEFAULT_MONTHLY_EXTRA_AI_BUDGET_NANOS = 5 * NANODOLLARS_PER_USD;

export interface FrozenModelCostCeiling {
  modelId: string;
  maxInputTokens: number;
  maxOutputTokens: number;
  inputUsdPerMillion: number;
  outputUsdPerMillion: number;
  maxAdditionalUsdPerCall: number;
}

export type Reservation =
  | { status: "held"; maxNanos: number }
  | { status: "settled"; maxNanos: number; actualNanos: number };

export interface BudgetMonth {
  schemaVersion: 1;
  utcMonth: string;
  limitNanos: number;
  chargedNanos: number;
  heldNanos: number;
  disabled: boolean;
  requests: Record<string, Reservation>;
}

export type ReserveDecision =
  | { allowed: true; month: BudgetMonth }
  | { allowed: false; reason: "DISABLED" | "DUPLICATE" | "BUDGET_EXHAUSTED"; month: BudgetMonth };

const monthPattern = /^\d{4}-(?:0[1-9]|1[0-2])$/;
const requestIdPattern = /^[a-zA-Z0-9][a-zA-Z0-9_-]{15,79}$/;

function safeNonnegative(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`Invalid ${label}`);
}

function safePositive(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`Invalid ${label}`);
}

function safeMoney(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 10000) throw new Error(`Invalid ${label}`);
}

export function newBudgetMonth(utcMonth: string, limitNanos = DEFAULT_MONTHLY_EXTRA_AI_BUDGET_NANOS): BudgetMonth {
  if (!monthPattern.test(utcMonth)) throw new Error("Invalid UTC month");
  safePositive(limitNanos, "monthly budget");
  return {
    schemaVersion: 1, utcMonth, limitNanos,
    chargedNanos: 0, heldNanos: 0, disabled: false,
    requests: Object.create(null) as Record<string, Reservation>,
  };
}

/**
 * Price per million tokens is converted to a conservatively rounded-UP
 * integer nano-USD/token. Model policy must be immutable for a budget window;
 * a rate/model change requires new approval and checked ceiling migration.
 * Never use user-supplied pricing, token caps, tools or retry counts.
 */
export function worstCaseRequestNanos(model: FrozenModelCostCeiling): number {
  if (!model.modelId.trim() || model.modelId.length > 120) throw new Error("Invalid model identity");
  safePositive(model.maxInputTokens, "max input tokens");
  safePositive(model.maxOutputTokens, "max output tokens");
  safeMoney(model.inputUsdPerMillion, "input price");
  safeMoney(model.outputUsdPerMillion, "output price");
  safeMoney(model.maxAdditionalUsdPerCall, "additional fees");
  const inputNanos = Math.ceil(model.inputUsdPerMillion * 1000) * model.maxInputTokens;
  const outputNanos = Math.ceil(model.outputUsdPerMillion * 1000) * model.maxOutputTokens;
  const fixedNanos = Math.ceil(model.maxAdditionalUsdPerCall * NANODOLLARS_PER_USD);
  const total = inputNanos + outputNanos + fixedNanos;
  safePositive(total, "maximum request cost");
  return total;
}

function assertBudgetState(state: BudgetMonth): void {
  if (state.schemaVersion !== 1 || !monthPattern.test(state.utcMonth)) throw new Error("Invalid budget state");
  safePositive(state.limitNanos, "budget limit");
  safeNonnegative(state.chargedNanos, "charged");
  safeNonnegative(state.heldNanos, "held");
  if (state.chargedNanos + state.heldNanos > state.limitNanos) throw new Error("Budget oversubscribed");
  if (typeof state.disabled !== "boolean" || !state.requests || typeof state.requests !== "object") {
    throw new Error("Invalid budget state");
  }
}

export function reserveWorstCase(state: BudgetMonth, requestId: string, maxNanos: number): ReserveDecision {
  assertBudgetState(state);
  if (!requestIdPattern.test(requestId)) throw new Error("Invalid server-generated request ID");
  safePositive(maxNanos, "request cost");
  if (state.disabled) return { allowed: false, reason: "DISABLED", month: state };
  if (Object.hasOwn(state.requests, requestId)) return { allowed: false, reason: "DUPLICATE", month: state };
  if (maxNanos > state.limitNanos - state.chargedNanos - state.heldNanos) {
    return { allowed: false, reason: "BUDGET_EXHAUSTED", month: state };
  }
  return {
    allowed: true,
    month: {
      ...state,
      heldNanos: state.heldNanos + maxNanos,
      requests: { ...state.requests, [requestId]: { status: "held", maxNanos } },
    },
  };
}

/**
 * Refund only once the provider's final metering is KNOWN.
 * On error/timeouts/unknown metering do NOT settle: the maximum remains held.
 * A measured cost exceeding the approved ceiling is a policy breach and
 * disables future reservations without pretending that provider costs vanish.
 */
export function settleKnownCost(
  state: BudgetMonth, requestId: string, actualNanos: number,
): { month: BudgetMonth; outcome: "SETTLED" | "ALREADY_SETTLED" | "CEILING_BREACH" } {
  assertBudgetState(state);
  safeNonnegative(actualNanos, "actual provider charge");
  const row = Object.hasOwn(state.requests, requestId) ? state.requests[requestId] : undefined;
  if (!row) throw new Error("Unknown reservation");
  if (row.status === "settled") return { month: state, outcome: "ALREADY_SETTLED" };
  if (actualNanos > row.maxNanos) {
    return { month: { ...state, disabled: true }, outcome: "CEILING_BREACH" };
  }
  const next = {
    ...state,
    heldNanos: state.heldNanos - row.maxNanos,
    chargedNanos: state.chargedNanos + actualNanos,
    requests: { ...state.requests, [requestId]: { status: "settled" as const, maxNanos: row.maxNanos, actualNanos } },
  };
  assertBudgetState(next);
  return { month: next, outcome: "SETTLED" };
}

export function disableNewReservations(state: BudgetMonth): BudgetMonth {
  assertBudgetState(state);
  return { ...state, disabled: true };
}

/** User requests never control UTC billing month. It is picked by the trusted server clock. */
export function utcBillingMonth(now: Date): string {
  if (!Number.isFinite(now.getTime())) throw new Error("Invalid clock");
  return now.toISOString().slice(0, 7);
}
