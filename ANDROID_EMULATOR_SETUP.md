# Android Emulator Setup Guide

## ✅ Issue Fixed

The Flutter app is now configured to work with Android emulator by using `http://10.0.2.2:5000`
instead of `http://localhost:5000`.

### Why This Change?

- **Android Emulator**: The emulator runs in its own virtual network
- **`localhost`** in the emulator refers to the emulator itself, not your computer
- **`10.0.2.2`** is a special IP address that routes to your computer's localhost

## 🚀 How to Run

### Step 1: Ensure Backend is Running

Make sure your Flask backend is running on port 5000:

```bash
cd Backend
python app.py
```

You should see:

```
🏛️  AI COURT BACKEND SERVER
🖥️ Server starting on http://localhost:5000
🤖 AI Model: Loaded
🧠 GenAI Reasoner: Active
```

### Step 2: Hot Restart the Flutter App

Since the code has been updated, you need to restart the app:

1. In the terminal where Flutter is running, press `R` (capital R) for a full restart
2. Or press `r` (lowercase r) for a hot reload
3. Or stop and restart: Press `q` to quit, then run `flutter run` again

### Step 3: Test the Connection

1. The app should now be running without the red error
2. Try creating a new case:
    - Click the "New Case" button from dashboard
    - Fill in the case details
    - Submit for AI judgment
    - The app should connect to backend and show AI verdict

## 🧪 Quick Test Case

Use this to test the backend connection:

**Title**: Contract Breach Test

**Plaintiff Statement**:

```
I hired the defendant to deliver 100 products by March 1st. 
They only delivered 50 products and that too 2 weeks late.
```

**Defendant Statement**:

```
There was a supply chain issue beyond my control. 
I delivered as soon as possible and offered a discount.
```

**Evidence**:

```
Contract dated January 15, 2024. Delivery receipt showing 50 items received on March 15, 2024.
```

## 🔧 Troubleshooting

### Still seeing connection error?

1. **Check Backend is Running**:
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"healthy",...}`

2. **Check Firewall**:
    - Windows Firewall might block the connection
    - Allow Python through Windows Firewall
    - Or temporarily disable firewall to test

3. **Restart Flutter App**:
    - Press `R` in terminal for full restart
    - Or `flutter run` again

4. **Check Port**:
    - Backend should be on port 5000
    - If different, update `lib/services/api_service.dart`

### Backend Connection Test

Test backend from your computer's browser:

- Open: `http://localhost:5000/health`
- Should show JSON with "status": "healthy"

### Check Android Emulator Network

From within the emulator, the connection should work to:

- `http://10.0.2.2:5000` ✅ (Your computer's localhost)
- NOT `http://localhost:5000` ❌ (Points to emulator itself)

## 📱 Alternative: Use Physical Device

If emulator still has issues, you can use a physical Android device:

1. Enable USB Debugging on your phone
2. Connect via USB
3. Update API URL to your computer's IP:
   ```dart
   // In lib/services/api_service.dart
   static const String baseUrl = 'http://YOUR_COMPUTER_IP:5000';
   ```
4. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
5. Use the IP from your local network (e.g., `http://192.168.1.100:5000`)

## ✨ Expected Behavior

Once connected:

1. ✅ No red error on Create New Case screen
2. ✅ Submit button works
3. ✅ Shows "Analyzing case with AI..." message
4. ✅ Shows "Generating detailed reasoning..." message
5. ✅ Navigates to case detail with full verdict
6. ✅ Verdict shows winner, confidence, scores, and reasoning

## 🎉 Success!

If you can submit a case and see the AI verdict, the integration is working perfectly!

---

**Note**: The API URL is set in `Frontend/ai_court_app/lib/services/api_service.dart`
