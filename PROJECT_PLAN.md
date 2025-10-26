# GXA Claims Prototype - Project Plan & Architecture

## 🎯 Project Overview
A mobile-first web application for submitting and managing car accident insurance claims with a 24-hour submission window from the time of the accident.

---

## 📊 Current Status

### ✅ Completed (Phase 1 - Backend Foundation)
- [x] Supabase project setup (GXA)
- [x] Database schema design and implementation
- [x] `claims` table with proper columns and constraints
- [x] Row Level Security (RLS) policies
- [x] Storage bucket (`claim-photos`) for photo uploads
- [x] Sample data (3 claims: pending, approved, rejected)
- [x] Supabase client configuration
- [x] TypeScript types for database schema
- [x] Real-time data fetching for dashboard
- [x] Stats overview with live data
- [x] Recent claims display with live data

---

## 🏗️ Architecture

### Tech Stack
```
Frontend:
├── React 18 (with TypeScript)
├── Vite (build tool)
├── Tailwind CSS (styling)
├── shadcn/ui (component library)
├── Framer Motion (animations)
└── Lucide React (icons)

Backend:
├── Supabase (PostgreSQL database)
├── Supabase Storage (file uploads)
├── Supabase Auth (future: user authentication)
└── Row Level Security (RLS)
```

### Database Schema

#### `claims` Table
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | Auto-generated |
| `created_at` | TIMESTAMPTZ | Record creation time | Auto |
| `updated_at` | TIMESTAMPTZ | Last update time | Auto-trigger |
| `claim_number` | TEXT | Unique claim identifier | UNIQUE, e.g., CLM-20251026174814 |
| `user_name` | TEXT | Claimant's full name | NOT NULL |
| `policy_number` | TEXT | Insurance policy number | NOT NULL |
| `contact_email` | TEXT | Contact email | NOT NULL |
| `contact_phone` | TEXT | Contact phone | NOT NULL |
| `accident_datetime` | TIMESTAMPTZ | When accident occurred | NOT NULL |
| `submission_datetime` | TIMESTAMPTZ | When claim submitted | Auto |
| `vehicle_plate` | TEXT | License plate | NOT NULL |
| `vehicle_make` | TEXT | Vehicle manufacturer | NOT NULL |
| `vehicle_model` | TEXT | Vehicle model | NOT NULL |
| `accident_description` | TEXT | Detailed description | NOT NULL |
| `photo_urls` | TEXT[] | Array of photo URLs | Array |
| `status` | TEXT | Claim status | CHECK: pending/approved/rejected |
| `admin_notes` | TEXT | Admin comments | Nullable |

#### Storage Buckets
- **`claim-photos`**: Public bucket for accident photos
  - Structure: `{claim_number}/{filename}`
  - Supported formats: JPEG, PNG, HEIC
  - Max file size: 10MB per photo
  - Max photos per claim: 10

---

## 📋 Phase Breakdown

### ✅ Phase 1: Backend Foundation (COMPLETED)
**Goal**: Set up database, storage, and real-time data integration

**Tasks Completed**:
1. ✅ Supabase project configuration
2. ✅ Database schema implementation
3. ✅ RLS policies for public access (demo mode)
4. ✅ Storage bucket creation
5. ✅ Supabase client setup (`src/lib/supabase.ts`)
6. ✅ Claims utility functions (`src/lib/claims.ts`)
7. ✅ Real-time data fetching in components
8. ✅ Sample data insertion

---

### 🚧 Phase 2: Claim Submission Flow (IN PROGRESS)
**Goal**: Enable users to submit new claims with photos

#### 2.1 Form Validation & UX
**Priority**: HIGH
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] **Step 1**: Review `NewClaimModal.tsx` component
  - Located: `src/components/NewClaimModal.tsx`
  - Current state: Mock UI with static form
  
- [ ] **Step 2**: Implement form validation
  ```typescript
  // What we need:
  - Real-time field validation
  - Required field checks
  - Email format validation
  - Phone number format validation
  - Date/time validation (must be within last 24 hours)
  - Vehicle plate format validation
  ```

- [ ] **Step 3**: Add validation feedback
  - Error messages below each field
  - Visual indicators (red border, error icons)
  - Success indicators (green checkmark)
  - Disable submit button until form is valid

