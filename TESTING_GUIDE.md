# 🧪 Testing Guide - Live Camera Capture

## 🚀 Quick Test (5 minutes)

### 1. Open the App
```
http://localhost:3000
```

### 2. Verify Current State
You should see:
- ✅ Dashboard with 3 existing claims
- ✅ Stats: 3 total, 1 pending, 1 approved, 1 rejected
- ✅ "New Claim" button in Quick Actions

### 3. Test Photo Capture Flow

#### Step 1: Click "New Claim"
- Modal should open with gradient header
- Progress bar shows "Step 1 of 8"

#### Step 2: Fill Accident Info
```
Policy Number: POL-TEST-001
Accident Date & Time: [Select today, 2 hours ago]
Description: Test claim for live camera capture
```
- Green checkmark should appear under date (within 24 hours)
- "Continue" button should be enabled
- Click "Continue to Vehicle Info"

#### Step 3: Fill Vehicle Info
```
Make: Toyota
Model: Camry
License Plate: TEST-123
```
- Click "Continue"

#### Step 4: Fill Contact Info
```
Name: Test User
Email: test@example.com
Phone: +1 234 567 8900
```
- Click "Start Photo Capture"

#### Step 5-8: Capture 4 Photos

**Front View:**
1. Camera should activate (you'll see yourself/surroundings)
2. If prompted, allow camera access
3. Position something in frame (your desk, a coffee mug, anything)
4. Click "Capture Photo"
5. Wait 2-3 seconds for upload
6. Click "Continue"
7. Should auto-advance to Rear View

**Rear View:**
- Repeat same process
- Auto-advances to Left Side

**Left Side:**
- Repeat same process
- Auto-advances to Right Side

**Right Side:**
- Repeat same process
- Auto-advances to Review

#### Step 9: Review & Submit
- Should see all 4 captured photos in a grid
- Vehicle details displayed
- Click "Submit Claim"
- Wait 2-3 seconds
- Success toast should appear
- Page should refresh
- **New claim should appear in dashboard!**

---

## 🎯 What to Verify

### ✅ Camera Functionality
- [ ] Camera activates automatically
- [ ] Video preview shows live feed
- [ ] Can capture photo
- [ ] Photo appears in preview
- [ ] Can retake photo
- [ ] Upload shows success

### ✅ Form Validation
- [ ] Can't continue without required fields
- [ ] 24-hour deadline warning works
- [ ] Green checkmark for valid date
- [ ] Red warning for date > 24h ago

### ✅ Photo Upload
- [ ] Upload happens immediately after capture
- [ ] Upload progress visible
- [ ] Success checkmark appears
- [ ] Auto-advance to next photo

### ✅ Submission
- [ ] Review screen shows all 4 photos
- [ ] Can't submit without all 4 photos
- [ ] Submit button shows loading state
- [ ] Success toast appears
- [ ] Dashboard refreshes
- [ ] New claim visible in list

---

## 🐛 Troubleshooting

### Camera Not Working

**Symptom**: "Camera access denied" error

**Solutions**:
1. Check browser permissions (click lock icon in URL bar)
2. Must use `https://` or `localhost` for camera access
3. Try different browser (Chrome recommended)
4. Restart browser
5. Check if another app is using camera

### Upload Failing

**Symptom**: Photo captured but upload fails

**Solutions**:
1. Check internet connection
2. Verify `.env.local` has correct Supabase credentials:
   ```bash
   cat .env.local
   ```
3. Check Supabase dashboard - is `claim-photos` bucket created?
4. Check browser console for errors (F12)

### Photos Not Appearing in Dashboard

**Symptom**: Claim submits but no photos show

**Solutions**:
1. Check Supabase Storage browser
2. Navigate to `claim-photos` bucket
3. Should see folder with claim number
4. Should see `required/front-*.jpg` etc.
5. Check `claims` table in Supabase - `photo_urls` column

### Form Won't Submit

**Symptom**: Submit button disabled or errors

**Solutions**:
1. Verify all 4 photos captured (front, rear, left, right)
2. Check console for validation errors
3. Verify accident date is within 24 hours
4. Check all required fields filled

---

## 📱 Mobile Testing

### iOS Safari
```
1. Open Safari on iPhone
2. Go to http://[your-computer-ip]:3000
3. Grant camera permission when prompted
4. Test full flow
5. Verify back camera is used
6. Check photo quality
```

### Android Chrome
```
1. Open Chrome on Android
2. Go to http://[your-computer-ip]:3000
3. Grant camera permission
4. Test full flow
5. Verify back camera is used
6. Check upload speed
```

### To Find Your Computer's IP:
```bash
# Mac
ipconfig getifaddr en0

# Windows
ipconfig

# Linux
hostname -I
```

Then access: `http://192.168.x.x:3000`

---

## 🔍 Advanced Testing

### Test 24-Hour Deadline

**Test**: Try to submit claim for accident > 24 hours ago

1. Fill form normally
2. Set accident date to **yesterday** or earlier
3. Should see: "⚠️ Claims must be submitted within 24 hours"
4. Time remaining shows: "⚠️ 24-hour deadline passed"
5. Continue button should work but show warning

### Test Photo Validation

**Test**: Verify photo metadata is correct

1. Submit a claim with photos
2. Open Supabase dashboard
3. Go to Table Editor → `claims`
4. Find your test claim
5. Check `photo_urls` column - should have 4 URLs
6. Click each URL - should open photo in browser

### Test Photo Storage

**Test**: Verify photos are organized correctly

1. Open Supabase dashboard
2. Go to Storage → `claim-photos`
3. Find folder with your claim number (e.g., `CLM-20251026210530`)
4. Inside should be `required/` folder
5. Inside `required/` should be:
   - `front-[timestamp].jpg`
   - `rear-[timestamp].jpg`
   - `left-[timestamp].jpg`
   - `right-[timestamp].jpg`

### Test Sequential Capture

**Test**: Verify photos are taken in sequence

1. Look at file timestamps in Storage
2. Should be 10-30 seconds apart
3. Order should be: front → rear → left → right

---

## 📊 Performance Testing

### Measure Upload Speed

1. Open browser console (F12)
2. Go to Network tab
3. Start photo capture
4. Capture first photo
5. Watch for upload request
6. Note size and time

**Expected**:
- Photo size: 500KB - 1.5MB (after compression)
- Upload time: 2-5 seconds (depends on connection)

### Measure Total Flow Time

1. Start timer when clicking "New Claim"
2. Fill form (use tab key for speed)
3. Capture 4 photos (don't rush, simulate real use)
4. Review and submit
5. Stop timer when success toast appears

**Target**: < 5 minutes total

---

## ✅ Success Criteria

### Minimum Requirements
- [ ] Camera activates on all 4 photo steps
- [ ] Photos capture and upload successfully
- [ ] All 4 photos required to submit
- [ ] Claim appears in dashboard after submit
- [ ] Photos visible in Supabase Storage

### Nice to Have
- [ ] Upload completes in < 5 seconds per photo
- [ ] Total flow takes < 5 minutes
- [ ] Works on mobile (iOS/Android)
- [ ] Photos are properly compressed (< 1.5MB each)

---

## 🚨 Critical Test Cases

### Test Case 1: Happy Path
**Steps**: Fill form → Capture 4 photos → Submit
**Expected**: Success! New claim in dashboard

### Test Case 2: Camera Permission Denied
**Steps**: Deny camera permission → Try to capture
**Expected**: Error message with instructions

### Test Case 3: Network Failure
**Steps**: Turn off WiFi → Try to submit
**Expected**: Error message, data saved locally (future)

### Test Case 4: Missing Photos
**Steps**: Capture only 3 photos → Try to review
**Expected**: Can't proceed to submit without all 4

### Test Case 5: Late Submission
**Steps**: Set accident date to 2 days ago → Try to submit
**Expected**: Warning shown but can still proceed (for demo)

---

## 📝 Test Report Template

```
Date: _____________
Tester: _____________
Device: _____________
Browser: _____________

✅ Camera Access: [ PASS / FAIL ]
✅ Photo Capture: [ PASS / FAIL ]
✅ Photo Upload: [ PASS / FAIL ]
✅ Form Validation: [ PASS / FAIL ]
✅ Claim Submission: [ PASS / FAIL ]
✅ Dashboard Update: [ PASS / FAIL ]

Upload Speed: _____ seconds per photo
Total Time: _____ minutes

Issues Found:
1. 
2. 
3. 

Notes:



```

---

## 🎉 Next Steps After Testing

### If Tests Pass ✅
1. Mark testing TODO as complete
2. Move to Phase 3 (Admin Dashboard)
3. Test on real mobile device
4. Show to stakeholders

### If Tests Fail ❌
1. Document issues in testing report
2. Check console for errors
3. Review implementation
4. Fix bugs
5. Re-test

---

**Ready to test?** Open http://localhost:3000 and start with the Quick Test! 🚀

