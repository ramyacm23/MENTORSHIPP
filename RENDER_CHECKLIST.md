# Render Deployment Checklist

## ✅ Pre-Deployment (Already Done)

- [x] Code in GitHub: https://github.com/Mayank10123/MENTORSHIPP
- [x] Python service configured in `ai_service/`
- [x] Node service configured in `server/`
- [x] Frontend deployed on Vercel ✅
- [x] render.yaml files created for both services

---

## ⏳ Deployment Steps (Do These Now)

### Step 1️⃣: Deploy Python AI Service (5-10 mins)

- [ ] Open https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Select MENTORSHIPP repo
  - [ ] Name: `mentorshipp-python-api`
  - [ ] Root Directory: `ai_service`
  - [ ] Runtime: `Python 3`
  - [ ] Build: `pip install -r requirements.txt`, `playwright install chromium`
  - [ ] Start: `uvicorn main:app --host 0.0.0.0 --port 8000`
  - [ ] Plan: `Free`
- [ ] Click "Create Web Service"
- [ ] Wait for "Service is live" (watch Logs tab)
- [ ] Click "Settings" → "Environment"
- [ ] Add: `GROQ_API_KEY` = `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`
- [ ] Click "Manual Deploy"
- [ ] Copy service URL: `https://mentorshipp-python-api.onrender.com`
- [ ] Test: Visit the URL → Should show service details

**Status**: 🟢 Live / 🟡 Deploying / 🔴 Failed

---

### Step 2️⃣: Deploy Node API Service (5-10 mins)

- [ ] Click "New +" → "Web Service"
- [ ] Select MENTORSHIPP repo
  - [ ] Name: `mentorshipp-node-api`
  - [ ] Root Directory: `server`
  - [ ] Runtime: `Node`
  - [ ] Build: `npm install`
  - [ ] Start: `npm start`
  - [ ] Plan: `Free`
- [ ] Click "Advanced" before creating:
  - [ ] Add `PORT` = `5000`
  - [ ] Add `MONGO_URI` = (paste from server/.env)
  - [ ] Add `AI_SERVICE_URL` = (use Python URL from Step 1)
- [ ] Click "Create Web Service"
- [ ] Wait for "Service is live"
- [ ] Copy service URL: `https://mentorshipp-node-api.onrender.com`
- [ ] Test: Visit URL/api → Should show `{"message":"Node Orchestration Server Running"}`

**Status**: 🟢 Live / 🟡 Deploying / 🔴 Failed

---

### Step 3️⃣: Update Vercel Frontend (2 mins)

- [ ] Go to https://vercel.com → Your project
- [ ] Settings → Environment Variables
- [ ] Update/Add:
  - [ ] `NEXT_PUBLIC_NODE_API_URL` = (Node API URL from Step 2)
  - [ ] `NEXT_PUBLIC_PYTHON_API_URL` = (Python API URL from Step 1)
- [ ] Go to Deployments tab
- [ ] Click "Redeploy" on latest
- [ ] Wait for redeployment (2-3 mins)

**Status**: 🟢 Live / 🟡 Deploying / 🔴 Failed

---

## ✨ Testing (5 mins)

### Test 1: Python Service
```
Visit: https://mentorshipp-python-api.onrender.com/docs
Expect: FastAPI interactive docs page
```

### Test 2: Node Service
```
Visit: https://mentorshipp-node-api.onrender.com/api
Expect: {"message":"Node Orchestration Server Running"}
```

### Test 3: Frontend
```
Visit: Your Vercel URL
Try: Mentor Chat feature
Expect: Real responses from AI, not demo responses
Check: Browser console (F12) - no red errors
```

---

## 🆘 If Something Failed

- [ ] Check Render Logs (each service page → Logs tab)
- [ ] Check error message
- [ ] See TROUBLESHOOTING.md for solution
- [ ] Try "Manual Deploy" button in Render
- [ ] Or delete service and redeploy

---

## 📝 Notes

- Free tier services sleep after 15 min of inactivity (slow first load, then fast)
- Services restart ~1x per day (brief downtime)
- To avoid sleep: Upgrade to paid tier ($7/month)

---

**All set once you have 3 green checkmarks! ✅✅✅**