**Files to Edit**:
- `src/components/NewClaimModal.tsx`

**Technical Approach**:
```typescript
// Example validation structure
interface FormErrors {
  user_name?: string;
  policy_number?: string;
  contact_email?: string;
  contact_phone?: string;
  accident_datetime?: string;
  vehicle_plate?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  accident_description?: string;
  photos?: string;
}

const validateForm = (data: ClaimFormData): FormErrors => {
  const errors: FormErrors = {};
  
  // Check 24-hour window
  const hoursSinceAccident = (Date.now() - new Date(data.accident_datetime).getTime()) / (1000 * 60 * 60);
  if (hoursSinceAccident > 24) {
    errors.accident_datetime = "⚠️ Claims must be submitted within 24 hours of the accident";
  }
  
  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) {
    errors.contact_email = "Please enter a valid email address";
  }
  
  // Add more validations...
  return errors;
};
```

---

#### 2.2 Photo Upload Implementation
**Priority**: HIGH
**Estimated Time**: 3-4 hours

**Tasks**:
- [ ] **Step 1**: Design photo upload UI
  - Drag & drop zone
  - File input button
  - Photo preview grid
  - Delete photo button
  - Upload progress indicator
  - Max 10 photos limit

- [ ] **Step 2**: Implement photo validation
  ```typescript
  - File type: JPEG, PNG, HEIC only
  - File size: Max 10MB per photo
  - Total photos: Max 10
  - Image dimensions: Recommend min 800x600
  ```

- [ ] **Step 3**: Upload to Supabase Storage
  ```typescript
  // Use existing function in src/lib/claims.ts
  export async function uploadClaimPhoto(
    file: File, 
    claimNumber: string
  ): Promise<string | null>
  ```

- [ ] **Step 4**: Display upload progress
  - Individual file progress bars
  - Overall upload status
  - Error handling for failed uploads
  - Retry mechanism

- [ ] **Step 5**: Store photo URLs in claim
  ```typescript
  // After upload, add URLs to photo_urls array
  export async function addPhotoToClaim(
    id: string, 
    photoUrl: string
  ): Promise<boolean>
  ```

**Files to Edit**:
- `src/components/NewClaimModal.tsx`
- `src/lib/claims.ts` (already has upload functions)

**UI Components Needed**:
```typescript
// PhotoUploadZone Component
interface PhotoUploadZoneProps {
  photos: File[];
  onPhotosChange: (files: File[]) => void;
  maxPhotos?: number;
  maxSizePerPhoto?: number; // in bytes
}

// PhotoPreviewGrid Component
interface PhotoPreviewGridProps {
  photos: File[];
  onRemove: (index: number) => void;
  uploadProgress?: Record<number, number>; // index -> percentage
}
```

---

#### 2.3 Claim Submission Integration
**Priority**: HIGH
**Estimated Time**: 2 hours

**Tasks**:
- [ ] **Step 1**: Generate unique claim number
  ```typescript
  // Use existing function
  import { generateClaimNumber } from '../lib/claims';
  // Format: CLM-20251026174814
  ```

- [ ] **Step 2**: Create claim in database
  ```typescript
  import { createClaim } from '../lib/claims';
  
  const newClaim: ClaimInsert = {
    claim_number: generateClaimNumber(),
    user_name: formData.user_name,
    policy_number: formData.policy_number,
    // ... rest of fields
    photo_urls: uploadedPhotoUrls,
    status: 'pending'
  };
  
  const result = await createClaim(newClaim);
  ```

- [ ] **Step 3**: Handle submission states
  - Loading state (disable form, show spinner)
  - Success state (show confirmation, close modal)
  - Error state (show error message, allow retry)

- [ ] **Step 4**: Success feedback
  - Toast notification with claim number
  - Redirect to claim details or dashboard
  - Update claims list in real-time

**Files to Edit**:
- `src/components/NewClaimModal.tsx`
- `src/components/UserDashboard.tsx` (refresh claims after submission)

---

#### 2.4 24-Hour Deadline Indicator
**Priority**: MEDIUM
**Estimated Time**: 1 hour

