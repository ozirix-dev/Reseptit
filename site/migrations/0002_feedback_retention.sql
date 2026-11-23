-- Private feedback retention heartbeat. Apply only to the approved private D1 database.
-- A successful scheduled purge must precede activation of POST /api/feedback.
-- Do not seed or spoof this row as part of the migration: the Worker writes it
-- after a confirmed deletion run.
CREATE TABLE IF NOT EXISTS feedback_maintenance (
  singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
  last_success_at TEXT NOT NULL
);
