# 🗺️ GXA Claims - Visual Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GXA CLAIMS PROTOTYPE ROADMAP                         │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
                         ✅ PHASE 1: BACKEND FOUNDATION                          
                              (COMPLETED - Oct 26)
═══════════════════════════════════════════════════════════════════════════════

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Supabase   │───▶│  Database   │───▶│   Storage   │───▶│  Live Data  │
│   Setup     │    │   Schema    │    │   Bucket    │    │  Dashboard  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     ✅                  ✅                  ✅                  ✅

Components:
  ✅ claims table with 17 columns
  ✅ RLS policies (public for MVP)
  ✅ claim-photos bucket
  ✅ Sample data (3 claims)
  ✅ UserDashboard showing live data
  ✅ StatsOverview with real-time stats
  ✅ RecentClaims with live claims

Files Created:
  ✅ src/lib/supabase.ts
  ✅ src/lib/claims.ts
  ✅ .env.local


═══════════════════════════════════════════════════════════════════════════════
                  🚧 PHASE 2: CLAIM SUBMISSION FLOW                  
                         (IN PROGRESS - Current Sprint)
═══════════════════════════════════════════════════════════════════════════════

                            Priority: 🔥 HIGH

┌──────────────────────────────────────────────────────────────────────────┐
│  Step 1: Form Validation                          [──────    ] 40%      │
│  ├─ Email validation                              [ ⬜ TODO ]            │
│  ├─ Phone validation                              [ ⬜ TODO ]            │
│  ├─ Required fields check                         [ ⬜ TODO ]            │
│  └─ Real-time error messages                      [ ⬜ TODO ]            │
│                                                                           │
│  Step 2: Photo Upload (TOP PRIORITY)              [────      ] 30%      │
│  ├─ File input & drag-drop                        [ ⬜ TODO ]            │
│  ├─ Photo preview grid                            [ ⬜ TODO ]            │
│  ├─ Upload to Supabase Storage                    [ ⬜ TODO ]            │
│  ├─ Progress indicators                           [ ⬜ TODO ]            │
│  └─ Max 10 photos, 10MB each                      [ ⬜ TODO ]            │
│                                                                           │
│  Step 3: Form Submission                          [────      ] 30%      │
│  ├─ Generate claim number                         [ ⬜ TODO ]            │
│  ├─ Submit to Supabase                            [ ⬜ TODO ]            │
│  ├─ Success/error handling                        [ ⬜ TODO ]            │
│  └─ Refresh dashboard                             [ ⬜ TODO ]            │
│                                                                           │
│  Step 4: 24-Hour Deadline                         [──        ] 20%      │
│  ├─ Countdown timer                               [ ⬜ TODO ]            │
│  ├─ Warning indicators                            [ ⬜ TODO ]            │
│  └─ Block submission if > 24h                     [ ⬜ TODO ]            │
└──────────────────────────────────────────────────────────────────────────┘

Estimated Time: 8-10 hours
Target Completion: Oct 27

Files to Modify:
  🔨 src/components/NewClaimModal.tsx (main work)
  🔨 src/components/UserDashboard.tsx (refresh logic)

Testing Checklist:
  ⬜ Submit claim with photos
  ⬜ Upload 10 photos successfully
  ⬜ Block upload of 11th photo
  ⬜ Block files > 10MB
  ⬜ Block submission if > 24h
  ⬜ Verify photos in Storage
  ⬜ Verify claim in database


═══════════════════════════════════════════════════════════════════════════════
                      🔮 PHASE 3: ADMIN DASHBOARD                      
                           (NEXT - Starting Oct 28)
═══════════════════════════════════════════════════════════════════════════════

                            Priority: 🟡 MEDIUM

┌──────────────────────────────────────────────────────────────────────────┐
│  Step 1: Live Claims Table                        [          ] 0%       │
│  ├─ Fetch claims with filters                     [ ⬜ TODO ]            │
│  ├─ Search functionality                          [ ⬜ TODO ]            │
│  ├─ Sorting options                               [ ⬜ TODO ]            │
│  └─ Pagination (if needed)                        [ ⬜ TODO ]            │
│                                                                           │
│  Step 2: Claim Review Modal                       [          ] 0%       │
│  ├─ Display full claim details                    [ ⬜ TODO ]            │
│  ├─ Photo gallery viewer                          [ ⬜ TODO ]            │
│  ├─ Show deadline status                          [ ⬜ TODO ]            │
│  └─ Time calculations                             [ ⬜ TODO ]            │
│                                                                           │
│  Step 3: Status Management                        [          ] 0%       │
│  ├─ Approve button                                [ ⬜ TODO ]            │
│  ├─ Reject button                                 [ ⬜ TODO ]            │
│  ├─ Admin notes field                             [ ⬜ TODO ]            │
│  └─ Update database                               [ ⬜ TODO ]            │
│                                                                           │
│  Step 4: Real-time Updates (Optional)             [          ] 0%       │
│  ├─ Supabase subscriptions                        [ ⬜ TODO ]            │
│  ├─ Auto-refresh on changes                       [ ⬜ TODO ]            │
│  └─ Toast notifications                           [ ⬜ TODO ]            │
└──────────────────────────────────────────────────────────────────────────┘