**Tasks**:
- [ ] **Step 1**: Add countdown timer to form
  ```typescript
  // Show time remaining based on accident_datetime
  import { getTimeRemaining } from '../lib/claims';
  
  const [timeRemaining, setTimeRemaining] = useState('');
  
  useEffect(() => {
    if (accidentDatetime) {
      const interval = setInterval(() => {
        setTimeRemaining(getTimeRemaining(accidentDatetime));
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [accidentDatetime]);
  ```

- [ ] **Step 2**: Visual warning indicators
  - Green: > 12 hours remaining
  - Yellow: 6-12 hours remaining
  - Red: < 6 hours remaining
  - Critical: < 1 hour remaining

- [ ] **Step 3**: Block submission if deadline passed
  ```typescript
  import { isWithin24Hours } from '../lib/claims';
  
  const canSubmit = isWithin24Hours(accidentDatetime);
  ```

**Files to Edit**:
- `src/components/NewClaimModal.tsx`

---

### 🔮 Phase 3: Admin Dashboard Enhancement
**Goal**: Enable admins to review and process claims efficiently

#### 3.1 Claims Table with Live Data
**Priority**: MEDIUM
**Estimated Time**: 2 hours

**Tasks**:
- [ ] **Step 1**: Update `ClaimsTable.tsx` to fetch real data
  ```typescript
  import { getClaimsByStatus } from '../lib/claims';
  
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadClaims();
  }, [filterStatus]);
  ```

- [ ] **Step 2**: Implement filtering and search
  - Filter by status: all, pending, approved, rejected
  - Search by claim number, user name, vehicle
  - Date range filter

- [ ] **Step 3**: Add sorting
  - Sort by date (newest/oldest)
  - Sort by status
  - Sort by user name

- [ ] **Step 4**: Pagination (if needed)
  - Show 20 claims per page
  - Load more button or infinite scroll

**Files to Edit**:
- `src/components/ClaimsTable.tsx`
- `src/components/AdminStatsOverview.tsx`

---

#### 3.2 Claim Review & Management
**Priority**: MEDIUM
**Estimated Time**: 3 hours

**Tasks**:
- [ ] **Step 1**: Update `AdminClaimManagementModal.tsx`
  - Display all claim details
  - Show photo gallery (full size view)
  - Show submission timestamp vs accident timestamp
  - Calculate time difference

- [ ] **Step 2**: Implement status update
  ```typescript
  import { updateClaimStatus } from '../lib/claims';
  
  const handleApprove = async () => {
    await updateClaimStatus(claim.id, 'approved', adminNotes);
    // Refresh claims list
    onStatusUpdate();
  };
  ```

- [ ] **Step 3**: Add admin notes functionality
  - Text area for notes
  - Save notes with status update
  - Display notes history

- [ ] **Step 4**: Action buttons
  - Approve with notes
  - Reject with reason
  - Request more information (future)
  - Download claim PDF (future)

**Files to Edit**:
- `src/components/AdminClaimManagementModal.tsx`

---

#### 3.3 Real-time Updates
**Priority**: LOW
**Estimated Time**: 2 hours

**Tasks**:
- [ ] **Step 1**: Set up Supabase real-time subscription
  ```typescript
  useEffect(() => {
    const subscription = supabase
      .channel('claims-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'claims' },
        (payload) => {
          // Update local state
          handleClaimUpdate(payload);
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  ```

- [ ] **Step 2**: Update UI on changes
  - New claims appear automatically
  - Status updates reflect immediately
  - Toast notification for new claims

**Files to Edit**:
- `src/components/AdminDashboard.tsx`
- `src/components/UserDashboard.tsx`

---

### 🎨 Phase 4: UI/UX Polish
**Goal**: Enhance user experience and visual design

#### 4.1 Mobile Optimization
**Priority**: HIGH (since mobile-first)
**Estimated Time**: 3 hours

**Tasks**:
- [ ] Test on mobile devices (iPhone, Android)
- [ ] Fix layout issues on small screens
- [ ] Optimize touch targets (min 44x44px)
- [ ] Test photo upload on mobile
- [ ] Improve form keyboard navigation
- [ ] Add swipe gestures for modals

---

