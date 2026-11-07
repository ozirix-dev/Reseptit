import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_MONTHLY_EXTRA_AI_BUDGET_NANOS,
  NANODOLLARS_PER_USD,
  newBudgetMonth, reserveWorstCase, settleKnownCost, utcBillingMonth, worstCaseRequestNanos,
  type FrozenModelCostCeiling,
} from "../src/features/assistant/ai-budget";
import { AssistantBudgetCoordinator, type TransactionalDurableStore } from "../workers/assistant-budget-coordinator";

const rate: FrozenModelCostCeiling = {
  modelId: "test-fixture-only-not-approved-model",
  maxInputTokens: 10000,
  maxOutputTokens: 2000,
  inputUsdPerMillion: 0.75,
  outputUsdPerMillion: 4.5,
  maxAdditionalUsdPerCall: 0,
};
const id = (n: number) => `server-generated-id-${String(n).padStart(8, "0")}`;

class InMemoryTransactionStore implements TransactionalDurableStore {
  readonly rows = new Map<string, unknown>();
  transactions = 0;
  kv = {
    get: <T>(key: string) => this.rows.get(key) as T | undefined,
    put: (key: string, value: unknown) => { this.rows.set(key, structuredClone(value)); },
  };
  transactionSync<T>(closure: () => T): T {
    // This fixture emulates only synchronous, single-object serialization.
    // It is not a substitute for a real Cloudflare Durable Object integration test.
    this.transactions++;
    return closure();
  }
}

test("A4.2 conservative worst-case prices use integer nano-USD, not rounded display cents", () => {
  const bound = worstCaseRequestNanos(rate);
  assert.equal(bound, 16_500_000);
  assert.equal(DEFAULT_MONTHLY_EXTRA_AI_BUDGET_NANOS, 5_000_000_000);
  assert.equal(NANODOLLARS_PER_USD, 1_000_000_000);
  assert.equal(worstCaseRequestNanos({ ...rate, inputUsdPerMillion: 0.7501 }), 16_510_000,
    "Fractional per-million price rounds UP at per-token scale");
  for (const broken of [
    { ...rate, maxInputTokens: -1 },
    { ...rate, maxOutputTokens: 0 },
    { ...rate, inputUsdPerMillion: Number.NaN },
    { ...rate, outputUsdPerMillion: Infinity },
    { ...rate, maxAdditionalUsdPerCall: -1 },
    { ...rate, modelId: "" },
  ]) assert.throws(() => worstCaseRequestNanos(broken), /Invalid/);
});

test("A4.2 500 simultaneous-attempt fixture requests cannot oversubscribe one $5/month ledger", async () => {
  const store = new InMemoryTransactionStore();
  const coordinator = new AssistantBudgetCoordinator(store, rate);
  const results = await Promise.all(Array.from({ length: 500 }, (_, i) =>
    Promise.resolve().then(() => coordinator.reserve(id(i), new Date("2026-11-07T12:00:00Z")))));
  const allowed = results.filter((result) => result.allowed);
  assert.equal(allowed.length, 303);
  assert.equal(results.filter((result) => !result.allowed).length, 197);
  const month = coordinator.readMonth("2026-11");
  assert.equal(month.chargedNanos, 0);
  assert.equal(month.heldNanos, allowed.length * worstCaseRequestNanos(rate));
  assert.ok(month.chargedNanos + month.heldNanos <= month.limitNanos);
  assert.equal(Object.keys(month.requests).length, 303);
  assert.ok(store.transactions >= 500);
});

test("A4.2 repeated request IDs are denied and settlement releases only confirmed unspent hold", () => {
  const store = new InMemoryTransactionStore();
  const coordinator = new AssistantBudgetCoordinator(store, rate);
  assert.equal(coordinator.reserve(id(1), new Date("2026-11-06T10:30:00Z")).allowed, true);
  const duplicate = coordinator.reserve(id(1), new Date("2026-11-06T10:30:01Z"));
  assert.equal(duplicate.allowed, false);
  if (!duplicate.allowed) assert.equal(duplicate.reason, "DUPLICATE");
  assert.equal(coordinator.settle("2026-11", id(1), 1_000_000), "SETTLED");
  assert.equal(coordinator.settle("2026-11", id(1), 1_000_000), "ALREADY_SETTLED");
  assert.equal(coordinator.reserve(id(1), new Date("2026-11-06T11:00:00Z")).allowed, false);
  assert.equal(coordinator.readMonth("2026-11").chargedNanos, 1_000_000);
  assert.equal(coordinator.readMonth("2026-11").heldNanos, 0);
  assert.throws(() => coordinator.settle("2026-11", id(2), 0), /Unknown reservation/);
});

test("A4.2 provider uncertainty holds the entire reservation; over-ceiling report disables future requests", () => {
  const store = new InMemoryTransactionStore();
  const gate = new AssistantBudgetCoordinator(store, rate);
  gate.reserve(id(3), new Date("2026-11-09T12:00:00Z"));
  // A timeout deliberately has no auto-settle method.
  assert.equal(gate.readMonth("2026-11").heldNanos, 16_500_000);
  assert.equal(gate.settle("2026-11", id(3), 16_500_001), "CEILING_BREACH");
  assert.equal(gate.readMonth("2026-11").disabled, true);
  assert.equal(gate.readMonth("2026-11").heldNanos, 16_500_000);
  const reject = gate.reserve(id(4), new Date("2026-11-09T12:00:02Z"));
  assert.equal(reject.allowed, false);
  if (!reject.allowed) assert.equal(reject.reason, "DISABLED");
});

test("A4.2 month resets only from trusted UTC clock and policy changes fail closed", () => {
  const store = new InMemoryTransactionStore();
  const gate = new AssistantBudgetCoordinator(store, rate);
  assert.equal(utcBillingMonth(new Date("2026-11-30T23:59:59Z")), "2026-11");
  assert.equal(utcBillingMonth(new Date("2026-12-01T00:00:00Z")), "2026-12");
  assert.equal(gate.reserve(id(10), new Date("2026-11-30T23:59:00Z")).allowed, true);
  assert.equal(gate.reserve(id(11), new Date("2026-12-01T00:00:00Z")).allowed, true);
  assert.equal(gate.readMonth("2026-11").heldNanos, 16_500_000);
  assert.equal(gate.readMonth("2026-12").heldNanos, 16_500_000);
  const changedBudget = new AssistantBudgetCoordinator(store, rate, 2_000_000_000);
  assert.throws(() => changedBudget.reserve(id(12), new Date("2026-11-30T20:00:00Z")), /policy or state changed/);
  assert.throws(() => newBudgetMonth("nonsense"), /Invalid UTC month/);
});

test("A4.2 state holds only opaque IDs and integer costs, no text prompts, IPs or API secrets", () => {
  let month = newBudgetMonth("2026-11");
  for (let i = 0; i < 4; i++) {
    const next = reserveWorstCase(month, id(i), worstCaseRequestNanos(rate));
    assert.equal(next.allowed, true);
    month = next.month;
  }
  const result = settleKnownCost(month, id(0), 0);
  assert.equal(result.outcome, "SETTLED");
  assert.equal(result.month.chargedNanos, 0);
  const encoded = JSON.stringify(result.month);
  assert.doesNotMatch(encoded, /prompt|client_message|ip_address|api_key|model_token/);
  assert.throws(() => reserveWorstCase(month, "x", 1), /server-generated/);
});
