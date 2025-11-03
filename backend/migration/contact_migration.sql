-- Migration: Create ContactMessages table
-- Run this in your PostgreSQL database

BEGIN;

-- Create status enum type
CREATE TYPE contact_message_status AS ENUM ('new', 'read', 'replied', 'archived');

-- Create ContactMessages table
CREATE TABLE IF NOT EXISTS "ContactMessages" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(100) NOT NULL CHECK (LENGTH("name") >= 2),
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "subject" VARCHAR(200) NOT NULL CHECK (LENGTH("subject") >= 3),
  "message" TEXT NOT NULL CHECK (LENGTH("message") >= 10 AND LENGTH("message") <= 5000),
  "status" contact_message_status DEFAULT 'new',
  "ipAddress" VARCHAR(45),
  "userAgent" TEXT,
  "adminNotes" TEXT,
  "repliedAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_contact_messages_email" ON "ContactMessages" ("email");
CREATE INDEX IF NOT EXISTS "idx_contact_messages_status" ON "ContactMessages" ("status");
CREATE INDEX IF NOT EXISTS "idx_contact_messages_created_at" ON "ContactMessages" ("createdAt" DESC);

-- Add comments
COMMENT ON TABLE "ContactMessages" IS 'Stores contact form submissions';
COMMENT ON COLUMN "ContactMessages"."status" IS 'Message status: new, read, replied, archived';

COMMIT;

-- Verify the table was created
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'ContactMessages'
ORDER BY ordinal_position;