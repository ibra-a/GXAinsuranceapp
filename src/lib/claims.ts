import { supabase, type Claim, type ClaimInsert } from './supabase';

// Generate unique claim number
export function generateClaimNumber(): string {
  const date = new Date();
  const timestamp = date.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  return `CLM-${timestamp}`;
}

// Fetch all claims
export async function getAllClaims(): Promise<Claim[]> {
  try {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching claims:', error);
    return [];
  }
}

// Fetch claims by status
export async function getClaimsByStatus(status: string): Promise<Claim[]> {
  try {
    if (status === 'all') {
      return await getAllClaims();
    }

    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching claims by status:', error);
    return [];
  }
}

// Get single claim by ID
export async function getClaimById(id: string): Promise<Claim | null> {
  try {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching claim:', error);
    return null;
  }
}

// Create new claim
export async function createClaim(claim: ClaimInsert): Promise<Claim | null> {
  try {
    const { data, error } = await supabase
      .from('claims')
      .insert([claim])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating claim:', error);
    throw error;
  }
}

// Update claim status (admin action)
export async function updateClaimStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  adminNotes?: string
): Promise<Claim | null> {
  try {
    const updateData: any = { status };
    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    const { data, error } = await supabase
      .from('claims')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating claim status:', error);
    throw error;
  }
}

// Upload photo to Supabase Storage
export async function uploadClaimPhoto(
  file: File | Blob, 
  claimNumber: string, 
  angle?: string
): Promise<string | null> {
  try {
    // Generate filename
    const timestamp = Date.now();
    const anglePrefix = angle ? `${angle}-` : '';
    const fileName = `${anglePrefix}${timestamp}.jpg`;
    
    // Organize by required vs optional
    const folder = angle ? 'required' : 'optional';
    const filePath = `${claimNumber}/${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('claim-photos')
      .upload(filePath, file, {
        contentType: 'image/jpeg',
        upsert: false // Don't overwrite existing files
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage
      .from('claim-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
}

// Add photo URL to claim
export async function addPhotoToClaim(id: string, photoUrl: string): Promise<boolean> {
  try {
    // First get current photos
    const claim = await getClaimById(id);
    if (!claim) return false;

    const updatedPhotos = [...(claim.photo_urls || []), photoUrl];

    const { error } = await supabase
      .from('claims')
      .update({ photo_urls: updatedPhotos })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding photo to claim:', error);
    return false;
  }
}

// Check if claim is within 24-hour window
export function isWithin24Hours(accidentDatetime: string): boolean {
  const accidentTime = new Date(accidentDatetime).getTime();
  const now = Date.now();
  const hoursDiff = (now - accidentTime) / (1000 * 60 * 60);
  return hoursDiff <= 24;
}

// Calculate time remaining to submit
export function getTimeRemaining(accidentDatetime: string): string {
  const accidentTime = new Date(accidentDatetime).getTime();
  const now = Date.now();
  const deadline = accidentTime + (24 * 60 * 60 * 1000); // 24 hours
  const remaining = deadline - now;

  if (remaining <= 0) {
    return '⚠️ 24-hour deadline passed';
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
}

// Get claims statistics
export async function getClaimsStats() {
  try {
    const allClaims = await getAllClaims();

    return {
      total: allClaims.length,
      pending: allClaims.filter(c => c.status === 'pending').length,
      approved: allClaims.filter(c => c.status === 'approved').length,
      rejected: allClaims.filter(c => c.status === 'rejected').length,
    };
  } catch (error) {
    console.error('Error getting claims stats:', error);
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };
  }
}

