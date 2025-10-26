# 🚀 Quick Start Guide - Next Steps

## ✅ What's Working Right Now
1. **Backend**: Supabase database with `claims` table (3 sample claims)
2. **Frontend**: Dashboard showing LIVE data from Supabase
3. **Storage**: `claim-photos` bucket ready for uploads
4. **Real-time**: Stats and claims auto-refresh from database

## 🎯 Today's Goal: Complete Claim Submission

### Step 1: Test Current Setup (5 min)
```bash
# Open browser
http://localhost:3000

# Verify you see:
✅ 3 Total Claims
✅ 1 Approved, 1 Pending, 1 Rejected
✅ 3 Recent claims displayed (Jean Dupont, Marie Martin, Pierre Dubois)

# Switch to Admin view (bottom right buttons)
✅ Admin dashboard shows same data
```

---

### Step 2: Implement Photo Upload (Priority #1)

**File**: `src/components/NewClaimModal.tsx`

**What to add**:
```typescript
// 1. State for photos
const [photos, setPhotos] = useState<File[]>([]);
const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});

// 2. Handle file selection
const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  
  // Validation
  const validFiles = files.filter(file => {
    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`${file.name} is too large (max 10MB)`);
      return false;
    }
    
    // Only images
    if (!file.type.startsWith('image/')) {
      toast.error(`${file.name} is not an image`);
      return false;
    }
    
    return true;
  });
  
  // Max 10 photos total
  if (photos.length + validFiles.length > 10) {
    toast.error('Maximum 10 photos allowed');
    return;
  }
  
  setPhotos([...photos, ...validFiles]);
};

// 3. Upload photos to Supabase
const uploadPhotos = async (claimNumber: string): Promise<string[]> => {
  const urls: string[] = [];
  
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    
    try {
      // Update progress
      setUploadProgress(prev => ({ ...prev, [i]: 0 }));
      
      const url = await uploadClaimPhoto(photo, claimNumber);
      
      if (url) {
        urls.push(url);
        setUploadProgress(prev => ({ ...prev, [i]: 100 }));
      }
    } catch (error) {
      console.error(`Failed to upload ${photo.name}:`, error);
      toast.error(`Failed to upload ${photo.name}`);
    }
  }
  
  return urls;
};
```

**UI to add**:
```tsx
{/* Photo Upload Section */}
<div className="space-y-4">
  <Label>Accident Photos *</Label>
  
  {/* Upload Button */}
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
    <input
      type="file"
      id="photo-upload"
      multiple
      accept="image/*"
      onChange={handlePhotoSelect}
      className="hidden"
    />
    <label
      htmlFor="photo-upload"
      className="cursor-pointer flex flex-col items-center"
    >
      <Upload className="h-12 w-12 text-gray-400 mb-2" />
      <p className="text-sm text-gray-600">
        Click to upload or drag and drop
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Max 10 photos, 10MB each (JPEG, PNG, HEIC)
      </p>
    </label>
  </div>
  
  {/* Photo Preview Grid */}
  {photos.length > 0 && (
    <div className="grid grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <div key={index} className="relative group">
          <img
            src={URL.createObjectURL(photo)}
            alt={`Photo ${index + 1}`}
            className="w-full h-24 object-cover rounded-lg"
          />
          
          {/* Remove button */}
          <button
            onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
          
          {/* Upload progress */}
          {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${uploadProgress[index]}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>
```

---

### Step 3: Connect Submit Button

**Update the submit handler**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    setSubmitting(true);
    
    // 1. Generate claim number
    const claimNumber = generateClaimNumber();
    
    // 2. Upload photos first
    const photoUrls = await uploadPhotos(claimNumber);
    
    // 3. Create claim data
    const claimData: ClaimInsert = {
      claim_number: claimNumber,
      user_name: formData.user_name,
      policy_number: formData.policy_number,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      accident_datetime: formData.accident_datetime,
      vehicle_plate: formData.vehicle_plate,
      vehicle_make: formData.vehicle_make,
      vehicle_model: formData.vehicle_model,
      accident_description: formData.accident_description,
      photo_urls: photoUrls,
      status: 'pending'
    };
    
    // 4. Submit to Supabase
    const result = await createClaim(claimData);
    
    if (result) {
      toast.success(`Claim ${claimNumber} submitted successfully!`);
      onClose();
      // Refresh parent component
      window.location.reload(); // Simple approach for MVP
    }
    
  } catch (error) {
    console.error('Submission error:', error);
    toast.error('Failed to submit claim. Please try again.');
  } finally {
    setSubmitting(false);
  }
};
```

---

### Step 4: Add 24-Hour Validation

```typescript
// In the form, add this check
const [isWithinDeadline, setIsWithinDeadline] = useState(true);
const [timeRemaining, setTimeRemaining] = useState('');

