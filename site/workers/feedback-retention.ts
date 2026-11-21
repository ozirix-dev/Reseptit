/**
 * Private Cloudflare Worker, scheduled ONLY. It is not a Pages Function or HTTP API.
 * Deploy separately with an explicitly approved daily UTC Cron Trigger and the
 * private FEEDBACK_DB binding. No Wrangler config/secrets are installed by this PR.
 */
import type { FeedbackDatabase } from "../functions/api/feedback";

export const feedbackRetentionDays = 30;
export const feedbackMaintenanceMaxAgeMs = 48 * 60 * 60 * 1000;

const DAY_MS = 24 * 60 * 60 * 1000;
const FUTURE_TOLERANCE_MS = 5 * 60 * 1000;
const EVENT_MAX_DELAY_MS = 6 * 60 * 60 * 1000;

export interface FeedbackRetentionEnv {
  FEEDBACK_DB?: FeedbackDatabase;
  FEEDBACK_RETENTION_ENABLED?: string;
}

export interface RetentionResult {
  cutoff: string;
  lastSuccessAt: string;
}

/** Run a deletion first, then record success. Never log message text or emails. */
export async function purgeExpiredFeedback(
  env: FeedbackRetentionEnv, scheduledTime: number, now = Date.now(),
): Promise<RetentionResult> {
  if (env.FEEDBACK_RETENTION_ENABLED !== "true" || !env.FEEDBACK_DB?.prepare) {
    throw new Error("Feedback retention is not configured");
  }
  if (!Number.isSafeInteger(scheduledTime) || !Number.isSafeInteger(now) ||
      scheduledTime <= 0 || scheduledTime > now + FUTURE_TOLERANCE_MS ||
      now - scheduledTime > EVENT_MAX_DELAY_MS) {
    throw new Error("Invalid or stale retention invocation time");
  }
  const cutoff = new Date(scheduledTime - feedbackRetentionDays * DAY_MS).toISOString();
  const lastSuccessAt = new Date(scheduledTime).toISOString();

  const deleted = await env.FEEDBACK_DB.prepare(
    "DELETE FROM feedback_submissions WHERE received_at <= ?",
  ).bind(cutoff).run();
  if (!deleted || deleted.success !== true) {
    throw new Error("Feedback deletion was not confirmed");
  }

  // Advance the heartbeat monotonically, but only after a confirmed purge.
  const recorded = await env.FEEDBACK_DB.prepare(
    "INSERT INTO feedback_maintenance (singleton, last_success_at) VALUES (1, ?) " +
    "ON CONFLICT(singleton) DO UPDATE SET last_success_at = " +
    "CASE WHEN feedback_maintenance.last_success_at < excluded.last_success_at " +
    "THEN excluded.last_success_at ELSE feedback_maintenance.last_success_at END",
  ).bind(lastSuccessAt).run();
  if (!recorded || recorded.success !== true) {
    throw new Error("Feedback retention heartbeat was not confirmed");
  }
  return { cutoff, lastSuccessAt };
}

export default {
  async scheduled(
    controller: { scheduledTime: number },
    env: FeedbackRetentionEnv,
  ): Promise<void> {
    await purgeExpiredFeedback(env, controller.scheduledTime);
  },
};
