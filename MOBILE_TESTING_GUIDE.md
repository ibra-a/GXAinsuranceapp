# 📱 Mobile Testing Guide

## Quick Testing Checklist

### 🔧 Setup for Mobile Testing

#### Option 1: Chrome DevTools (Desktop)
1. Open `http://localhost:3000` in Chrome
2. Press `F12` or `Cmd+Option+I` (Mac)
3. Click the device toggle icon (Cmd+Shift+M)
4. Select device presets or custom dimensions

#### Option 2: Real Device Testing (Recommended)
1. Ensure your computer and phone are on the same WiFi
2. Find your local IP: `ifconfig | grep "inet "` (Mac/Linux)
3. On your phone, visit `http://YOUR_IP:3000`
4. Accept camera permissions when prompted

#### Option 3: ngrok (Remote Testing)
```bash
# Install ngrok
brew install ngrok

# Start tunnel
ngrok http 3000

# Use the https URL on any device
```

---

## 📐 Screen Size Testing Matrix

### Priority Devices (Most Common)

| Device | Width | Height | Test User Flow | Test Admin Flow |
|--------|-------|--------|----------------|-----------------|
| **iPhone SE (2020)** | 375px | 667px | ✅ | ✅ |
| **iPhone 12/13** | 390px | 844px | ✅ | ✅ |
| **iPhone 14 Pro** | 393px | 852px | ✅ | ✅ |
| **iPhone 14 Plus** | 428px | 926px | ✅ | ✅ |
| **Samsung Galaxy S21** | 360px | 800px | ✅ | ✅ |
| **Samsung Galaxy S22** | 384px | 854px | ✅ | ✅ |
| **iPad Mini** | 768px | 1024px | ✅ | ✅ |
| **iPad Pro** | 1024px | 1366px | ✅ | ✅ |

### Edge Cases

| Device | Width | Issue to Check |
|--------|-------|----------------|
| Small Android | 320px | Text doesn't overflow |
| Pixel 7 Pro | 412px | Buttons are clickable |
| iPhone 14 Pro Max | 430px | Full-screen modals |

---

## 🧪 User Flow Testing

### Test 1: New Claim Submission ✅

**Device:** iPhone 12 (390px)

1. **Dashboard Loading**
   - [ ] Stats cards stack properly
   - [ ] "New Claim" button is visible and large
   - [ ] Recent claims are readable

2. **Open New Claim Modal**
   - [ ] Modal fills screen properly
   - [ ] Close button (X) is easily tappable
   - [ ] Step indicator is visible

3. **Step 1: Form Filling**
   - [ ] All input fields are minimum 48px height
   - [ ] Email keyboard shows @ and .com
   - [ ] Phone keyboard shows number pad
   - [ ] Date picker opens properly
   - [ ] Validation errors are clear
   - [ ] "Next" button is prominent

4. **Step 2: Photo Capture - Front View**
   - [ ] Camera starts within 2 seconds
   - [ ] Camera uses rear-facing camera
   - [ ] Video preview is clear and full-width
   - [ ] "Take Photo" button is large (min 48px)
   - [ ] After capture, preview shows clearly

5. **Step 2: Photo Review**
   - [ ] Captured image is displayed full-width
   - [ ] "Retake" button is easily tappable
   - [ ] "Confirm" button is prominent (green)

6. **Step 2: Repeat for 4 angles**
   - [ ] Progress badges show which photos are captured
   - [ ] Can navigate between angles smoothly
   - [ ] Current angle is highlighted

7. **Step 3: Review & Submit**
   - [ ] All claim details are readable
   - [ ] Photo grid displays properly (2 cols on mobile)
   - [ ] "Submit Claim" button is prominent
   - [ ] Loading spinner shows during upload
   - [ ] Success toast appears
   - [ ] Dashboard refreshes with new claim

**Expected Time:** 2-3 minutes on 4G

---

### Test 2: Viewing Claim Details ✅

**Device:** Samsung Galaxy S21 (360px)

1. **Dashboard**
   - [ ] Tap on a recent claim card
   - [ ] Card has visual feedback (press state)

2. **Claim Details Modal**
   - [ ] Modal opens smoothly
   - [ ] Content is scrollable
   - [ ] Photos are in a scrollable grid
   - [ ] All text is readable (no tiny fonts)

---

## 👨‍💼 Admin Flow Testing

### Test 3: Admin Dashboard ✅

**Device:** iPad Mini (768px)

1. **Switch to Admin View**
   - [ ] Bottom-right button switches views
   - [ ] Stats load properly
   - [ ] Claims table shows

2. **Filter Claims**
   - [ ] Tap "Pending" stat card
   - [ ] Table filters to pending claims
   - [ ] Works for all status filters

3. **Search Claims**
   - [ ] Search input is easily tappable
   - [ ] Keyboard doesn't obscure results
   - [ ] Results update in real-time

---

### Test 4: Claim Review & Approval ✅

**Device:** iPhone 14 Pro (393px)

1. **Open Claim**
   - [ ] Tap any claim row
   - [ ] Modal opens full-screen

2. **Review Details**
   - [ ] All claimant info is visible
   - [ ] Vehicle details are clear
   - [ ] Accident description is readable
   - [ ] Photos load and are viewable
   - [ ] Tap photo to open full-size in new tab

