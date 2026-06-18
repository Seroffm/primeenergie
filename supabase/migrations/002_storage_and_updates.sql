-- ============================================================
-- 002: Storage Bucket + Schema-Ergänzungen
-- ============================================================

-- Storage-Bucket für Lead-Dokumente
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lead-documents',
  'lead-documents',
  false,
  10485760,   -- 10 MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Service Role darf alles im Bucket
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'service_role_storage_full'
  ) THEN
    EXECUTE 'CREATE POLICY "service_role_storage_full" ON storage.objects FOR ALL TO service_role USING (bucket_id = ''lead-documents'')';
  END IF;
END $$;

-- Authentifizierte User dürfen lesen
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'auth_users_read_lead_docs'
  ) THEN
    EXECUTE 'CREATE POLICY "auth_users_read_lead_docs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = ''lead-documents'')';
  END IF;
END $$;