#### 4.2 Loading States & Skeletons
**Priority**: MEDIUM
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Add skeleton loaders for:
  - Stats cards
  - Claims list
  - Claim details modal
  - Photo gallery

- [ ] Implement smooth transitions
- [ ] Add loading spinners for actions
- [ ] Show progress for photo uploads

---

#### 4.3 Error Handling
**Priority**: HIGH
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Network error handling
  ```typescript
  - Offline detection
  - Retry mechanism
  - Queue actions for when back online
  ```

- [ ] User-friendly error messages
  ```typescript
  - "No internet connection"
  - "Failed to upload photo. Please try again."
  - "Claim submission failed. Your data is saved locally."
  ```

- [ ] Error boundaries
  ```typescript
  // Catch React errors gracefully
  <ErrorBoundary fallback={<ErrorPage />}>
    <App />
  </ErrorBoundary>
  ```

---

### 🔐 Phase 5: Authentication & Security
**Goal**: Add user authentication and secure access

#### 5.1 Supabase Auth Integration
**Priority**: LOW (for MVP, can be added later)
**Estimated Time**: 4 hours

**Tasks**:
- [ ] Set up Supabase Auth
- [ ] Login/Signup forms
- [ ] Email verification
- [ ] Password reset
- [ ] Update RLS policies for authenticated users
- [ ] User profile management

---

### 🧪 Phase 6: Testing & Deployment
**Goal**: Ensure quality and deploy to production

#### 6.1 Testing
**Priority**: MEDIUM
**Estimated Time**: 4 hours

**Tasks**:
- [ ] Manual testing checklist
  - [ ] Submit claim (happy path)
  - [ ] Submit claim with photos
  - [ ] Submit claim after 24h (should fail)
  - [ ] Admin approve claim
  - [ ] Admin reject claim
  - [ ] Test on mobile
  - [ ] Test offline behavior

- [ ] Browser testing
  - [ ] Chrome
  - [ ] Safari
  - [ ] Firefox
  - [ ] Mobile Safari
  - [ ] Mobile Chrome

---

#### 6.2 Deployment
**Priority**: LOW (when ready)
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Set up hosting (Vercel/Netlify)
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Configure Supabase production settings
- [ ] Set up monitoring (Sentry)

---

## 🎯 Immediate Next Steps (Recommended Order)

### Today's Focus - Complete Phase 2.1 & 2.2
```
1. ✅ Fix environment variables (DONE)
2. ✅ Test live data display (DONE - verify in browser)
3. 🔨 Implement form validation in NewClaimModal
4. 🔨 Add photo upload functionality
5. 🔨 Connect form to Supabase
6. 🔨 Test end-to-end claim submission
```

### Tomorrow's Focus - Complete Phase 2.3 & 2.4
```
1. Polish claim submission flow
2. Add 24-hour deadline indicator
3. Implement success/error states
4. Test on mobile device
```

### This Week - Complete Phase 3
```
1. Update admin claims table with live data
2. Implement claim review functionality
3. Add admin status updates
4. Test admin workflow
```

---

## 📝 Code Organization

### Current File Structure
```
src/
├── components/
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── UserDashboard.tsx          # ✅ Using live data
│   ├── AdminDashboard.tsx         # 🔨 Needs live data
│   ├── Header.tsx
│   ├── AdminHeader.tsx
│   ├── StatsOverview.tsx          # ✅ Using live data
│   ├── AdminStatsOverview.tsx     # 🔨 Needs live data
│   ├── QuickActions.tsx
│   ├── RecentClaims.tsx           # ✅ Using live data
│   ├── ClaimsTable.tsx            # 🔨 Needs live data
│   ├── ClaimDetailsModal.tsx      # 🔨 Needs updating
│   ├── NewClaimModal.tsx          # 🔨 PRIORITY - implement submission
│   └── AdminClaimManagementModal.tsx  # 🔨 Needs updating
├── lib/
│   ├── supabase.ts               # ✅ Configured
│   ├── claims.ts                 # ✅ All functions ready
│   └── utils.ts                  # Utility functions
├── assets/                        # Images, logos
├── globals.css                    # Global styles
├── index.css                      # Tailwind imports
├── App.tsx                        # Main app component
└── main.tsx                       # Entry point
```

---

## 🤔 Key Decisions & Trade-offs

