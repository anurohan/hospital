-- ============================================================
-- Arogyan Hospital SaaS — Migration 004: Contact messages
-- ============================================================
-- Run AFTER 001-003. Idempotent.
-- Public contact form submissions. Anonymous visitors may INSERT (the app adds
-- validation, a honeypot, and best-effort rate limiting); only staff/admins of
-- the hospital may READ. No updates/deletes from the client.
-- ============================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  message     TEXT NOT NULL,
  is_handled  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Idempotent column modification if table already exists
ALTER TABLE contact_messages ALTER COLUMN email DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_contact_messages_hospital ON contact_messages(hospital_id, created_at DESC);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) may submit a message.
DROP POLICY IF EXISTS "Contact: public insert" ON contact_messages;
CREATE POLICY "Contact: public insert" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Only staff of the hospital may read submissions.
DROP POLICY IF EXISTS "Contact: staff read" ON contact_messages;
CREATE POLICY "Contact: staff read" ON contact_messages
  FOR SELECT USING (is_staff(hospital_id));

-- Staff may mark handled.
DROP POLICY IF EXISTS "Contact: staff update" ON contact_messages;
CREATE POLICY "Contact: staff update" ON contact_messages
  FOR UPDATE USING (is_staff(hospital_id));
