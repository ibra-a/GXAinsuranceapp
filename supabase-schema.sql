-- GXA Car Accident Claims Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  claim_number TEXT UNIQUE NOT NULL,
  user_name TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  incident_date_time TIMESTAMPTZ NOT NULL,
  vehicle_plate TEXT NOT NULL,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  accident_description TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON claims(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_claims_claim_number ON claims(claim_number);

-- Enable Row Level Security (RLS)
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view all claims (for prototype - adjust for production)
CREATE POLICY "Anyone can view claims" ON claims
  FOR SELECT USING (true);

-- Policy: Anyone can insert claims (for prototype - adjust for production)
CREATE POLICY "Anyone can insert claims" ON claims
  FOR INSERT WITH CHECK (true);

-- Policy: Anyone can update claims (for prototype - adjust for production)
CREATE POLICY "Anyone can update claims" ON claims
  FOR UPDATE USING (true);

-- Create storage bucket for claim photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('claim-photos', 'claim-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can upload photos (for prototype)
CREATE POLICY "Anyone can upload claim photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'claim-photos');

-- Storage policy: Anyone can view photos
CREATE POLICY "Anyone can view claim photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'claim-photos');

-- Insert sample data for testing
INSERT INTO claims (
  claim_number,
  user_name,
  policy_number,
  contact_email,
  contact_phone,
  incident_date_time,
  vehicle_plate,
  vehicle_make,
  vehicle_model,
  accident_description,
  photo_urls,
  status
) VALUES
  (
    'CLM-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'Ahmed Hassan',
    'POL-GXA-001',
    'ahmed.hassan@example.com',
    '+253 77 12 34 56',
    NOW() - INTERVAL '2 hours',
    'DJI-1234',
    'Toyota',
    'Corolla',
    'Minor fender bender on Rue de Rome. Vehicle was stopped at red light when rear-ended by another vehicle.',
    ARRAY['https://via.placeholder.com/400x300?text=Accident+Photo+1'],
    'pending'
  ),
  (
    'CLM-' || TO_CHAR(NOW() - INTERVAL '1 day', 'YYYYMMDD') || '-002',
    'Fatima Mohamed',
    'POL-GXA-002',
    'fatima.mohamed@example.com',
    '+253 77 65 43 21',
    NOW() - INTERVAL '1 day',
    'DJI-5678',
    'Nissan',
    'Patrol',
    'Side collision at a roundabout near Bawadi Mall. Other driver did not yield right of way.',
    ARRAY['https://via.placeholder.com/400x300?text=Accident+Photo+2', 'https://via.placeholder.com/400x300?text=Accident+Photo+3'],
    'approved'
  ),
  (
    'CLM-' || TO_CHAR(NOW() - INTERVAL '2 days', 'YYYYMMDD') || '-003',
    'Youssef Ibrahim',
    'POL-GXA-003',
    'youssef.ibrahim@example.com',
    '+253 77 98 76 54',
    NOW() - INTERVAL '2 days',
    'DJI-9012',
    'Honda',
    'Civic',
    'Rear-end collision on Avenue 26. Heavy traffic conditions.',
    ARRAY['https://via.placeholder.com/400x300?text=Accident+Photo+4'],
    'rejected'
  )
ON CONFLICT (claim_number) DO NOTHING;

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ GXA Claims database schema created successfully!';
    RAISE NOTICE '📊 Sample data inserted for testing';
    RAISE NOTICE '🔐 RLS policies enabled';
    RAISE NOTICE '📁 Storage bucket configured for photos';
END $$;




