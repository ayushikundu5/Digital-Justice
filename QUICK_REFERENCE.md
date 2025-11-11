# 🚀 Quick Reference - Digital Justice

Your one-stop reference for everything related to your AI Court app.

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend API** | https://digital-justice-wss7.onrender.com | Main backend service |
| **Health Check** | https://digital-justice-wss7.onrender.com/health | Check if backend is alive |
| **GitHub Repo** | https://github.com/ayushikundu5/Digital-Justice | Source code |
| **Render Dashboard** | https://dashboard.render.com/ | Backend management |

---

## 📦 File Locations

| File | Path |
|------|------|
| **APK** | `Frontend/ai_court_app/build/app/outputs/flutter-apk/Digital-Justice.apk` |
| **Backend** | `Backend/app.py` |
| **API Service** | `Frontend/ai_court_app/lib/services/api_service.dart` |
| **Requirements** | `Backend/requirements-render.txt` |

---

## ⚡ Quick Commands

### Test Backend

```bash
# Health check
curl https://digital-justice-wss7.onrender.com/health

# API info
curl https://digital-justice-wss7.onrender.com/

# Test verdict
curl -X POST https://digital-justice-wss7.onrender.com/verdict \
  -H "Content-Type: application/json" \
  -d '{"plaintiff":"Test","defendant":"Test","evidence":""}'
```

### Rebuild APK

```bash
cd Frontend/ai_court_app
flutter clean
flutter build apk --release
```

### Update Backend

```bash
cd Backend
# Make changes to app.py
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys in 2-3 minutes
```

### Run Locally

```bash
# Backend
cd Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend
cd Frontend/ai_court_app
flutter pub get
flutter run
```

---

## 📱 APK Information

| Property | Value |
|----------|-------|
| **Name** | Digital-Justice.apk |
| **Size** | ~55-60 MB |
| **Min Android** | 5.0 (API 21) |
| **Target Android** | 14 (API 34) |
| **Permissions** | Internet only |
| **Backend** | https://digital-justice-wss7.onrender.com |

---

## 🌐 API Endpoints

### GET /

Returns API information and available endpoints.

### GET /health

Returns backend health status.

**Response:**

```json
{"status": "healthy", "ai_model": "loaded"}
```

### POST /verdict

Submit a case for AI verdict.

**Request:**

```json
{
  "plaintiff": "...",
  "defendant": "...",
  "evidence": "..."
}
```

**Response:**

```json
{
  "winner": "Plaintiff/Defendant/Neutral",
  "confidence": "high/medium",
  "model": "AI Judge ML Model"
}
```

### POST /api/genai_reason

Generate detailed reasoning for a verdict.

**Request:**

```json
{
  "plaintiff": "...",
  "defendant": "...",
  "evidence": "...",
  "verdict": "Plaintiff/Defendant/Neutral"
}
```

**Response:**

```json
{
  "reasoning": "Detailed analysis...",
  "model": "Rule-Based Reasoning"
}
```

---

## 📊 Status Indicators

### Backend Health

✅ **Healthy** - All systems operational

```json
{"status": "healthy", "ai_model": "loaded"}
```

⚠️ **Cold Start** - Backend waking up (wait 30-60 seconds)

❌ **Error** - Check Render logs

### APK Status

✅ **Ready** - Built with correct backend URL  
⚠️ **Outdated** - Rebuild if backend URL changed  
🔄 **Building** - Running `flutter build apk --release`

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** "502 Bad Gateway"

- **Cause:** Backend is starting (cold start)
- **Fix:** Wait 30-60 seconds and retry

**Problem:** "Cannot connect"

- **Check:** https://digital-justice-wss7.onrender.com/health
- **Fix:** Check Render dashboard for issues

### App Issues

**Problem:** "Connection error"

- **Check:** Device has internet
- **Check:** Backend is awake (visit URL in browser)
- **Fix:** Wait for backend to wake up

**Problem:** "Can't install APK"

- **Check:** "Unknown sources" enabled
- **Check:** Enough storage space
- **Fix:** Re-download APK

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `DEPLOYMENT_COMPLETE.md` | ✅ Everything is ready summary |
| `BACKEND_DEPLOYED_SUMMARY.md` | Backend deployment details |
| `RENDER_DEPLOYMENT_STEPS.md` | How to deploy/redeploy |
| `SHARE_APK_INSTRUCTIONS.md` | How to share APK |
| `README.md` | Main project overview |
| `Backend/AI_MODEL_WORKING.md` | AI model documentation |

---

## ⚙️ Configuration

### Backend Environment Variables

```bash
PORT=5000                    # Auto-set by Render
RENDER=true                  # Auto-set by Render
```

### Flutter API Configuration

**File:** `Frontend/ai_court_app/lib/services/api_service.dart`

```dart
static const String baseUrl = 'https://digital-justice-wss7.onrender.com';
```

---

## 💰 Cost & Limits

### Current Plan: FREE

