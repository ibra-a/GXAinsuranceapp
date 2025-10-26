import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Using mock data mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types - matching actual Supabase schema
export interface Claim {
  id: string;
  created_at: string;
  updated_at: string;
  claim_number: string;
  user_name: string;
  policy_number: string;
  contact_email: string;
  contact_phone: string;
  accident_datetime: string;
  submission_datetime: string;
  vehicle_plate: string;
  vehicle_make: string;
  vehicle_model: string;
  accident_description: string;
  photo_urls: string[];
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
}

export interface ClaimInsert {
  claim_number: string;
  user_name: string;
  policy_number: string;
  contact_email: string;
  contact_phone: string;
  accident_datetime: string;
  vehicle_plate: string;
  vehicle_make: string;
  vehicle_model: string;
  accident_description: string;
  photo_urls?: string[];
  status?: 'pending' | 'approved' | 'rejected';
}