Estimated Time: 7-9 hours
Target Completion: Oct 29

Files to Modify:
  🔨 src/components/ClaimsTable.tsx
  🔨 src/components/AdminStatsOverview.tsx
  🔨 src/components/AdminClaimManagementModal.tsx
  🔨 src/components/AdminDashboard.tsx

Testing Checklist:
  ⬜ View all claims
  ⬜ Filter by status
  ⬜ Search claims
  ⬜ Open claim details
  ⬜ View photos
  ⬜ Approve claim
  ⬜ Reject claim
  ⬜ Verify status update


═══════════════════════════════════════════════════════════════════════════════
                        🎨 PHASE 4: UI/UX POLISH                        
                           (FUTURE - Starting Oct 30)
═══════════════════════════════════════════════════════════════════════════════

                            Priority: 🟡 MEDIUM

┌──────────────────────────────────────────────────────────────────────────┐
│  Mobile Optimization                              [          ] 0%       │
│  ├─ Test on iPhone Safari                         [ ⬜ TODO ]            │
│  ├─ Test on Android Chrome                        [ ⬜ TODO ]            │
│  ├─ Fix touch targets                             [ ⬜ TODO ]            │
│  ├─ Optimize photo upload                         [ ⬜ TODO ]            │
│  └─ Keyboard navigation                           [ ⬜ TODO ]            │
│                                                                           │
│  Loading States                                   [          ] 0%       │
│  ├─ Skeleton loaders                              [ ⬜ TODO ]            │
│  ├─ Spinners for actions                          [ ⬜ TODO ]            │
│  ├─ Progress bars                                 [ ⬜ TODO ]            │
│  └─ Smooth transitions                            [ ⬜ TODO ]            │
│                                                                           │
│  Error Handling                                   [          ] 0%       │
│  ├─ Network errors                                [ ⬜ TODO ]            │
│  ├─ Retry mechanism                               [ ⬜ TODO ]            │
│  ├─ User-friendly messages                        [ ⬜ TODO ]            │
│  └─ Error boundaries                              [ ⬜ TODO ]            │
└──────────────────────────────────────────────────────────────────────────┘

Estimated Time: 7-8 hours
Target Completion: Oct 31


═══════════════════════════════════════════════════════════════════════════════
                    🔐 PHASE 5: AUTHENTICATION & SECURITY                    
                              (FUTURE - November)
═══════════════════════════════════════════════════════════════════════════════

                            Priority: 🟢 LOW (Post-MVP)

┌──────────────────────────────────────────────────────────────────────────┐
│  Authentication                                   [          ] 0%       │
│  ├─ Supabase Auth setup                           [ ⬜ TODO ]            │
│  ├─ Login/Signup forms                            [ ⬜ TODO ]            │
│  ├─ Email verification                            [ ⬜ TODO ]            │
│  └─ Password reset                                [ ⬜ TODO ]            │
│                                                                           │
│  Security                                         [          ] 0%       │
│  ├─ Update RLS policies                           [ ⬜ TODO ]            │
│  ├─ User-specific claims                          [ ⬜ TODO ]            │
│  ├─ Admin role management                         [ ⬜ TODO ]            │
│  └─ Secure photo uploads                          [ ⬜ TODO ]            │
└──────────────────────────────────────────────────────────────────────────┘

Estimated Time: 8-10 hours


═══════════════════════════════════════════════════════════════════════════════
                      🧪 PHASE 6: TESTING & DEPLOYMENT                      
                              (FUTURE - November)
═══════════════════════════════════════════════════════════════════════════════

                            Priority: 🟢 LOW (Before Launch)

┌──────────────────────────────────────────────────────────────────────────┐
│  Testing                                          [          ] 0%       │
│  ├─ Manual testing all flows                      [ ⬜ TODO ]            │
│  ├─ Cross-browser testing                         [ ⬜ TODO ]            │
│  ├─ Mobile device testing                         [ ⬜ TODO ]            │
│  └─ Performance testing                           [ ⬜ TODO ]            │
│                                                                           │
│  Deployment                                       [          ] 0%       │
│  ├─ Set up Vercel/Netlify                         [ ⬜ TODO ]            │
│  ├─ Configure environment                         [ ⬜ TODO ]            │
│  ├─ Custom domain                                 [ ⬜ TODO ]            │
│  └─ Production monitoring                         [ ⬜ TODO ]            │
└──────────────────────────────────────────────────────────────────────────┘