| Resource | Limit |
|----------|-------|
| **Hosting** | Free (Render) |
| **RAM** | 512 MB |
| **Bandwidth** | 100 GB/month |
| **Compute** | 750 hours/month |
| **Sleep after** | 15 minutes inactivity |
| **Cold start** | 30-60 seconds |

### Upgrade: $7/month

| Benefit | Value |
|---------|-------|
| **Always-on** | No sleep/cold start |
| **RAM** | Up to 32 GB |
| **Performance** | Faster response |
| **Custom domain** | Your own URL |

---

## 🔐 Security

### Backend

- ✅ HTTPS only
- ✅ CORS enabled
- ✅ No data storage
- ✅ Open source

### APK

- ✅ Internet permission only
- ✅ Local data storage
- ✅ No tracking
- ✅ No external dependencies

---

## 📈 Monitoring

### Check Backend Status

1. Visit: https://dashboard.render.com/
2. Click on `digital-justice-wss7`
3. View:
    - Logs (real-time)
    - Metrics (CPU, memory, requests)
    - Deployments (history)

### Check API Usage

```bash
# View logs
# Go to Render Dashboard → Your Service → Logs

# Check metrics
# Go to Render Dashboard → Your Service → Metrics
```

---

## 🔄 Update Workflow

### Update Backend

1. Edit code: `Backend/app.py` or other files
2. Commit: `git add . && git commit -m "Update"`
3. Push: `git push origin main`
4. Wait: 2-3 minutes for auto-deploy
5. Test: Visit backend URL

### Update App

1. Edit code: `Frontend/ai_court_app/lib/` files
2. Build: `flutter build apk --release`
3. Test: Install on device
4. Share: Upload new APK to cloud storage
5. Notify: Tell users about update

---

## 🎯 Common Tasks

### Share APK via Google Drive

1. Go to https://drive.google.com
2. Upload: `Digital-Justice.apk`
3. Share: Right-click → Share → Anyone with link
4. Copy: Share link
5. Send: Share link with users

### Check if Backend is Up

```bash
curl https://digital-justice-wss7.onrender.com/health
```

Expected: `{"status":"healthy"}`

### Test Verdict Locally

```bash
curl -X POST https://digital-justice-wss7.onrender.com/verdict \
  -H "Content-Type: application/json" \
  -d '{
    "plaintiff": "I paid but never received the product",
    "defendant": "We delivered as per agreement",
    "evidence": "Receipt and delivery confirmation"
  }'
```

---

## 📞 Support Resources

### For Backend Issues

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com/
- **Your Logs:** Render Dashboard → Service → Logs

### For App Issues

- **Flutter Docs:** https://flutter.dev/docs
- **Flutter Discord:** https://discord.gg/flutter
- **Your Code:** https://github.com/ayushikundu5/Digital-Justice

### For AI Model

- **Documentation:** `Backend/AI_MODEL_WORKING.md`
- **Test File:** `Backend/test_ai_model.py`
- **Model Code:** `Backend/model/ai_judge.py`

---

## 🎊 Quick Start for New Users

### To Use Your App

1. **Download:** Get `Digital-Justice.apk`
2. **Enable:** Settings → Install unknown apps
3. **Install:** Tap APK file → Install
4. **Open:** Launch "Digital Justice"
5. **Use:** Submit cases and get verdicts!

### To Develop

1. **Clone:** `git clone https://github.com/ayushikundu5/Digital-Justice`
2. **Backend:** `cd Backend && pip install -r requirements.txt && python app.py`
3. **Frontend:** `cd Frontend/ai_court_app && flutter pub get && flutter run`
4. **Build:** `flutter build apk --release`

---

## ✅ Deployment Checklist

Quick verification that everything is working:

- [ ] Backend responds at: https://digital-justice-wss7.onrender.com
- [ ] Health check returns: `{"status": "healthy"}`
- [ ] Verdict endpoint accepts POST requests
- [ ] APK file exists and is recent
- [ ] APK has correct backend URL embedded
- [ ] APK installs and runs on device
- [ ] App can submit cases and get verdicts
- [ ] GitHub repo is up to date

**All checked? ✅ You're ready to share!**

---

## 🌟 Key Features

### Backend Features

- 🤖 AI-powered verdict generation
- 📊 5+ case type support
- ⚡ Fast API responses (< 2s)
- 🔒 Secure HTTPS
- 📈 Auto-scaling

### App Features

- 📱 Modern Flutter UI
- 💾 Local case history
- 🌙 Dark mode support
- 🔄 Real-time verdicts
- 📊 Detailed reasoning

---

## 🔗 External Links

- **Render:** https://render.com
- **Flutter:** https://flutter.dev
- **Python Flask:** https://flask.palletsprojects.com/
- **GitHub:** https://github.com
- **Android Studio:** https://developer.android.com/studio

---

**🚀 Your app is ready to conquer the world!**

*Quick Reference v1.0 - Code Vibers*
