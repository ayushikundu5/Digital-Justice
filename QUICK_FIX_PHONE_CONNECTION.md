# Quick Fix - Phone Can't Connect to Backend

## 🔴 The Problem

Your phone shows: "Cannot connect to backend server" or "Connection failed"

This is because **Windows Firewall is blocking** the connection.

## ✅ Quick Solution (30 seconds)

### Option 1: Run the Firewall Script (Easiest)

1. **Find the file**: `add_firewall_rule.ps1` (in your project folder)

2. **Right-click** on it

3. **Select**: "Run with PowerShell as Administrator"

4. **Done!** The port is now open.

### Option 2: Manual Firewall Rule (2 minutes)

1. **Press** `Windows + R`

2. **Type**: `wf.msc` and press Enter

3. **Click** "Inbound Rules" (left panel)

4. **Click** "New Rule..." (right panel)

5. **Select** "Port" → Next

6. **Type**: `5000` → Next

7. **Select** "Allow the connection" → Next

8. **Check all boxes** → Next

9. **Name**: "AI Court" → Finish

### Option 3: Test Without Firewall (Quick Test)

⚠️ **Temporary only - for testing:**

1. Open Windows Settings
2. Search "Firewall"
3. Click "Firewall & network protection"
4. Click "Private network"
5. Turn OFF Windows Defender Firewall
6. Test your app
7. **Turn it back ON** after testing

## 📱 After Fixing Firewall

1. **Make sure backend is running**:
   ```bash
   cd Backend
   python app.py
   ```

2. **Test from phone's browser**:
    - Open Chrome on your phone
    - Go to: `http://10.94.230.53:5000/health`
    - You should see JSON response

3. **If browser works**, open the app and try again!

## ✅ Checklist

Before testing the app:

- [ ] Backend is running (`python app.py`)
- [ ] Firewall rule added (Option 1 or 2)
- [ ] Phone and computer on **same Wi-Fi**
- [ ] Test URL works in phone's browser

## 🎯 Test in App

1. Open AI Court app on your phone
2. Login (any email/password)
3. Click "New Case"
4. Fill in the form
5. Click "Submit Case for AI Judgment"
6. ✅ It should work now!

## 🔍 Still Not Working?

### Check 1: Backend Running?

In terminal, you should see:

```
🏛️  AI COURT BACKEND SERVER
🖥️ Server starting on http://localhost:5000
🤖 AI Model: Loaded
🧠 GenAI Reasoner: Active
```

If not, run: `cd Backend && python app.py`

### Check 2: Same Wi-Fi Network?

- Computer Wi-Fi: Check Windows system tray
- Phone Wi-Fi: Check phone settings
- **Must be the same network!**

### Check 3: Correct IP?

Run in PowerShell:

```powershell
ipconfig
```

Look for "IPv4 Address" under "Wi-Fi" section.
Should be: `10.94.230.53`

If different, update `lib/services/api_service.dart` and rebuild APK.

### Check 4: Port 5000 Not Blocked?

Test from your computer's browser:

```
http://10.94.230.53:5000/health
```

Should show JSON. If not, port is blocked.

## 🚀 Quick Commands

### Check if backend is accessible:

```bash
# From computer
curl http://10.94.230.53:5000/health

# Should return:
# {"status":"healthy","ai_model":"loaded","genai":"active"}
```

### Restart backend:

```bash
cd Backend
python app.py
```

### Check firewall rules:

```powershell
Get-NetFirewallRule -DisplayName "*AI Court*"
```

## ⚡ TL;DR

1. **Right-click** `add_firewall_rule.ps1` → **Run as Administrator**
2. **Backend running?** `cd Backend && python app.py`
3. **Test in phone browser**: `http://10.94.230.53:5000/health`
4. **Open app and try again!**

---

**That's it!** Once firewall is open, everything works. 🎉
