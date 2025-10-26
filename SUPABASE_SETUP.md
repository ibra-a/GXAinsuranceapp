# 🚀 Supabase Backend Setup Guide

## Phase 1: Complete Backend Integration

### Prerequisites
- ✅ Supabase account (sign up at https://supabase.com)
- ✅ Supabase client library installed (`@supabase/supabase-js`)

---

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in details:
   - **Name**: `gxa-claims-prototype`
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to Djibouti (e.g., Frankfurt or Singapore)
4. Click **"Create new project"**
5. Wait 2-3 minutes for project initialization

---

## Step 2: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see success messages:
   ```
   ✅ GXA Claims database schema created successfully!
   📊 Sample data inserted for testing
   🔐 RLS policies enabled
   📁 Storage bucket configured for photos
   ```

---

## Step 3: Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## Step 4: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Save the file
4. Restart your dev server: `npm run dev`

**⚠️ IMPORTANT**: Never commit `.env.local` to git (it's already in .gitignore)

---

## Step 5: Verify Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. You should see a bucket named `claim-photos`
3. Click on it to verify it exists
4. The bucket is set to **public** for easy photo access

---

## Step 6: Test the Connection

1. Open your app at http://localhost:3000
2. Open browser console (F12)
3. You should NOT see any Supabase warning messages
4. Try viewing existing claims (3 sample claims should appear)

---

## What's Been Set Up

### ✅ Database Tables
- **claims** table with all required fields
- Proper indexes for performance
- Auto-updating timestamps
- RLS (Row Level Security) enabled

### ✅ Storage
- **claim-photos** bucket for accident photos
- Public access for easy viewing
- Organized by claim number

### ✅ Sample Data
- 3 test claims with different statuses:
  - 1 pending claim (recent)
  - 1 approved claim (1 day old)
  - 1 rejected claim (2 days old)

### ✅ Functions Ready
All claim operations are ready in `src/lib/claims.ts`:
- `getAllClaims()` - Fetch all claims
- `getClaimsByStatus()` - Filter by status
- `createClaim()` - Submit new claim
- `updateClaimStatus()` - Admin approve/reject
- `uploadClaimPhoto()` - Upload accident photos
- `isWithin24Hours()` - Check deadline
- `getClaimsStats()` - Get statistics

---

## Next Steps

### Integrate with UI Components

1. **User Dashboard**:
   ```typescript
   import { getAllClaims, getClaimsStats } from './lib/claims';
   
   // In component
   const claims = await getAllClaims();
   const stats = await getClaimsStats();
   ```

2. **Admin Dashboard**:
   ```typescript
   import { getClaimsByStatus, updateClaimStatus } from './lib/claims';
   
   // Filter claims
   const pendingClaims = await getClaimsByStatus('pending');
   
   // Approve/reject
   await updateClaimStatus(claimId, 'approved', 'Claim verified and approved');
   ```

3. **New Claim Form**:
   ```typescript
   import { createClaim, uploadClaimPhoto, generateClaimNumber } from './lib/claims';
   
   // Create claim
   const claimNumber = generateClaimNumber();
   const photoUrl = await uploadClaimPhoto(file, claimNumber);
   
   await createClaim({
     claim_number: claimNumber,
     user_name: 'John Doe',
     // ... other fields
     photo_urls: [photoUrl]
   });
   ```

---

## Security Notes (Production)

For production deployment, update RLS policies:

```sql
-- Instead of "Anyone can view", use:
CREATE POLICY "Users can view their own claims" ON claims
  FOR SELECT USING (auth.uid() = user_id);

-- Add user authentication
-- Restrict admin actions to admin users only
```

---

## Troubleshooting

### Error: "Invalid API key"
- Double-check your `VITE_SUPABASE_ANON_KEY` in `.env.local`
- Make sure there are no extra spaces or quotes

### Error: "relation 'claims' does not exist"
- Run the SQL schema in Supabase SQL Editor
- Check that the query executed successfully

### Photos not uploading
- Verify storage bucket exists: `claim-photos`
- Check bucket is set to public
- Verify storage policies are created

### No sample data appearing
- Check the INSERT statements ran successfully
- Run: `SELECT * FROM claims;` in SQL Editor to verify

---

## Database Schema Reference

```typescript
interface Claim {
  id: string;                    // UUID primary key
  created_at: string;            // Auto timestamp
  updated_at: string;            // Auto timestamp
  claim_number: string;          // CLM-YYYYMMDDHHMMSS
  user_name: string;             // Claimant name
  policy_number: string;         // GXA policy number
  contact_email?: string;        // Optional email
  contact_phone?: string;        // Optional phone
  incident_date_time: string;    // When accident occurred
  vehicle_plate: string;         // License plate
  vehicle_make: string;          // Toyota, Nissan, etc.
  vehicle_model: string;         // Corolla, Patrol, etc.
  accident_description: string;  // Detailed description
  photo_urls: string[];          // Array of photo URLs
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;          // Admin comments
}
```

---

## Support

If you encounter issues:
1. Check Supabase project status
2. Verify environment variables are set correctly
3. Check browser console for errors
4. Review Supabase logs in dashboard

**Your GXA Claims system is now ready for full backend integration!** 🎉



