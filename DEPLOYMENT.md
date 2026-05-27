# Backend Deployment Guide

Your backend consists of two services that need to be deployed:

## Quick Summary

- **Node.js Server** (Express + MongoDB) - Listening on port 5000
- **Python AI Service** (FastAPI + Groq) - Listening on port 8000
- **Frontend** - Already deployed on Vercel ✅

## Deployment Steps (Render.com - Recommended)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account
3. Authorize access to your MENTORSHIPP repository

### Step 2: Deploy Python AI Service First

1. Click "Create +" → "Web Service"
2. Connect your GitHub repository
3. Fill in:
   - **Name**: `mentorshipp-python-api`
   - **Root Directory**: `ai_service`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`, `playwright install chromium`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`
   - **Plan**: Free tier
4. Click "Advanced" and add environment variable:
   - **Key**: `GROQ_API_KEY`
   - **Value**: `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`
5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. **Copy the service URL** (e.g., `https://mentorshipp-python-api.onrender.com`)

### Step 3: Deploy Node.js Server

1. Click "Create +" → "Web Service"
2. Connect your GitHub repository
3. Fill in:
   - **Name**: `mentorshipp-node-api`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier
4. Click "Advanced" and add environment variables:
   - **Key**: `PORT` → **Value**: `5000`
   - **Key**: `MONGO_URI` → **Value**: (from your .env file)
   - **Key**: `AI_SERVICE_URL` → **Value**: (paste Python API URL from step 7)
5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. **Copy the service URL** (e.g., `https://mentorshipp-node-api.onrender.com`)

### Step 4: Update Frontend Environment Variables

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Update:
   - `NEXT_PUBLIC_NODE_API_URL`: https://mentorshipp-node-api.onrender.com
   - `NEXT_PUBLIC_PYTHON_API_URL`: https://mentorshipp-python-api.onrender.com
4. Click "Redeploy" to apply changes

### Step 5: Test Deployment

1. Visit your Vercel app: https://mentorshipp-cu7sxs1u4-mayank10123s-projects.vercel.app
2. Try:
   - Creating an account (if MongoDB endpoint is working)
   - Mentor chat (should return real responses from Groq now)
   - Analyzing profile/resume (if AI service endpoints are ready)

## Alternative: Railway.app

If Render doesn't work, Railway is another option:

1. Go to https://railway.app
2. Create account and connect GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your MENTORSHIPP repo
5. Add services for both `server/` and `ai_service/` directories
6. Set environment variables in Railway dashboard

## Troubleshooting

**Services showing error or not deploying?**
- Check Render/Railway logs for error messages
- Verify MongoDB URI is correct in environment variables
- Ensure GROQ_API_KEY is valid

**Frontend still showing CORS errors?**
- Verify backend URLs in Vercel environment variables
- Redeploy frontend after updating variables
- Check browser console for actual error messages

**MongoDB connection failing?**
- Verify the MongoDB URI is accessible from Render's servers
- You may need to whitelist Render's IP in MongoDB Atlas (usually automatic)

## Next Steps (Optional)

To avoid free tier limitations:
- Upgrade Render services to paid tiers ($7/month minimum)
- Set auto-deploy so changes push automatically
- Monitor logs for performance issues

---

**Deployment Status:**
- ✅ Frontend: Deployed on Vercel
- ⏳ Node API: Ready for Render/Railway deployment
- ⏳ Python API: Ready for Render/Railway deployment
