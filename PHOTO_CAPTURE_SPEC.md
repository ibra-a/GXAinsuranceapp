# 📸 Live Photo Capture - Anti-Fraud Specification

## 🎯 Requirement
**4 mandatory live photos** of the vehicle to prevent fraud:
1. **Front view** (entire front bumper, hood, license plate)
2. **Rear view** (entire back bumper, trunk, license plate)
3. **Left side** (driver side, full length)
4. **Right side** (passenger side, full length)

## 🔒 Security Features

### 1. Live Camera Only (No Gallery Uploads)
```typescript
// MUST use device camera, NOT file picker
navigator.mediaDevices.getUserMedia({ video: true })

// Block file input for required photos
<input type="file" capture="environment" accept="image/*" />
```

**Why**: Prevents users from uploading old photos or downloaded images.

### 2. EXIF Metadata Validation
```typescript
interface PhotoMetadata {
  timestamp: Date;          // When photo was taken
  gps_coordinates?: {       // Optional: accident location
    latitude: number;
    longitude: number;
  };
  device_info: string;      // Camera/phone used
}
```

**Checks**:
- ✅ Photo timestamp within last 5 minutes of capture
- ✅ GPS matches reported accident location (optional)
- ✅ Sequential timestamps (can't be from different times)

### 3. Real-time Upload (No Local Storage)
```typescript
// Upload immediately after capture
// Don't allow "save for later"
capturePhoto() → validateMetadata() → uploadToSupabase() → markComplete()
```

**Why**: Prevents photo manipulation or editing.

---

## 🎨 UI/UX Flow

### Step-by-Step Capture Process

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: Front View                           [1/4]     │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                   │   │
│  │          📷 CAMERA VIEWFINDER                    │   │
│  │                                                   │   │
│  │     ┌─────────────────────────────────┐          │   │
│  │     │                                 │          │   │
│  │     │    Position vehicle FRONT       │          │   │
│  │     │    in frame                     │          │   │
│  │     │                                 │          │   │
│  │     └─────────────────────────────────┘          │   │
│  │                                                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  Instructions:                                           │
│  • Capture the entire front of the vehicle              │
│  • Include license plate in frame                       │
│  • Show all visible damage                              │
│  • Ensure good lighting                                 │
│                                                          │
│                  [ 📸 Capture Photo ]                   │
│                                                          │
└─────────────────────────────────────────────────────────┘

After capture → Upload → Show checkmark → Next angle
```

### Progress Indicator
```
Required Photos:
[✅] Front View     [Retake]
[✅] Rear View      [Retake]
[⏳] Left Side      ← Current
[⬜] Right Side

[Continue] button disabled until all 4 complete
```

---

## 💻 Technical Implementation

### 1. Camera Component
```typescript
// PhotoCaptureStep.tsx
interface PhotoCaptureStepProps {
  angle: 'front' | 'rear' | 'left' | 'right';
  onCapture: (photo: CapturedPhoto) => void;
  onRetake: () => void;
}

interface CapturedPhoto {
  blob: Blob;
  dataUrl: string;
  metadata: PhotoMetadata;
  angle: string;
  timestamp: Date;
}

export function PhotoCaptureStep({ angle, onCapture }: PhotoCaptureStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<CapturedPhoto | null>(null);
  
  // Start camera
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);
  
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      toast.error('Camera access denied. Please enable camera permissions.');
    }
  };
  
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    
    // Create canvas to capture frame
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);
    
    // Convert to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      // Extract EXIF metadata
      const metadata = await extractMetadata(blob);
      
      // Validate timestamp (must be within last 5 min)
      if (!isRecentPhoto(metadata.timestamp)) {
        toast.error('Photo appears to be old. Please capture a new photo.');
        return;
      }
      
      const photo: CapturedPhoto = {
        blob,
        dataUrl: canvas.toDataURL('image/jpeg', 0.85),
        metadata,
        angle,
        timestamp: new Date()
      };
      
      setCaptured(photo);
      stopCamera();
      
      // Upload immediately
      await uploadPhoto(photo);
      
      onCapture(photo);
    }, 'image/jpeg', 0.85);
  };
  
  return (
    <div className="photo-capture">
      {!captured ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-96 object-cover rounded-lg"
          />
          
          <div className="instructions">
            <h3>Capture {angle} view</h3>
            <ul>
              <li>Position entire {angle} of vehicle in frame</li>
              <li>Include license plate</li>
              <li>Show all visible damage</li>
              <li>Ensure good lighting</li>
            </ul>
          </div>
          
          <Button onClick={capturePhoto} size="lg">
            📸 Capture {angle} View
          </Button>
        </>
      ) : (
        <>
          <img 
            src={captured.dataUrl} 
            alt={`${angle} view`}
            className="w-full h-96 object-cover rounded-lg"
          />
          
          <div className="flex gap-4">
            <Button onClick={onRetake} variant="outline">
              🔄 Retake
            </Button>
            <Button onClick={() => onCapture(captured)}>
              ✅ Looks Good - Continue
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

### 2. Metadata Extraction & Validation
```typescript
// src/lib/photoValidation.ts

import EXIF from 'exif-js'; // npm install exif-js

export async function extractMetadata(blob: Blob): Promise<PhotoMetadata> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = e.target?.result;
      
      EXIF.getData(data, function() {
        const exifData = EXIF.getAllTags(this);
        
        resolve({
          timestamp: exifData.DateTimeOriginal 
            ? new Date(exifData.DateTimeOriginal)
            : new Date(),
          gps_coordinates: exifData.GPSLatitude && exifData.GPSLongitude
            ? {
                latitude: convertDMSToDD(exifData.GPSLatitude, exifData.GPSLatitudeRef),
                longitude: convertDMSToDD(exifData.GPSLongitude, exifData.GPSLongitudeRef)
              }
            : undefined,
          device_info: exifData.Make && exifData.Model
            ? `${exifData.Make} ${exifData.Model}`
            : 'Unknown device'
        });
      });
    };
    
    reader.readAsDataURL(blob);
  });
}

export function isRecentPhoto(timestamp: Date): boolean {
  const now = Date.now();
  const photoTime = timestamp.getTime();
  const minutesSince = (now - photoTime) / (1000 * 60);
  
  // Must be within last 5 minutes
  return minutesSince <= 5;
}

export function validatePhotoSequence(photos: CapturedPhoto[]): boolean {
  if (photos.length < 4) return false;
  
  // Check all photos taken within same session (30 min window)
  const timestamps = photos.map(p => p.timestamp.getTime());
  const earliest = Math.min(...timestamps);
  const latest = Math.max(...timestamps);
  const sessionDuration = (latest - earliest) / (1000 * 60);
  
  return sessionDuration <= 30; // All within 30 minutes
}

export function validateGPSLocation(
  photoCoords: { latitude: number; longitude: number },
  accidentCoords: { latitude: number; longitude: number }
): boolean {
  // Calculate distance between photo location and reported accident location
  const distance = calculateDistance(photoCoords, accidentCoords);
  
  // Must be within 500 meters (0.5km)
  return distance <= 0.5;
}

function calculateDistance(
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
): number {
  // Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
    Math.cos(toRad(coord2.latitude)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
```

---

### 3. Database Schema Update
```sql
-- Update claims table to track photo metadata
ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS photo_metadata JSONB;

-- Example structure:
{
  "photos": [
    {
      "angle": "front",
      "url": "https://...",
      "timestamp": "2025-10-26T20:15:30Z",
      "gps": { "lat": 48.8566, "lng": 2.3522 },
      "device": "iPhone 13 Pro",
      "verified": true
    },
    // ... 3 more
  ],
  "capture_session": {
    "started_at": "2025-10-26T20:10:00Z",
    "completed_at": "2025-10-26T20:17:00Z",
    "duration_minutes": 7,
    "all_verified": true
  }
}
```

---

## 🎨 Enhanced NewClaimModal Flow

### Updated Step Sequence
```
Step 1: Accident Details (datetime, location, description)
          ↓
Step 2: Vehicle Info (make, model, plate)
          ↓
Step 3: Contact Info (name, email, phone, policy)
          ↓
Step 4: REQUIRED PHOTOS (NEW - 4 live captures)
   ├─ 4.1: Capture Front View
   ├─ 4.2: Capture Rear View
   ├─ 4.3: Capture Left Side
   └─ 4.4: Capture Right Side
          ↓
Step 5: OPTIONAL PHOTOS (damage close-ups, max 6)
   └─ Can use gallery or camera
          ↓
Step 6: Review & Submit
```

---

## 🛡️ Fraud Prevention Features

### 1. Required Photos (4 angles)
- ✅ MUST use live camera
- ✅ MUST be taken in sequence
- ✅ MUST have recent timestamps
- ✅ Cannot skip or bypass
- ✅ Uploaded immediately (no local storage)

### 2. Optional Photos (damage close-ups)
- 📷 Can use camera OR gallery
- 🎯 Max 6 additional photos
- 📝 For detailed damage documentation
- ⚠️ Still validated for size/format

### 3. Admin Verification Indicators
```typescript
// In AdminClaimManagementModal
<div className="photo-verification-status">
  {claim.photo_metadata.all_verified ? (
    <Badge className="bg-green-500">
      ✅ All Photos Verified
    </Badge>
  ) : (
    <Badge className="bg-red-500">
      ⚠️ Photo Verification Issues
    </Badge>
  )}
  
  <div className="verification-details">
    <p>Capture Session: {formatDuration(metadata.capture_session.duration_minutes)}</p>
    <p>Device: {metadata.photos[0].device}</p>
    {metadata.photos[0].gps && (
      <p>Location: {formatCoordinates(metadata.photos[0].gps)}</p>
    )}
  </div>
</div>
```

---

## 📱 Mobile Considerations

### Camera Permissions
```typescript
// Check and request permissions
async function requestCameraPermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    return true;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      toast.error('Camera access denied. Please enable in Settings.');
      return false;
    }
    throw error;
  }
}

// iOS Safari requires HTTPS for camera access
// Make sure dev environment uses https://localhost:3000
```

### Storage Optimization
```typescript
// Compress photos before upload (reduce bandwidth)
async function compressPhoto(blob: Blob): Promise<Blob> {
  const options = {
    maxSizeMB: 1,          // Max 1MB per photo
    maxWidthOrHeight: 1920, // Max 1920px
    useWebWorker: true,
    fileType: 'image/jpeg',
    quality: 0.85
  };
  
  return await imageCompression(blob, options);
}
```

---

## 🧪 Testing Checklist

### Happy Path
- [ ] Request camera permission
- [ ] Capture front view
- [ ] Upload to Supabase Storage
- [ ] Show checkmark
- [ ] Repeat for rear, left, right
- [ ] All 4 photos verified
- [ ] Continue button enabled
- [ ] Submit claim successfully

### Edge Cases
- [ ] Camera permission denied
- [ ] Camera not available (desktop)
- [ ] Poor lighting warning
- [ ] Photo timestamp validation
- [ ] GPS validation (if available)
- [ ] Network failure during upload
- [ ] Retry failed upload
- [ ] Switch to different camera (front/back)

### Fraud Attempts
- [ ] Block file picker for required photos
- [ ] Reject old photos (timestamp check)
- [ ] Reject photos taken at different times
- [ ] Flag GPS mismatch (if available)
- [ ] Detect photo editing/manipulation

---

## 💡 Additional Ideas

### 1. AI Damage Detection (Future)
```typescript
// Use ML model to detect damage in photos
// Highlight areas of concern for admin review
const damageAnalysis = await detectDamage(photoBlob);

if (damageAnalysis.confidence < 0.5) {
  // Flag for manual review
  warnings.push('AI could not detect visible damage');
}
```

### 2. Watermark with Metadata
```typescript
// Add timestamp + GPS watermark to photo
// Makes it harder to reuse photos
function addWatermark(photo: Blob, metadata: PhotoMetadata): Blob {
  // Overlay: "GXA Claims - [timestamp] - [location]"
  // Semi-transparent, bottom corner
}
```

### 3. Photo Comparison (Repeat Claims)
```typescript
// Check if same vehicle photos used before
// Flag potential duplicate claims
async function checkDuplicatePhotos(photoHashes: string[]): Promise<boolean> {
  const { data } = await supabase
    .from('claims')
    .select('photo_metadata')
    .not('id', 'eq', currentClaimId);
    
  // Compare perceptual hashes
  // Return true if match found
}
```

---

## 📊 Database Storage

### File Structure in Supabase Storage
```
claim-photos/
├── CLM-20251026201530/
│   ├── required/
│   │   ├── front-20251026201545.jpg
│   │   ├── rear-20251026201612.jpg
│   │   ├── left-20251026201633.jpg
│   │   └── right-20251026201655.jpg
│   └── optional/
│       ├── damage-closeup-1.jpg
│       └── damage-closeup-2.jpg
```

### Metadata Storage
```typescript
// In claims table
photo_metadata: {
  required_photos: [
    {
      angle: 'front',
      url: 'https://...',
      timestamp: '2025-10-26T20:15:45Z',
      gps: { lat: 48.8566, lng: 2.3522 },
      verified: true,
      file_size: 1024567,
      dimensions: { width: 1920, height: 1080 }
    },
    // ... 3 more
  ],
  optional_photos: [
    // Max 6 additional
  ],
  verification_status: 'verified' | 'pending' | 'flagged'
}
```

---

## 🎯 Implementation Priority

### Phase 2A: Core Photo Capture (HIGH PRIORITY)
1. ✅ Camera access component
2. ✅ 4-step photo capture flow
3. ✅ Live preview and retake
4. ✅ Immediate upload to Supabase
5. ✅ Progress indicator

### Phase 2B: Validation (HIGH PRIORITY)
1. ✅ Timestamp validation
2. ✅ Photo sequence validation
3. ✅ Block gallery uploads for required photos
4. ✅ Metadata extraction

### Phase 2C: Optional Enhancements (MEDIUM PRIORITY)
1. GPS validation
2. Compression
3. Watermarking
4. AI damage detection

---

## 📦 Dependencies Needed

```json
{
  "dependencies": {
    "exif-js": "^2.3.0",              // EXIF metadata extraction
    "browser-image-compression": "^2.0.0",  // Image compression
    "react-webcam": "^7.2.0"          // Alternative camera component
  }
}
```

**Or use native approach** (recommended for better control):
- `navigator.mediaDevices.getUserMedia()` - No extra deps!

---

**This is a CRITICAL anti-fraud feature!** 🔐

Would you like me to implement this now? I'll start with:
1. PhotoCaptureStep component
2. 4-angle capture flow in NewClaimModal
3. Metadata validation
4. Update database schema

This is definitely more important than allowing random gallery uploads! 🎯

