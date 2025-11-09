# Quick Start Guide - AI Court Flutter App

## 🚀 Getting Started in 3 Steps

### Step 1: Ensure Prerequisites

```bash
# Check Flutter installation
flutter --version

# Should show Flutter 3.0.0 or higher
```

If Flutter is not installed, visit: https://docs.flutter.dev/get-started/install

### Step 2: Get Dependencies

```bash
cd "Frontend/ai_court_app"
flutter pub get
```

### Step 3: Run the App

```bash
# Start the Flutter app
flutter run

# Choose your target device when prompted:
# [1]: Android Emulator
# [2]: iPhone Simulator
# [3]: Chrome (Web)
# etc.
```

## 🔧 Backend Connection

### Start the Backend

In a separate terminal:

```bash
cd Backend
python app.py
```

Backend will run on `http://localhost:5000`

### Important for Android Emulator

If running on Android emulator, update `lib/services/api_service.dart`:

```dart
// Change this line:
static const String baseUrl = 'http://localhost:5000';

// To this:
static const String baseUrl = 'http://10.0.2.2:5000';
```

This is because Android emulator's `localhost` points to the emulator itself.

## 📱 Usage Flow

1. **Login**: Use any email/password (demo mode)
2. **Dashboard**: View your cases and statistics
3. **Create Case**:
    - Click "New Case" button
    - Fill in case details
    - Submit for AI judgment
    - View verdict with reasoning
4. **Debate**: Start or join a debate room

## 🎯 Test Case Example

Use this example to test the AI integration:

**Title**: Contract Dispute - Website Development

**Plaintiff Statement**:

```
I hired the defendant on January 1, 2024, to develop a professional website for my business 
for $5000. The contract clearly stated delivery within 30 days with responsive design, 
e-commerce functionality, and SEO optimization. However, the defendant delivered a basic 
template website after 45 days that lacks all promised features. The site is not mobile-friendly, 
has no payment integration, and crashes frequently. I requested revisions multiple times but 
the defendant refuses to make changes without additional payment.
```

**Defendant Statement**:

```
I completed the work according to our verbal agreement. The plaintiff initially wanted a 
simple website for $5000, which I delivered. They later demanded advanced features like 
e-commerce and custom design, which were never part of the original scope. These additions 
would require significantly more development time and cost. I offered to implement them for 
an additional $3000, which is reasonable for the extra work. The plaintiff is trying to get 
premium services at a basic website price.
```

**Evidence**:

```
- Original contract dated January 1, 2024, specifying "responsive website with e-commerce 
  capabilities and SEO"
- Email thread showing defendant's acknowledgment of contract terms
- Screenshots of delivered website showing missing features
- Bank transfer receipt of $5000 payment
- Timeline of revision requests and defendant's responses
```

## 🛠️ Troubleshooting

### "Cannot connect to backend"

✅ **Solution**: Ensure backend is running on port 5000

```bash
cd Backend
python app.py
```

### "Failed to load cases"

✅ **Solution**: This is normal on first run. Create a case to populate data.

### Build errors

✅ **Solution**: Clean and rebuild

```bash
flutter clean
flutter pub get
flutter run
```

### Hot reload not working

✅ **Solution**: Press 'r' in terminal or restart with 'R'

## 📚 Full Documentation

For complete documentation, see:

- `Frontend/ai_court_app/README.md` - Full app guide
- `FLUTTER_APP_COMPLETE.md` - Feature list and architecture

## ✨ Features Overview

| Feature | Description |
|---------|-------------|
| 🔐 **Login** | Demo authentication (any credentials) |
| 📊 **Dashboard** | View statistics and recent cases |
| 📁 **Cases** | List, create, and view cases |
| 🤖 **AI Verdict** | Get AI-powered judgments |
| 📝 **Reasoning** | Detailed legal reasoning from GenAI |
| ⚖️ **Debate** | Create and join debate rooms |
| 🎨 **Themes** | Light/Dark mode (automatic) |
| 💾 **Storage** | Local data persistence |

## 🎉 That's It!

You're ready to use the AI Court Flutter app. The app will automatically:

- Connect to backend for AI verdicts
- Store cases locally on your device
- Sync data between app sessions

---

**Need help?** Check the full README or backend logs for more information.
