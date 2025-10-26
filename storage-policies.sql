-- Storage Policies for claim-photos bucket
-- Run this in Supabase SQL Editor

-- First, make sure the bucket is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'claim-photos';

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public uploads to claim-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from claim-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to claim-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from claim-photos" ON storage.objects;

-- Create policies for public access
CREATE POLICY "Allow public uploads to claim-photos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'claim-photos');

CREATE POLICY "Allow public reads from claim-photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'claim-photos');

CREATE POLICY "Allow public updates to claim-photos"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'claim-photos')
WITH CHECK (bucket_id = 'claim-photos');

CREATE POLICY "Allow public deletes from claim-photos"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'claim-photos');

