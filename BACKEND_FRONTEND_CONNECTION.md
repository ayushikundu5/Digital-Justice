# Backend-Frontend Connection Guide 🔗

## Overview

The AI Court system uses a **REST API** architecture where the React frontend communicates with the
Flask backend through HTTP requests.

## Connection Architecture

```
┌─────────────────┐         HTTP/REST API        ┌──────────────────┐
│                 │    ←───────────────────→     │                  │
│  React Frontend │    http://localhost:5000     │  Flask Backend   │
│  (Port 5173)    │                              │  (Port 5000)     │
│                 │                              │                  │
└─────────────────┘                              └──────────────────┘
        │                                                  │
        │                                                  │
        ▼                                                  ▼
  localStorage                                      AI Judge Model
  (Case Storage)                                    (Verdict Logic)
```

## API Endpoints

### 1. Health Check

**GET** `http://localhost:5000/health`

**Response:**

```json
{
  "status": "healthy",
  "ai_model": "loaded" | "using fallback"
}
```

**Purpose:** Check if backend is running and AI model status

---

### 2. Get API Info

**GET** `http://localhost:5000/`

**Response:**

```json
{
  "status": "running",
  "message": "AI Court Backend API",
  "version": "1.0.0",
  "ai_model_available": true,
  "endpoints": {
    "POST /verdict": "Submit a case for judgment",
    "GET /health": "Health check",
    "GET /": "API information"
  }
}
```

---

### 3. Submit Case for Verdict

**POST** `http://localhost:5000/verdict`

**Request Body:**

```json
{
  "plaintiff": "The tenant failed to pay rent for three months despite multiple reminders.",
  "defendant": "The property had severe water damage that made it uninhabitable.",
  "evidence": "Rental agreement, payment records, photos of water damage (optional)"
}
```

**Success Response (200):**

```json
{
  "winner": "Defendant",
  "reasoning": "The defendant's response effectively counters the plaintiff's claims...",
  "confidence": "high",
  "model": "AI Judge ML Model",
  "plaintiff_score": 5,
  "defendant_score": 8
}
```

**Error Response (400):**

```json
{
  "error": "Missing required fields",
  "message": "Both plaintiff and defendant statements are required"
}
```

---

## Frontend Integration

### API Client Configuration

**File:** `Frontend/src/utils/api.js`

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

export const submitCase = async (caseData) => {
  const response = await api.post('/verdict', {
    plaintiff: caseData.plaintiff,
    defendant: caseData.defendant,
    evidence: caseData.evidence
  });
  return response.data;
};
```

### Usage in Components

**Example: NewCase.jsx**

```javascript
import { submitCase } from '../utils/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const verdict = await submitCase({
      plaintiff: formData.plaintiff,
      defendant: formData.defendant,
      evidence: formData.evidence
    });

    // Save case with verdict to localStorage
    const newCase = {
      id: Date.now(),
      title: formData.title,
      plaintiff: formData.plaintiff,
      defendant: formData.defendant,
      evidence: formData.evidence,
      verdict: verdict,
      status: 'resolved',
      createdAt: new Date().toISOString()
    };

    // Store locally
    const cases = JSON.parse(localStorage.getItem('cases') || '[]');
    cases.push(newCase);
    localStorage.setItem('cases', JSON.stringify(cases));

    toast.success('Case submitted successfully!');
    navigate(`/cases/${newCase.id}`);
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      toast.error('Cannot connect to backend server.');
    } else {
      toast.error('Failed to submit case.');
    }
  } finally {
    setLoading(false);
  }
};
```

## Connection Status Monitoring

The frontend includes a real-time backend status indicator:

**Component:** `Frontend/src/components/BackendStatus.jsx`

Features:

- ✅ Automatic connection checking every 30 seconds
- ✅ Visual status indicators (green/red/yellow)
- ✅ AI model availability display
- ✅ Helpful error messages

## Testing the Connection

### Step 1: Start Backend

```bash
cd "Code Vibers/Backend"
python app.py
```

**Expected Output:**

```
==================================================
🏛️  AI COURT BACKEND SERVER
==================================================
📡 Server starting on http://localhost:5000
🤖 AI Model: Loaded (or Using Fallback Logic)
🔗 CORS: Enabled
==================================================

 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

### Step 2: Test Backend Manually

**Open browser or use curl:**

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test verdict endpoint
curl -X POST http://localhost:5000/verdict \
  -H "Content-Type: application/json" \
  -d '{"plaintiff":"Test claim","defendant":"Test defense"}'
```

### Step 3: Start Frontend

```bash
cd "Code Vibers/Frontend"
npm run dev
```

**Expected Output:**

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Test Full Integration

1. Open http://localhost:5173
2. Check Dashboard for **green backend status indicator**
3. Go to "New Case"
4. Submit a test case
5. Verify verdict is received and displayed

## CORS Configuration

**Backend (app.py):**

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows all origins in development
```

