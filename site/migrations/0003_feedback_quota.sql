-- Speed up anonymous aggregate quota checks without storing IPs or visitor IDs.
-- Only apply after the private D1 migrations 0001 and 0002.
CREATE INDEX IF NOT EXISTS feedback_recent_intake
  ON feedback_submissions(received_at);
