/**
 * Anonymous intake growth guard. This is an aggregate, global quota, NOT a
 * per-user spam or abuse filter. Cloudflare WAF still needs an approved limit.
 * All checks are inside ONE INSERT statement to avoid concurrent read/write
 * races, with no IP address or visitor identifier stored.
 */
export const feedbackIntakeQuota = {
  quarterHourMax: 15,
  rollingDayMax: 100,
  quarterHourMs: 15 * 60 * 1000,
  rollingDayMs: 24 * 60 * 60 * 1000,
} as const;

export function feedbackQuotaCutoffs(now = Date.now()): { quarterHour: string; rollingDay: string } {
  if (!Number.isSafeInteger(now) || now <= feedbackIntakeQuota.rollingDayMs) {
    throw new Error("Invalid intake quota clock");
  }
  return {
    quarterHour: new Date(now - feedbackIntakeQuota.quarterHourMs).toISOString(),
    rollingDay: new Date(now - feedbackIntakeQuota.rollingDayMs).toISOString(),
  };
}

export const feedbackQuotaInsertSql = [
  "INSERT INTO feedback_submissions",
  "(reference, kind, locale, page_path, recipe_id, message, contact_email, token_sha256)",
  "SELECT ?, ?, ?, ?, ?, ?, ?, ?",
  "WHERE (SELECT COUNT(*) FROM feedback_submissions WHERE received_at > ?) < ?",
  "AND (SELECT COUNT(*) FROM feedback_submissions WHERE received_at > ?) < ?",
].join(" ");

/** No write metadata is NOT evidence of a successful insert. */
export function feedbackInsertOutcome(value: unknown): "stored" | "full" | "unconfirmed" {
  if (!value || typeof value !== "object" || !("success" in value) ||
      value.success !== true || !("meta" in value) ||
      !value.meta || typeof value.meta !== "object" ||
      !("changes" in value.meta) || typeof value.meta.changes !== "number" ||
      !Number.isSafeInteger(value.meta.changes)) {
    return "unconfirmed";
  }
  if (value.meta.changes === 1) return "stored";
  if (value.meta.changes === 0) return "full";
  return "unconfirmed";
}
