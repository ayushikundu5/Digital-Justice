# Quick Start Cheat Sheet 🚀

## One-Command Start (After Initial Setup)

### Terminal 1 - Backend

```bash
cd "Code Vibers\Backend"
.\venv\Scripts\activate
python app.py
```

✅ Backend running at: **http://localhost:5001**

### Terminal 2 - Frontend

```bash
cd "Code Vibers\Frontend"
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

## First Time Setup

### Backend (5 minutes)

```bash
cd "Code Vibers\Backend"
python -m venv venv
.\venv\Scripts\activate
pip install flask flask-cors
python app.py
```

### Frontend (3 minutes)

```bash
cd "Code Vibers\Frontend"
npm install
npm run dev
```

---

## Common Commands

| Action | Command |
|--------|---------|
| **Start Backend** | `cd "Code Vibers\Backend" && python app.py` |
| **Start Frontend** | `cd "Code Vibers\Frontend" && npm run dev` |
| **Install Backend Deps** | `pip install -r requirements.txt` |
| **Install Frontend Deps** | `npm install` |
| **Build Frontend** | `npm run build` |
| **Stop Server** | `Ctrl + C` |

---

## URLs to Remember

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:5001 |
| **Login Page** | http://localhost:5173/login |
| **Dashboard** | http://localhost:5173/dashboard |

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| ❌ Backend won't start | Activate venv: `.\venv\Scripts\activate` |
| ❌ Port already in use | Kill process or use different port |
| ❌ Module not found | Run: `pip install flask flask-cors` |
| ❌ Frontend errors | Delete `node_modules`, run `npm install` |
| ❌ CORS errors | Make sure backend is running |
| ❌ Can't submit case | Backend must be running on port 5001 |

---

## File Checklist

Before starting, ensure these exist:

- ✅ `Code Vibers/Backend/app.py`
- ✅ `Code Vibers/Frontend/package.json`
- ✅ `Code Vibers/Frontend/src/App.jsx`

---

## Test the Setup

1. **Backend Test**: Visit http://localhost:5001 (should show API info)
2. **Frontend Test**: Visit http://localhost:5173 (should show login page)
3. **Full Test**:
    - Create account → Dashboard → New Case → Submit
    - Should see verdict

// ... existing code ...