3. **Add Admin Notes**
   - [ ] Textarea is easily tappable
   - [ ] Keyboard doesn't obscure "Approve" button
   - [ ] Can type comfortably

4. **Approve Claim**
   - [ ] "Approve" button changes to loading spinner
   - [ ] Success toast appears
   - [ ] Modal closes after 1.5s
   - [ ] Dashboard updates automatically

5. **Reject Claim**
   - [ ] Same flow as approval
   - [ ] Rejection toast appears
   - [ ] Dashboard updates

---

## 🎥 Camera Testing

### iOS Safari Specific Tests

1. **Permission Flow**
   - [ ] Camera permission prompt shows
   - [ ] "Allow" button works
   - [ ] "Don't Allow" shows clear error message
   - [ ] Retry button works after denial

2. **Camera Behavior**
   - [ ] Rear camera is selected by default
   - [ ] Camera preview fills the viewport
   - [ ] No black bars or distortion
   - [ ] Photo quality is good (not pixelated)

3. **Capture Flow**
   - [ ] Tap "Take Photo" captures immediately
   - [ ] No lag or freeze
   - [ ] Preview shows captured image
   - [ ] "Confirm" saves the photo

### Android Chrome Specific Tests

1. **Permission Flow**
   - [ ] Permission prompt is clear
   - [ ] Works on first try
   - [ ] Handles denial gracefully

2. **Camera Behavior**
   - [ ] Uses rear camera (environment)
   - [ ] Preview is smooth (not choppy)
   - [ ] Photo quality is good

---

## 🐛 Known Issues to Watch For

### iOS Safari Quirks
- [ ] Camera permission sometimes needs re-grant on reload
- [ ] Full-screen modals may show Safari UI at bottom
- [ ] Zoom on input focus (should be disabled with font-size: 16px)

### Android Chrome Quirks
- [ ] Older devices may have slower camera start
- [ ] Some devices don't support `facingMode: 'environment'`
- [ ] Photo quality varies by device

### General
- [ ] Slow network: Add loading states
- [ ] Very old phones: May not support getUserMedia
- [ ] Landscape mode: Should still work but not optimal

---

## ⚡ Performance Testing

### Network Conditions

Test with Chrome DevTools throttling:

1. **4G (Typical mobile)**
   - [ ] Page loads < 3 seconds
   - [ ] Stats appear < 2 seconds
   - [ ] Claims load < 2 seconds

2. **3G (Slow mobile)**
   - [ ] Page loads < 5 seconds
   - [ ] Loading spinners show during wait
   - [ ] No timeout errors

3. **Offline**
   - [ ] Clear error message shows
   - [ ] Can retry when back online

### Photo Upload Speed

- [ ] Single photo uploads < 3 seconds (4G)
- [ ] All 4 photos upload < 12 seconds total
- [ ] Progress indication during upload
- [ ] No memory issues with multiple photos

---

## ✅ Final Mobile Checklist

### UX
- [ ] No horizontal scrolling on any screen
- [ ] All buttons are minimum 44x44px (iOS guidelines)
- [ ] Font sizes are readable (minimum 14px body text)
- [ ] Touch targets have proper spacing (8px minimum)
- [ ] Loading states for all async actions
- [ ] Error messages are clear and actionable

### Functionality
- [ ] Can submit complete claim on mobile
- [ ] Can capture all 4 required photos
- [ ] Can view submitted claims
- [ ] Admin can approve/reject on mobile
- [ ] All forms validate properly
- [ ] Date picker works on mobile

### Performance
- [ ] Page loads < 3s on 4G
- [ ] Camera starts < 2s
- [ ] Photos upload < 3s each
- [ ] No janky animations
- [ ] Smooth scrolling

### Cross-Browser
- [ ] iOS Safari (latest)
- [ ] Android Chrome (latest)
- [ ] Samsung Internet (if available)

---

## 🚀 Testing Commands

```bash
# Start dev server
npm run dev

# Build for production (test optimized version)
npm run build
npm run preview

# Check bundle size
npm run build -- --analyze
```

---

## 📊 Success Metrics

After testing, you should be able to say:

✅ **User can submit a claim in under 3 minutes on mobile**
✅ **Camera works on first try on iOS and Android**
✅ **All UI elements are easily tappable**
✅ **No zoom issues or horizontal scroll**
✅ **Performance is smooth on 4G**
✅ **Admin can process claims efficiently on mobile**

---

## 🆘 Troubleshooting

### Camera Not Starting?
1. Check permissions in browser settings
2. Ensure HTTPS (or localhost)
3. Try different browser
4. Check console for errors

### Photos Not Uploading?
1. Check Supabase connection
2. Verify storage policies are set
3. Check file size (should be compressed)
4. Check network connection

### Modal Not Scrolling?
1. Check overflow-y-auto class
2. Verify max-height is set
3. Test on real device (not just DevTools)

### Layout Breaking on Small Screens?
1. Check Tailwind breakpoints (sm:, md:)
2. Verify grid-cols-1 on mobile
3. Test on 320px width (smallest common)

---

**Status: Ready for Production Testing** 🚀

Test on real devices for best results!


