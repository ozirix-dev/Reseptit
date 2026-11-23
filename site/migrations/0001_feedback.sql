-- Run only against the explicitly approved private feedback D1 database.
-- Never place submitted messages or contact emails in a public GitHub artifact.
CREATE TABLE IF NOT EXISTS feedback_submissions (
  reference TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('recipe_error', 'improvement', 'new_recipe', 'technical', 'other')),
  locale TEXT NOT NULL CHECK (locale IN ('fi', 'en', 'sv', 'th')),
  page_path TEXT NOT NULL,
  recipe_id TEXT,
  message TEXT NOT NULL,
  contact_email TEXT,
  token_sha256 TEXT NOT NULL UNIQUE,
  review_status TEXT NOT NULL DEFAULT 'new'
    CHECK (review_status IN ('new', 'in_review', 'needs_information', 'hold', 'resolved', 'rejected')),
  received_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS feedback_queue_by_status
  ON feedback_submissions (review_status, received_at);
CREATE INDEX IF NOT EXISTS feedback_queue_by_recipe
  ON feedback_submissions (recipe_id, received_at);
