# Deploy AI Court Backend to Render

This guide will help you deploy the AI Court Backend to Render.

## Prerequisites

- A [Render](https://render.com) account (free tier available)
- Git repository with your backend code
- GitHub, GitLab, or Bitbucket account

## Changes Made for Render Deployment

### 1. **Dynamic Port Configuration**

The app now reads the port from the `PORT` environment variable that Render provides:

```python
port = int(os.environ.get('PORT', 5000))
```

### 2. **Production vs Development Mode**

The app detects if it's running on Render and adjusts debug mode accordingly:

```python
is_production = os.environ.get('RENDER') is not None
app.run(debug=not is_production, host='0.0.0.0', port=port)
```

### 3. **Optimized Requirements**

Created `requirements-render.txt` with minimal dependencies (no torch/transformers) to:

- Reduce build time
- Reduce memory usage
- Avoid deployment size limits

### 4. **Production Server**

Using `gunicorn` instead of Flask's development server for better performance and stability.

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   cd Backend
   git add .
   git commit -m "Prepare backend for Render deployment"
   git push origin main
   ```

2. **Create a New Web Service on Render**
    - Go to [Render Dashboard](https://dashboard.render.com/)
    - Click "New +" → "Web Service"
    - Connect your repository
    - Render will automatically detect `render.yaml`

3. **Deploy**
    - Click "Create Web Service"
    - Render will automatically build and deploy your app

### Option 2: Manual Configuration

1. **Create a New Web Service on Render**
    - Go to [Render Dashboard](https://dashboard.render.com/)
    - Click "New +" → "Web Service"
    - Connect your repository

2. **Configure the Service**
    - **Name:** `ai-court-backend` (or your preferred name)
    - **Root Directory:** `Backend` (if your repo has multiple folders)
    - **Environment:** `Python 3`
    - **Build Command:** `pip install -r requirements-render.txt`
    - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`

3. **Environment Variables** (Optional)
    - Add any API keys or environment variables you need
    - Render automatically sets `PORT` and `RENDER` variables

4. **Deploy**
    - Click "Create Web Service"
    - Wait for the deployment to complete

## Post-Deployment

### 1. Test Your Deployment

Once deployed, your backend will be available at:

```
https://your-service-name.onrender.com
```

Test the endpoints:

**Health Check:**

```bash
curl https://your-service-name.onrender.com/health
```

**API Info:**

```bash
curl https://your-service-name.onrender.com/
```

**Test Verdict:**

```bash
curl -X POST https://your-service-name.onrender.com/verdict \
  -H "Content-Type: application/json" \
  -d '{
    "plaintiff": "I ordered a product that never arrived",
    "defendant": "We shipped the product on time with tracking",
    "evidence": "Tracking shows delivered to the address"
  }'
```

### 2. Update Frontend

Update your frontend to use the new backend URL:

In your frontend code, replace:

```javascript
const API_URL = 'http://localhost:5000';
```

With:

```javascript
const API_URL = 'https://your-service-name.onrender.com';
```

### 3. Enable CORS (Already Configured)

The backend already has CORS enabled for all origins:

```python
CORS(app)  # Enable CORS for all routes
```

## Monitoring

- View logs in real-time from the Render dashboard
- Monitor performance and resource usage
- Set up health check alerts

## Troubleshooting

### Build Fails

- Check that `requirements-render.txt` exists
- Verify all dependencies are compatible
- Check build logs for specific errors

### App Crashes on Startup

- Check that `gunicorn` is in requirements
- Verify the start command is correct: `gunicorn app:app --bind 0.0.0.0:$PORT`
- Check logs for Python errors

### 502 Bad Gateway

- Ensure your app binds to `0.0.0.0:$PORT`
- Check that the PORT environment variable is being used
- Verify your app starts successfully in logs

### Free Tier Limitations

- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading for always-on service

## Upgrading to Full Features (Optional)

If you want to enable the AI model and GenAI reasoner on Render:

1. Use `requirements.txt` instead of `requirements-render.txt`
2. Upgrade to a paid plan with more memory (torch requires significant RAM)
3. Update build command: `pip install -r requirements.txt`

**Note:** This will significantly increase build time and memory usage.

## Free Tier vs Paid

**Free Tier:**

- ✅ Perfect for testing and small projects
- ✅ Automatic HTTPS
- ✅ Automatic deploys from Git
- ⚠️ Spins down after 15 min inactivity
- ⚠️ 512 MB RAM (limited for ML models)

**Paid Tier (Starting at $7/month):**

- ✅ Always-on
- ✅ More RAM for ML models
- ✅ Faster builds
- ✅ Custom domains

## Support

For issues with Render deployment:

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- Check your service logs in the Render dashboard
