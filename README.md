# ⚖️ Digital Justice - AI-Powered Legal Case Analysis

An intelligent legal case analysis system powered by AI, featuring a Flutter mobile app and Python
Flask backend.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Flutter](https://img.shields.io/badge/Flutter-3.35.3-02569B?logo=flutter)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🌟 Features

### Mobile App (Flutter)

- 📱 **Cross-platform** - Works on Android and iOS
- 🎨 **Modern UI** - Beautiful, intuitive interface with dark mode
- 📝 **Case Submission** - Easy-to-use form for submitting legal cases
- 🤖 **AI Verdicts** - Real-time AI-powered legal analysis
- 📊 **Case History** - View and track all your cases
- 💾 **Local Storage** - Cases saved locally for offline access

### Backend (Python Flask)

- 🧠 **Intelligent ML Model** - Rule-based AI for accurate verdicts
- ⚡ **Fast API** - RESTful endpoints with < 2s response time
- 🔍 **Case Analysis** - Analyzes property rights, contracts, payments, etc.
- 📈 **Detailed Reasoning** - Provides case-specific legal explanations
- ☁️ **Cloud Deployed** - Live on Render.com
- 🔒 **CORS Enabled** - Secure cross-origin requests

---

## 🏗️ Project Structure

```
Digital-Justice/
├── Backend/                    # Python Flask API
│   ├── model/                 # AI Model & ML logic
│   │   ├── ai_judge.py       # Intelligent verdict prediction
│   │   └── gen_ai_reasoner.py # GenAI reasoning (optional)
│   ├── app.py                # Main Flask application
│   ├── requirements.txt      # Python dependencies (full)
│   ├── requirements-render.txt # Optimized for deployment
│   ├── render.yaml           # Render deployment config
│   └── *.md                  # Documentation files
│
└── Frontend/
    └── ai_court_app/         # Flutter mobile app
        ├── lib/              # Dart source code
        │   ├── main.dart     # App entry point
        │   ├── models/       # Data models
        │   ├── screens/      # UI screens
        │   └── services/     # API & storage services
        ├── android/          # Android-specific files
        ├── ios/              # iOS-specific files
        └── pubspec.yaml      # Flutter dependencies
```

---

## 🚀 Quick Start

### Backend Setup

1. **Navigate to Backend:**
   ```bash
   cd Backend
   ```

2. **Create Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Server:**
   ```bash
   python app.py
   ```

   Server will start at `http://localhost:5000`

### Frontend Setup

1. **Navigate to Frontend:**
   ```bash
   cd Frontend/ai_court_app
   ```

2. **Install Dependencies:**
   ```bash
   flutter pub get
   ```

3. **Run the App:**
   ```bash
   flutter run
   ```

   Select your device (Android emulator, iOS simulator, or physical device)

---

## 📱 Build APK

To build an Android APK:

```bash
cd Frontend/ai_court_app
flutter build apk --release
```

APK will be at: `build/app/outputs/flutter-apk/Digital-Justice.apk`

---

## ☁️ Live Deployment

### Backend

- **URL:** https://digital-justice-wss7.onrender.com
- **Status:** ✅ **LIVE AND WORKING**
- **Hosting:** Render.com (Free Tier)
- **Last Verified:** Nov 9, 2025

### Quick Test:

```bash
# Health check
curl https://digital-justice-wss7.onrender.com/health

# Get API info
curl https://digital-justice-wss7.onrender.com/
```

### API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `POST /verdict` - Submit case for verdict
- `POST /api/genai_reason` - Generate reasoning

---

## 🧪 Testing

### Test Backend API

```bash
curl https://digital-justice-wss7.onrender.com/health
```

### Test Property Rights Case

```bash
curl -X POST https://digital-justice-wss7.onrender.com/verdict \
  -H "Content-Type: application/json" \
  -d '{
    "plaintiff": "The defendant refused to let me park in their driveway.",
    "defendant": "It\'s my private property and they never asked permission.",
    "evidence": "Property deed confirms defendant ownership"
  }'
```

Expected: `{"winner": "Defendant"}`

---

## 🤖 How the AI Works

The AI model uses **intelligent rule-based analysis** to evaluate cases:

### Scoring System

1. **Property Rights** (6-15 points)
    - "my private property" → +6 points (defendant)
    - "never asked permission" → +5 points (defendant)
    - "property deed confirms" → +3-4 points

2. **Payment/Contract** (7-12 points)
    - "paid but never received" → +7 points (plaintiff)
    - "has receipt" → +4 points (plaintiff)

3. **Evidence** (2-4 points per item)
    - Documents, witnesses, contracts

4. **Verdict Calculation**
    - Score difference ≥ 5 → Clear winner
    - Score difference 2-4 → Winner
    - Score difference < 2 → Neutral

See `Backend/AI_MODEL_WORKING.md` for details.

---

## 📊 Supported Case Types

- ⚖️ **Property Rights Disputes**
- 💰 **Payment & Contract Issues**
- 🚫 **Theft & Unauthorized Taking**
- 📦 **Product Quality & Damage**
- 🤝 **General Legal Disputes**

---

## 🔧 Tech Stack

### Backend

- **Framework:** Flask 3.0
- **Language:** Python 3.11
- **ML Libraries:** NumPy, scikit-learn
- **Deployment:** Render.com
- **Server:** Gunicorn

### Frontend

- **Framework:** Flutter 3.35.3
- **Language:** Dart
- **State Management:** StatefulWidget
- **Storage:** SharedPreferences
- **HTTP Client:** http package

---

## 📝 Environment Variables

### Backend (.env)

```bash
PORT=5000
RENDER=true  # Set by Render automatically
```

### Frontend (lib/services/api_service.dart)

```dart
static const String baseUrl = 'https://digital-justice-wss7.onrender.com';
```

---

## 🎯 Key Features Implementation

### Intelligent Verdict System

- 200+ keyword patterns analyzed
- Context-aware scoring (e.g., "refused" in property context)
- Natural language understanding
- Case-type detection

### Detailed Reasoning

- Identifies case type
- Lists key factors
- Explains logical analysis
- Provides practical considerations
- Cites legal principles

---

## 📱 App Screenshots

(Add screenshots of your app here)

---

## 🚀 Deployment

### ✅ Backend Already Deployed!

Your backend is **LIVE** at: `https://digital-justice-wss7.onrender.com`

**Status:** Healthy and working perfectly!

For deployment details, see:

- `BACKEND_DEPLOYED_SUMMARY.md` - Current deployment status
- `RENDER_DEPLOYMENT_STEPS.md` - How to redeploy or update

### Deploy Backend to Render (For New Deployments)

1. Push code to GitHub
2. Connect repository to Render
3. Render auto-detects `render.yaml`
4. Deploys automatically!

See `Backend/RENDER_DEPLOYMENT.md` for details.

### Build & Distribute APK

1. Build release APK: `flutter build apk --release`
2. Find APK at: `build/app/outputs/flutter-apk/Digital-Justice.apk`
3. Share via file transfer, WhatsApp, email, etc.

See `Frontend/ai_court_app/APK_BUILD_INFO.md` for details.

---

## 📖 Documentation

- **Backend Deployment:** `Backend/RENDER_DEPLOYMENT.md`
- **Deployment Summary:** `BACKEND_DEPLOYED_SUMMARY.md`
- **Step-by-Step Guide:** `RENDER_DEPLOYMENT_STEPS.md`
- **AI Model Guide:** `Backend/AI_MODEL_WORKING.md`
- **APK Build Guide:** `Frontend/ai_court_app/APK_BUILD_INFO.md`
- **Flutter Connection:** `FLUTTER_BACKEND_CONNECTED.md`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

**Code Vibers** - AI Court Project

---

## 🙏 Acknowledgments

- Flutter team for the amazing framework
- Render.com for free hosting
- Open source community

---

## 📞 Support

For issues or questions:

- Open an issue on GitHub
- Check the documentation files
- Review `RENDER_DEPLOYMENT_STEPS.md` for deployment issues
- Visit Render Dashboard: https://dashboard.render.com/

---

## ✨ Version History

### v1.0.0 (Current)

- ✅ Initial release
- ✅ AI verdict system working
- ✅ Flutter app with full features
- ✅ Cloud backend deployed on Render
- ✅ APK ready for distribution
- ✅ Complete documentation

---

## 🔗 Quick Links

| Resource              | Link                                             |
|-----------------------|--------------------------------------------------|
| **Backend API**       | https://digital-justice-wss7.onrender.com        |
| **GitHub Repository** | https://github.com/ayushikundu5/Digital-Justice  |
| **Render Dashboard**  | https://dashboard.render.com/                    |
| **Health Check**      | https://digital-justice-wss7.onrender.com/health |

---

**Made with ❤️ by Code Vibers**