### 1. **Public RLS Policies (Current)**
**Why**: Simplifies MVP development
**Trade-off**: Not secure for production
**Future**: Implement proper authentication and row-level policies

### 2. **Mobile-First Design**
**Why**: Users will primarily use phones at accident scenes
**Trade-off**: Desktop experience may be less optimal
**Solution**: Responsive design with mobile priority

### 3. **24-Hour Hard Deadline**
**Why**: Insurance policy requirement
**Trade-off**: Users may lose access to submit
**Solution**: Clear warnings and countdown timer

### 4. **Photo Storage in Supabase**
**Why**: Simple, integrated solution
**Trade-off**: Storage costs at scale
**Alternative**: Could use Cloudinary/AWS S3 later

### 5. **No Email Notifications (MVP)**
**Why**: Speeds up development
**Trade-off**: Users don't get submission confirmation
**Future**: Add email service (SendGrid/Resend)

---

## 🐛 Known Issues & Considerations

### Current Issues
1. ⚠️ `.env` file is gitignored but `.env.local` is not tracked
   - **Solution**: Always use `.env.local` for development

2. ⚠️ No authentication yet - anyone can submit/view claims
   - **Solution**: Phase 5 - Add Supabase Auth

3. ⚠️ No email confirmations
   - **Solution**: Future enhancement

### Technical Debt
1. Mock data still in some components (ClaimsTable, AdminStatsOverview)
2. No error boundaries
3. No offline support
4. No automated tests

---

## 📊 Success Metrics

### MVP Success Criteria
- [ ] User can submit a claim in < 2 minutes
- [ ] User can upload 5 photos in < 30 seconds
- [ ] Admin can review and approve/reject in < 1 minute
- [ ] App works on mobile (iOS Safari, Android Chrome)
- [ ] 24-hour deadline validation works correctly
- [ ] All data persists to Supabase correctly

### Performance Targets
- Page load: < 2 seconds
- Photo upload: < 5 seconds per photo
- Form submission: < 3 seconds
- Real-time updates: < 1 second delay

---

## 🚀 Getting Started (For New Developers)

### Prerequisites
```bash
Node.js >= 20.19.0
npm >= 10.x
Supabase account (already set up)
```

### Setup
```bash
# 1. Clone and install
cd /Users/ibra/Projects/GXA/gxa-claim-prototype
npm install

# 2. Configure environment
cp env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Start development server
npm run dev
# Open http://localhost:3000

# 4. View Supabase dashboard
# https://supabase.com/dashboard/project/msjsvwidlmozchljtjag
```

### Development Workflow
```bash
# 1. Start dev server
npm run dev

# 2. Make changes to components

# 3. Check browser console for errors

# 4. Test Supabase queries in Supabase SQL Editor

# 5. Check real-time data in Supabase Table Editor
```

---

## 📚 Resources & Documentation

### Official Docs
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite](https://vite.dev)

### Useful Supabase Functions
```typescript
// From src/lib/claims.ts
- getAllClaims()              // Fetch all claims
- getClaimsByStatus(status)   // Filter by status
- createClaim(data)           // Submit new claim
- updateClaimStatus(id, status, notes)  // Update claim
- uploadClaimPhoto(file, claimNumber)   // Upload photo
- isWithin24Hours(datetime)   // Check deadline
- getTimeRemaining(datetime)  // Calculate countdown
```

---

## 🎓 Best Practices

### State Management
- Use React hooks (`useState`, `useEffect`)
- Keep state close to where it's used
- Use custom hooks for reusable logic

### Error Handling
```typescript
try {
  const result = await createClaim(data);
  toast.success(`Claim ${result.claim_number} submitted!`);
} catch (error) {
  console.error('Submission failed:', error);
  toast.error('Failed to submit claim. Please try again.');
}
```

### TypeScript
- Always use types from `src/lib/supabase.ts`
- Avoid `any` - use proper types
- Use interfaces for component props

### Performance
- Lazy load images
- Debounce search inputs
- Use React.memo for expensive components
- Optimize Supabase queries (select only needed columns)

---

**Last Updated**: October 26, 2025
**Project Status**: Phase 1 Complete ✅ | Phase 2 In Progress 🚧

