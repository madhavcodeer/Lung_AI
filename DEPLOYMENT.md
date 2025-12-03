# 🚀 Deployment Guide - Lung Cancer Detection System

This guide will help you deploy your Lung Cancer Detection system with the backend on **Render.com** (free) and frontend on **Netlify**.

## 📋 Prerequisites

- GitHub account
- Render.com account (free tier)
- Netlify account (free tier)
- Your project pushed to GitHub

## Part 1: Deploy Backend to Render.com

### Step 1: Sign Up/Login to Render

1. Go to [https://render.com](https://render.com)
2. Sign up or log in with your GitHub account

### Step 2: Create New Web Service

1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository: `madhavcodeer/Lung_AI`
4. Click **"Connect"**

### Step 3: Configure the Service

Fill in the following settings:

- **Name**: `lung-cancer-detection-api` (or any name you prefer)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`

### Step 4: Environment Variables (Optional)

If needed, add:
- `PYTHON_VERSION`: `3.9.0`

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://lung-cancer-detection-api.onrender.com`

### Step 6: Test the Backend

Open your browser and go to:
```
https://your-backend-url.onrender.com/health
```

You should see:
```json
{
  "status": "running",
  "system": "Intelligent CT Scan Analysis v3.0"
}
```

## Part 2: Update Frontend Configuration

### Step 1: Update config.js

In your local project, open `js/config.js` and update the API_URL:

```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'
    : 'https://YOUR-BACKEND-URL.onrender.com';  // ← UPDATE THIS
```

Replace `YOUR-BACKEND-URL` with your actual Render URL.

### Step 2: Commit and Push Changes

```bash
git add js/config.js
git commit -m "Update API URL for production"
git push origin main
```

## Part 3: Deploy Frontend to Netlify

### Option A: Deploy via Netlify UI

1. Go to [https://netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Select your repository: `madhavcodeer/Lung_AI`
5. Configure build settings:
   - **Build command**: Leave empty (static site)
   - **Publish directory**: `.` (root)
6. Click **"Deploy site"**

### Option B: Deploy via Drag & Drop

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your project folder (containing index.html, css, js folders)
3. Wait for upload to complete

### Step 3: Update Site Name (Optional)

1. Go to **Site settings** → **General** → **Site details**
2. Click **"Change site name"**
3. Enter a custom name like: `lung-cancer-ai`
4. Your site will be available at: `https://lung-cancer-ai.netlify.app`

## Part 4: Enable CORS on Backend

Your backend (`app.py`) already has CORS enabled with `flask-cors`, so cross-origin requests from Netlify will work automatically.

## 🧪 Testing the Full Deployment

1. Visit your Netlify URL: `https://your-site.netlify.app`
2. Scroll to the "Live Demo" section
3. Upload a CT scan image
4. Click "Run Detection"
5. You should see results from your deployed backend!

## 🔧 Troubleshooting

### Issue: "Error connecting to server"

**Solution**: Check if your backend URL in `config.js` is correct and the Render service is running.

### Issue: CORS Error

**Solution**: Make sure `flask-cors` is in your `requirements.txt` and installed on Render.

### Issue: Backend shows "Application Error"

**Solution**: 
1. Check Render logs for errors
2. Make sure all dependencies are in `requirements.txt`
3. Verify the start command is `gunicorn app:app`

### Issue: Model file too large for GitHub

**Solution**: 
- The model file (29MB) should work fine
- If you get errors, add `*.h5` to `.gitignore` and use the feature-based detection (already implemented)

## 📊 Monitoring

### Check Backend Status

Visit: `https://your-backend-url.onrender.com/health`

### View Backend Logs

1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab

### View Frontend Logs

1. Go to Netlify Dashboard
2. Click on your site
3. Click "Functions" → "Logs" (if using functions)

## 🎉 Success!

Your Lung Cancer Detection system is now fully deployed and accessible worldwide!

- **Frontend**: https://your-site.netlify.app
- **Backend API**: https://your-backend-url.onrender.com

## 📝 Next Steps

1. **Custom Domain**: Add a custom domain in Netlify settings
2. **SSL Certificate**: Automatically provided by both Netlify and Render
3. **Analytics**: Add Google Analytics to track usage
4. **Monitoring**: Set up uptime monitoring with UptimeRobot

## 💡 Tips

- **Free Tier Limits**: Render free tier may sleep after 15 min of inactivity. First request after sleep takes ~30 seconds.
- **Keep Awake**: Use a service like cron-job.org to ping your backend every 14 minutes
- **Upgrade**: If you need better performance, upgrade to Render's paid tier ($7/month)

---

**Need Help?** Check the logs or create an issue on GitHub!
