# ✅ Port 5000 Issue Fixed!

## Problem

Windows 10/11 reserves port 5000 for system services, causing this error:

```
An attempt was made to access a socket in a way forbidden by its access permissions
```

## Solution Applied

Changed backend port from **5000** to **5001**

## What Was Changed

### 1. Backend (`Backend/app.py`)

```python
# Changed from port 5000 to 5001
app.run(debug=True, host='0.0.0.0', port=5001)
```

### 2. Frontend API (`Frontend/src/utils/api.js`)

```javascript
// Changed from 5000 to 5001
const API_BASE_URL = 'http://localhost:5001';
```

### 3. All Documentation Updated

- ✅ QUICK_START.md
- ✅ SETUP.md
- ✅ CONNECTION_SUMMARY.md
- ✅ BACKEND_FRONTEND_CONNECTION.md

## Now Try Again!

### Step 1: Start Backend

```bash
cd "Code Vibers\Backend"
python app.py
```

**Expected Output:**

```
==================================================
🏛️  AI COURT BACKEND SERVER
==================================================
📡 Server starting on http://localhost:5001  ← NEW PORT!
🤖 AI Model: Using Fallback Logic
🔗 CORS: Enabled
==================================================

 * Serving Flask app 'app'
 * Debug mode: on
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5001
 * Running on http://192.168.x.x:5001
```

### Step 2: Start Frontend

```bash
cd "Code Vibers\Frontend"
npm run dev
```

### Step 3: Test

1. Open http://localhost:5173
2. Dashboard should show **green "Backend Server: Connected"** badge
3. Try submitting a case!

## Why Port 5000 Was Blocked

On Windows 10/11, port 5000 is reserved by:

- Windows NAT Driver (WinNAT)
- Hyper-V
- Windows Subsystem for Linux (WSL)

**Port 5001 is safe to use!**

## Alternative Solutions (if 5001 also doesn't work)

### Option 1: Use Port 8000

Edit `Backend/app.py`:

```python
app.run(debug=True, host='0.0.0.0', port=8000)
```

Edit `Frontend/src/utils/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000';
```

### Option 2: Disable Hyper-V (Advanced)

```powershell
# Run PowerShell as Administrator
net stop winnat
# Restart backend
# Then re-enable:
net start winnat
```

## Verification Checklist

✅ Backend starts without errors  
✅ Shows "Running on http://127.0.0.1:5001"  
✅ Frontend shows green connection status  
✅ Can submit cases successfully

## Still Having Issues?

1. **Check if port is available:**
   ```powershell
   netstat -ano | findstr :5001
   ```
   Should show nothing (port is free)

2. **Check firewall:**
    - Windows Defender may block it
    - Allow Python through firewall

3. **Try a different port:**
    - 5001, 5002, 8000, 8080 are usually safe

## Quick Test Commands

**Test Backend:**

```powershell
# In PowerShell
Invoke-WebRequest -Uri http://localhost:5001 -Method GET
```

**Or in browser:**

```
http://localhost:5001
```

Should show JSON response with API info!

---

**The fix is complete! Backend now runs on port 5001.** 🎉