// When accident_datetime changes
useEffect(() => {
  if (formData.accident_datetime) {
    const within24h = isWithin24Hours(formData.accident_datetime);
    setIsWithinDeadline(within24h);
    
    if (!within24h) {
      toast.error('⚠️ This accident occurred more than 24 hours ago. Claims cannot be submitted.');
    }
    
    // Update countdown
    const remaining = getTimeRemaining(formData.accident_datetime);
    setTimeRemaining(remaining);
  }
}, [formData.accident_datetime]);

// In the UI, show warning
{!isWithinDeadline && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center gap-2 text-red-800">
      <AlertCircle className="h-5 w-5" />
      <p className="font-semibold">24-Hour Deadline Exceeded</p>
    </div>
    <p className="text-sm text-red-600 mt-1">
      Claims must be submitted within 24 hours of the accident.
    </p>
  </div>
)}

{isWithinDeadline && timeRemaining && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div className="flex items-center gap-2 text-blue-800">
      <Clock className="h-5 w-5" />
      <p className="font-semibold">Time Remaining: {timeRemaining}</p>
    </div>
  </div>
)}
```

---

## 🧪 Testing Checklist

After implementing above:

### User Flow
- [ ] Open "New Claim" modal
- [ ] Fill in all required fields
- [ ] Upload 2-3 photos
- [ ] Check photo previews appear
- [ ] Submit claim
- [ ] See success toast with claim number
- [ ] Dashboard refreshes with new claim

### Edge Cases
- [ ] Try uploading 11 photos (should block)
- [ ] Try uploading file > 10MB (should block)
- [ ] Try uploading non-image file (should block)
- [ ] Try submitting without photos (should work)
- [ ] Try accident datetime > 24h ago (should block)
- [ ] Check photos display in Supabase Storage

### Admin Flow
- [ ] Switch to Admin view
- [ ] See new claim in table
- [ ] Click claim to open details
- [ ] View uploaded photos
- [ ] Approve/reject claim
- [ ] Check status updates in User view

---

## 📦 Import Statements Needed

```typescript
// At top of NewClaimModal.tsx
import { useState, useEffect } from 'react';
import { 
  createClaim, 
  generateClaimNumber,
  uploadClaimPhoto,
  isWithin24Hours,
  getTimeRemaining,
  type ClaimInsert 
} from '../lib/claims';
import { toast } from 'sonner';
import { Upload, X, Clock, AlertCircle } from 'lucide-react';
```

---

## 🐛 Common Issues & Solutions

### Issue: Photos not uploading
**Check**:
1. Storage bucket exists: `claim-photos`
2. Bucket is public
3. Storage policies are created
4. File size < 10MB
5. File is an image

**Fix**:
```sql
-- Run in Supabase SQL Editor
SELECT * FROM storage.buckets WHERE id = 'claim-photos';

-- Should see: public = true
```

### Issue: Form not submitting
**Check**:
1. All required fields filled
2. Console for errors
3. Network tab for failed requests
4. Supabase anon key is correct

**Debug**:
```typescript
// Add detailed logging
console.log('Form data:', formData);
console.log('Photos:', photos);
console.log('Claim number:', claimNumber);
```

### Issue: Claims not appearing in dashboard
**Check**:
1. Supabase credentials in `.env.local`
2. RLS policies allow SELECT
3. Browser console for errors
4. Hard refresh (Cmd+Shift+R)

---

## 📞 Quick Commands

```bash
# Check if dev server is running
curl http://localhost:3000

# Restart dev server
# Kill old process: Ctrl+C
npm run dev

# Check Supabase connection
# Open browser console and run:
# import { supabase } from './lib/supabase';
# const { data } = await supabase.from('claims').select('*');
# console.log(data);

# View environment variables
cat .env.local
```

---

## 🎯 Success Criteria for Today

✅ **Must Have**:
1. Photo upload works
2. Form submits to Supabase
3. New claim appears in dashboard
4. Photos stored in Supabase Storage

🎁 **Nice to Have**:
1. Upload progress bars
2. Photo preview grid looks good
3. 24-hour deadline validation
4. Success toast notification

---

## 🔜 Tomorrow's Tasks

1. **Admin Dashboard**: Connect ClaimsTable to live data
2. **Claim Review**: Implement approve/reject functionality
3. **Mobile Testing**: Test on actual phone
4. **Error Handling**: Add better error messages
5. **Loading States**: Add spinners and skeletons

---

**Need Help?**
- Check `PROJECT_PLAN.md` for detailed architecture
- Check `src/lib/claims.ts` for all available functions
- Check Supabase dashboard for data verification
- Check browser console for errors

**Current Status**: Phase 1 Complete ✅ | Ready for Phase 2 🚀

