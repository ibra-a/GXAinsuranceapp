# 🚀 Vercel Deployment Guide - GXA Djibouti

## Why Vercel?
Mobile browsers **require HTTPS** for camera access. Vercel provides:
- ✅ Free HTTPS by default
- ✅ Automatic deployments
- ✅ Fast CDN worldwide
- ✅ Easy environment variable management

---

## 📋 Prerequisites

Before deploying, you need:
1. ✅ Vercel account (free) - [vercel.com](https://vercel.com)
2. ✅ Your Supabase credentials (already in `.env.local`)
3. ✅ Git repository (optional but recommended)

---

## 🚀 Method 1: Deploy via Vercel CLI (Fastest)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd /Users/ibra/Projects/GXA/gxa-claim-prototype
vercel
```

### Step 4: Add Environment Variables
When prompted, or after deployment:
```bash
vercel env add VITE_SUPABASE_URL
# Paste: https://msjsvwidlmozchljtjag.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zanN2d2lkbG1vemNobGp0amFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTEwMjcsImV4cCI6MjA3NzA2NzAyN30.CGz4ZyRLCeoO1rbho_loOha0hr9OkDa79KVKa4AuCLc
```

### Step 5: Redeploy with Environment Variables
```bash
vercel --prod
```

---

## 🌐 Method 2: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub (if not already)
```bash
cd /Users/ibra/Projects/GXA/gxa-claim-prototype

# Initialize git if needed
git init
git add .
git commit -m "Initial commit - GXA Djibouti Claims"

# Create GitHub repo and push
# (Follow GitHub instructions)
```

### Step 2: Connect to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### Step 3: Add Environment Variables
In Vercel dashboard, under "Environment Variables":

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://msjsvwidlmozchljtjag.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` (your full anon key) |

### Step 4: Deploy
Click "Deploy" and wait 1-2 minutes.

---

## ✅ After Deployment

You'll get a URL like:
```
https://gxa-claim-prototype.vercel.app
```

Or custom domain:
```
https://claims.gxa-djibouti.com
```

---

## 📱 Testing Camera on Mobile

Once deployed with HTTPS:

1. **Open your phone's browser**
2. **Visit your Vercel URL** (e.g., `https://gxa-claim-prototype.vercel.app`)
3. **Camera will work!** 🎉

---

## 🔧 Vercel Configuration File

I'll create a `vercel.json` for you:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key"
  }
}
```

---

## 🎯 Quick Deploy Steps (Summary)

### Option A: One-Command Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/ibra/Projects/GXA/gxa-claim-prototype
vercel

# Add environment variables (will be prompted)
# Then deploy to production
vercel --prod
```

### Option B: GitHub + Vercel Dashboard
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Add environment variables in dashboard
4. Click Deploy

---

## 🔐 Environment Variables Needed

Copy these from your `.env.local`:

```bash
VITE_SUPABASE_URL=https://msjsvwidlmozchljtjag.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zanN2d2lkbG1vemNobGp0amFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTEwMjcsImV4cCI6MjA3NzA2NzAyN30.CGz4ZyRLCeoO1rbho_loOha0hr9OkDa79KVKa4AuCLc
```

---

## 🐛 Troubleshooting

### Build Fails
- Check that `build` folder is the output directory
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### Environment Variables Not Working
- Make sure variable names start with `VITE_`
- Redeploy after adding variables
- Check variable values don't have extra spaces

### Camera Still Not Working
- Verify you're using HTTPS URL (not HTTP)
- Check browser console for errors
- Try different browser on phone

---

## 📊 What Happens Next

1. **Deploy to Vercel** → Get HTTPS URL
2. **Test on mobile** → Camera works with HTTPS
3. **Custom domain** (optional) → Add your own domain
4. **Continuous deployment** → Push to GitHub = auto deploy

---

## 🎉 Benefits of Vercel

- ✅ **Free HTTPS** - Camera works on mobile
- ✅ **Global CDN** - Fast worldwide
- ✅ **Auto deployments** - Push to deploy
- ✅ **Preview URLs** - Test before production
- ✅ **Analytics** - Track usage
- ✅ **Zero config** - Just works

---

## 📱 After HTTPS is Live

Your users can:
- ✅ Take photos with phone camera
- ✅ Submit claims on the go
- ✅ Access from anywhere
- ✅ No more "http://192.168.1.9:3000"

---

## 💡 Next Steps

1. **Deploy now**: `vercel` (in terminal)
2. **Add env variables**: In Vercel dashboard
3. **Test on mobile**: Visit HTTPS URL
4. **Share URL**: Send to team/users

---

**Let me know once you've deployed and I'll help test!** 🚀