**Why CORS is needed:**

- Frontend runs on port 5173
- Backend runs on port 5000
- Different ports = different origins
- CORS allows cross-origin requests

## Troubleshooting

### Issue 1: "Cannot connect to backend"

**Symptoms:**

- Red status indicator on Dashboard
- Error: "ERR_NETWORK" when submitting cases
- Toast notification: "Cannot connect to backend server"

**Solutions:**

1. ✅ Check if backend is running: `http://localhost:5000`
2. ✅ Verify port 5000 is not blocked by firewall
3. ✅ Check backend terminal for errors
4. ✅ Restart backend: `python app.py`

---

### Issue 2: "CORS Error"

**Symptoms:**

- Browser console shows CORS policy error
- "Access-Control-Allow-Origin" header missing

**Solutions:**

1. ✅ Install flask-cors: `pip install flask-cors`
2. ✅ Verify CORS is enabled in `app.py`
3. ✅ Restart backend server

---

### Issue 3: "500 Internal Server Error"

**Symptoms:**

- Backend responds but returns 500 error
- Case submission fails

**Solutions:**

1. ✅ Check backend terminal for Python errors
2. ✅ Verify AI model files exist (if using ML model)
3. ✅ Check request body format matches expected structure
4. ✅ Backend will fallback to rule-based logic if AI model fails

---

### Issue 4: "Timeout Error"

**Symptoms:**

- Request takes too long
- Error: "timeout of 30000ms exceeded"

**Solutions:**

1. ✅ Backend may be processing slowly
2. ✅ Increase timeout in `api.js` (currently 30 seconds)
3. ✅ Check backend logs for performance issues

---

## Data Flow Example

### Submitting a Case

```
1. User fills form in NewCase.jsx
   ├─ Title: "Contract Dispute"
   ├─ Plaintiff: "I paid $500 for services never delivered..."
   ├─ Defendant: "The service was completed but client refused inspection..."
   └─ Evidence: "Contract PDF, email thread, payment receipt"

2. Form submitted → submitCase() called
   ├─ API request sent to POST /verdict
   └─ Request body: { plaintiff, defendant, evidence }

3. Backend receives request
   ├─ Validates input
   ├─ Processes through AI model (or fallback logic)
   └─ Generates verdict with reasoning

4. Backend responds
   └─ Response: { winner, reasoning, confidence, model, scores }

5. Frontend receives verdict
   ├─ Creates case object with all data
   ├─ Saves to localStorage
   ├─ Shows success toast
   └─ Navigates to case detail page

6. CaseDetail.jsx displays
   ├─ Plaintiff statement
   ├─ Defendant statement
   ├─ Evidence (if provided)
   └─ AI Verdict with full details
```

## Backend AI Model vs Fallback

### AI Model Mode (if available)

```python
# Uses machine learning model
ml_verdict = ml_predict_verdict(plaintiff, defendant, evidence)
result = genai_reasoning(plaintiff, defendant, evidence, ml_verdict)
```

**Features:**

- ✅ Trained ML model predictions
- ✅ Higher confidence ratings
- ✅ More nuanced analysis

### Fallback Mode (default)

```python
# Uses rule-based logic
verdict = get_fallback_verdict(plaintiff, defendant)
```

**Features:**

- ✅ Keyword analysis
- ✅ Scoring system
- ✅ Always available
- ✅ No model dependencies

## Performance Optimization

### Frontend

- ✅ 30-second connection check interval (not too frequent)
- ✅ 30-second API timeout
- ✅ Error handling with user-friendly messages
- ✅ Loading states during API calls

### Backend

- ✅ CORS enabled for all routes
- ✅ JSON responses
- ✅ Error handling with proper status codes
- ✅ Fallback logic if AI model fails

## Security Considerations

### Current Setup (Development)

- ⚠️ No authentication on API endpoints
- ⚠️ CORS allows all origins
- ⚠️ No rate limiting

### Production Recommendations

- ✅ Add JWT authentication
- ✅ Restrict CORS to specific origin
- ✅ Add rate limiting
- ✅ Use HTTPS
- ✅ Validate and sanitize all inputs
- ✅ Add request logging

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

**Usage:**

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### Backend (.env)

```env
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
```

## Summary

✅ **Backend** exposes REST API on port 5000  
✅ **Frontend** makes HTTP requests using Axios  
✅ **CORS** enabled for cross-origin communication  
✅ **Connection status** monitored in real-time  
✅ **Error handling** at both frontend and backend  
✅ **Fallback logic** ensures system always works  
✅ **AI Model** optional, falls back to rule-based system

---

**The connection is fully configured and ready to use!** 🚀
