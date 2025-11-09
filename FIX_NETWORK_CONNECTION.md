# Fix Network Connection Issues

## The Problem

Your Flutter app on the phone cannot connect to the backend on your computer. This is due to:

1. Windows Firewall blocking incoming connections
2. Network configuration

## ✅ Solution: Allow Backend Through Firewall

### Method 1: Allow Python Through Windows Firewall (Recommended)

1. **Open Windows Firewall Settings**:
    - Press `Windows + R`
    - Type: `firewall.cpl`
    - Press Enter

2. **Click "Allow an app or feature through Windows Defender Firewall"**

3. **Click "Change settings"** (top right)

4. **Click "Allow another app..."**

5. **Browse and select Python**:
    - Click "Browse..."
    - Navigate to your Python installation (usually):
      ```
      C:\Users\SOUVIK\AppData\Local\Programs\Python\Python3XX\python.exe
      ```
    - Or wherever Python is installed

6. **Add Python**:
    - Click "Add"
    - Check both "Private" and "Public" boxes
    - Click "OK"

### Method 2: Create Specific Port Rule

1. **Open Windows Defender Firewall with Advanced Security**:
    - Press `Windows + R`
    - Type: `wf.msc`
    - Press Enter

2. **Create Inbound Rule**:
    - Click "Inbound Rules" (left panel)
    - Click "New Rule..." (right panel)
    - Select "Port", click Next
    - Select "TCP", Specific local ports: `5000`
    - Click Next
    - Select "Allow the connection"
    - Click Next
    - Check all profiles (Domain, Private, Public)
    - Click Next
    - Name: "AI Court Backend"
    - Click Finish

### Method 3: Temporarily Disable Firewall (Testing Only)

**⚠️ Not recommended for security reasons, only for testing:**

1. Open Windows Settings
2. Go to "Update & Security" → "Windows Security"
3. Click "Firewall & network protection"
4. Turn off firewall for Private network

**Don't forget to turn it back on after testing!**

## 🔧 Restart Backend with Correct Settings

Make sure your backend is running and accepting connections:

```bash
cd Backend
python app.py
```

You should see:

```
🏛️  AI COURT BACKEND SERVER
🖥️ Server starting on http://localhost:5000
```

## 📱 Verify Connection from Phone

### Test 1: Check if Phone Can Reach Computer

On your phone, open Chrome browser and go to:

```
http://10.94.230.53:5000/health
```

You should see JSON response like:

```json
{
  "status": "healthy",
  "ai_model": "loaded",
  "genai": "active"
}
```

If this works, the app will work too!

### Test 2: From Computer Command Line

```bash
curl http://10.94.230.53:5000/health
```

Should return the same JSON.

## ✅ Once Firewall is Fixed

1. **Restart the backend**:
   ```bash
   cd Backend
   python app.py
   ```

2. **Open the app on your phone**

3. **Try submitting a case** - it should work now!

## 🌐 Network Requirements

Make sure:

- ✅ Phone and computer on **same Wi-Fi network**
- ✅ Computer IP is: `10.94.230.53`
- ✅ Backend running on port `5000`
- ✅ Firewall allows connections
- ✅ App configured with: `http://10.94.230.53:5000`

## 🔍 Troubleshooting

### Error: "Connection failed"

- **Cause**: Firewall blocking
- **Fix**: Follow Method 1 or 2 above

### Error: "Connection refused"

- **Cause**: Backend not running
- **Fix**: Start backend with `python app.py`

### Error: "Network unreachable"

- **Cause**: Different Wi-Fi networks
- **Fix**: Connect phone and computer to same network

### Error: "Timeout"

- **Cause**: Wrong IP address
- **Fix**: Get IP with `ipconfig` and update app

## 🚀 Quick Fix Command

If you just want to test quickly, run this in PowerShell as Administrator:

```powershell
New-NetFirewallRule -DisplayName "AI Court Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

This creates the firewall rule automatically.

## ✨ After Fixing

Once the firewall is configured:

1. Backend will be accessible from phone
2. App can submit cases
3. AI verdicts will work
4. Full app functionality enabled

---

**Current Status**:

- ✅ Backend configured correctly (`host='0.0.0.0'`)
- ✅ App configured with correct IP (`10.94.230.53`)
- ⏳ **Waiting for**: Firewall rule to allow connections

**Next Step**: Add firewall rule using Method 1 or run the PowerShell command above.
