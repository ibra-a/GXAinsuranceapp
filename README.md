# 🚗 GXA Insurance Djibouti - Claims Management System

A modern, mobile-first insurance claims submission and management platform built for GXA Insurance in Djibouti.

## ✨ Features

### User Portal
- 📱 **Mobile Camera Integration** - Capture 4 required vehicle photos (front, rear, left, right)
- ⏰ **24-Hour Deadline Enforcement** - Claims must be submitted within 24 hours
- 📋 **Multi-Step Form** - Easy-to-use claim submission workflow
- 📊 **Real-Time Dashboard** - View claim status and statistics
- 🔄 **Live Updates** - See claims update in real-time

### Admin Dashboard
- 👨‍💼 **Claim Review** - View all claim details with photos
- ✅ **Approve/Reject** - Process claims with admin notes
- 🔍 **Search & Filter** - Find claims quickly
- 📈 **Statistics** - Track claims by status
- 📸 **Photo Gallery** - Review all submitted photos

## 🌍 Localization

- **Language:** French (Djibouti)
- **Currency:** Djiboutian Franc (DJF)
- **Phone Format:** +253 XX XX XX XX
- **Date Format:** DD/MM/YYYY

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Storage, Real-time)
- **UI Components:** shadcn/ui
- **Build Tool:** Vite
- **Deployment:** Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone repository
git clone https://github.com/ibra-a/GXAinsuranceapp.git
cd GXAinsuranceapp

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Add your Supabase credentials to .env.local
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm run dev
```

### Database Setup

1. Create a Supabase project
2. Run the SQL from `supabase-schema.sql`
3. Run the storage policies from `storage-policies.sql`
4. Update environment variables

## 📱 Mobile Testing

The app requires HTTPS for camera access. For local mobile testing:

```bash
# Find your local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# On your phone, visit:
http://YOUR_IP:3000
```

For production, deploy to Vercel (HTTPS enabled by default).

## 📦 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

## 🗂️ Project Structure

```
gxa-claim-prototype/
├── src/
│   ├── components/          # React components
│   │   ├── AdminDashboard.tsx
│   │   ├── UserDashboard.tsx
│   │   ├── NewClaimModalWithCamera.tsx
│   │   ├── PhotoCaptureStep.tsx
│   │   └── ...
│   ├── lib/                 # Utilities and helpers
│   │   ├── supabase.ts     # Supabase client
│   │   ├── claims.ts       # Claims operations
│   │   ├── locale.ts       # Djibouti localization
│   │   └── photoValidation.ts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── supabase-schema.sql     # Database schema
├── storage-policies.sql    # Storage RLS policies
├── vercel.json             # Vercel configuration
└── package.json
```

## 🔐 Security

- Row-Level Security (RLS) policies on all tables
- Public read/write for claims (authentication ready)
- Secure Supabase Storage with RLS policies
- HTTPS required for camera access

## 📖 Documentation

- `PROJECT_PLAN.md` - Complete architecture and phases
- `QUICK_START.md` - Developer quick reference
- `MOBILE_TESTING_GUIDE.md` - Mobile testing checklist
- `VERCEL_DEPLOYMENT.md` - Deployment instructions
- `DJIBOUTI_LOCALIZATION.md` - Localization details

## 🎯 Key Features Implementation

### Photo Capture
- Live camera access (WebRTC)
- 4 mandatory angles validation
- Rear camera preference on mobile
- Image compression (JPEG 0.8 quality)
- Organized storage (claim-number/required/angle-timestamp.jpg)

### 24-Hour Deadline
- Real-time countdown timer
- Validation on submission
- Visual indicators (green = within deadline, red = expired)

### Admin Review
- Click any claim to see full details
- Photo gallery with full-size preview
- Mandatory admin notes for approve/reject
- Real-time status updates

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Browser Support

- ✅ Chrome (desktop & mobile)
- ✅ Safari (desktop & iOS)
- ✅ Firefox (desktop & mobile)
- ✅ Edge (desktop)

## 🤝 Contributing

This is a production application for GXA Insurance Djibouti.

## 📄 License

Proprietary - GXA Insurance Djibouti

## 🆘 Support

For support, contact the development team.

---

**Built for GXA Insurance Djibouti 🇩🇯**  
*Optimized for mobile-first claims processing*