Estimated Time: 6-8 hours


═══════════════════════════════════════════════════════════════════════════════
                            📊 OVERALL PROGRESS                            
═══════════════════════════════════════════════════════════════════════════════

  Phase 1: Backend Foundation       [██████████] 100% ✅ COMPLETE
  Phase 2: Claim Submission         [███░░░░░░░]  30% 🚧 IN PROGRESS
  Phase 3: Admin Dashboard          [░░░░░░░░░░]   0% 🔜 NEXT
  Phase 4: UI/UX Polish             [░░░░░░░░░░]   0% 🔮 FUTURE
  Phase 5: Authentication           [░░░░░░░░░░]   0% 🔮 FUTURE
  Phase 6: Testing & Deployment     [░░░░░░░░░░]   0% 🔮 FUTURE
  
  Overall Project:                  [██░░░░░░░░]  18%


═══════════════════════════════════════════════════════════════════════════════
                         🎯 IMMEDIATE NEXT STEPS                         
                              (Today - Oct 26)
═══════════════════════════════════════════════════════════════════════════════

  1. 🔥 Test current live data display
     └─ Open http://localhost:3000
     └─ Verify 3 claims show up
     └─ Check stats: 3 total, 1 pending, 1 approved, 1 rejected
     └─ Test both User and Admin views
     └─ Time: 5 minutes

  2. 🔥 Implement photo upload in NewClaimModal
     └─ Add file input & validation
     └─ Create photo preview grid
     └─ Connect to Supabase Storage
     └─ Test with 1-5 photos
     └─ Time: 2-3 hours

  3. 🔥 Connect form submission
     └─ Generate claim number
     └─ Submit to database
     └─ Handle success/error states
     └─ Refresh dashboard
     └─ Time: 1-2 hours

  4. 🔥 Add 24-hour validation
     └─ Calculate time remaining
     └─ Show countdown
     └─ Block if > 24h
     └─ Time: 1 hour

  5. 🎁 Test end-to-end flow
     └─ Submit test claim
     └─ Verify in Supabase
     └─ Check photos in Storage
     └─ Test on mobile
     └─ Time: 1 hour


═══════════════════════════════════════════════════════════════════════════════
                           🏆 SUCCESS METRICS                           
═══════════════════════════════════════════════════════════════════════════════

  MVP Goals (Target: Oct 29):
  ⬜ User can submit claim in < 2 minutes
  ⬜ User can upload 5 photos in < 30 seconds
  ⬜ Admin can review claim in < 1 minute
  ⬜ App works on mobile (iOS + Android)
  ⬜ 24-hour deadline validation works
  ⬜ All data persists correctly

  Technical Goals:
  ⬜ Page load < 2 seconds
  ⬜ Photo upload < 5 seconds each
  ⬜ Form submission < 3 seconds
  ⬜ Real-time updates < 1 second


═══════════════════════════════════════════════════════════════════════════════
                        📈 DEVELOPMENT VELOCITY                        
═══════════════════════════════════════════════════════════════════════════════

  Week 1 (Oct 26-Nov 1): Phases 1-3 (MVP Core)
  ├─ Day 1 (Oct 26): ✅ Phase 1 Complete
  ├─ Day 2 (Oct 27): 🎯 Phase 2 Target
  ├─ Day 3 (Oct 28): 🎯 Phase 3 Start
  └─ Day 4 (Oct 29): 🎯 Phase 3 Complete

  Week 2 (Nov 2-8): Phases 4-5 (Polish & Auth)
  ├─ Days 1-2: Phase 4 (UI/UX)
  └─ Days 3-4: Phase 5 (Auth)

  Week 3 (Nov 9-15): Phase 6 (Testing & Deploy)
  ├─ Days 1-2: Testing
  └─ Days 3-4: Deployment

  Target Launch: November 15, 2025


═══════════════════════════════════════════════════════════════════════════════
                           🎓 LEARNING RESOURCES                           
═══════════════════════════════════════════════════════════════════════════════

  Supabase:
  - Storage: https://supabase.com/docs/guides/storage
  - Real-time: https://supabase.com/docs/guides/realtime
  - RLS: https://supabase.com/docs/guides/auth/row-level-security

  React:
  - File Upload: https://react.dev/learn/managing-state
  - Form Handling: https://react.dev/learn/reacting-to-input-with-state

  Code Examples in Project:
  - src/lib/claims.ts (all Supabase functions)
  - src/components/RecentClaims.tsx (data fetching example)
  - src/components/StatsOverview.tsx (real-time updates example)


═══════════════════════════════════════════════════════════════════════════════

Last Updated: October 26, 2025 8:50 PM
Current Sprint: Phase 2 - Claim Submission Flow
Next Review: October 27, 2025

═══════════════════════════════════════════════════════════════════════════════
```

