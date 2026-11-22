/**
 * Intentionally fixed policy defaults. The site must remain OFF until the
 * controller approves retention, the scheduled purge and the privacy notice.
 */
export const feedbackRetentionDays = 30;
export const feedbackMaintenanceMaxAgeMs = 48 * 60 * 60 * 1000;
const FUTURE_TOLERANCE_MS = 5 * 60 * 1000;

/** D1's ISO-8601 UTC heartbeat is evidence of a *completed* deletion run. */
export function feedbackMaintenanceIsFresh(value: unknown, now = Date.now()): boolean {
  if (!value || typeof value !== "object" || !("last_success_at" in value)) return false;
  const timestamp = value.last_success_at;
  if (typeof timestamp !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u.test(timestamp)) return false;
  const at = Date.parse(timestamp);
  if (!Number.isFinite(at) || !Number.isFinite(now)) return false;
  const age = now - at;
  return age >= -FUTURE_TOLERANCE_MS && age <= feedbackMaintenanceMaxAgeMs;
}
