# AI Court System - Setup Guide

This guide will help you set up and run the AI Court system, which includes both frontend and
backend components.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://www.python.org/)
- **npm** or **yarn** - Comes with Node.js
- **pip** - Comes with Python

## Project Structure

```
Code Vibers/
├── Backend/          # Flask API server
│   ├── app.py
│   ├── model/
│   └── requirements.txt
└── Frontend/         # React application
    ├── src/
    ├── package.json
    └── vite.config.js
```

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd "Code Vibers/Backend"
```

### 2. Create Virtual Environment (Recommended)

**Windows:**

```bash
python -m venv venv
.\venv\Scripts\activate
```

**macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist or needs updating, install these:

```bash
pip install flask flask-cors numpy pandas scikit-learn
```

### 4. Run the Backend Server

```bash
python app.py
```

The backend server should now be running at `http://localhost:5000`

You should see output similar to:

```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Backend API Endpoints

- **POST /verdict** - Submit a case for judgment
    - Request body: `{ "plaintiff": "...", "defendant": "..." }`
    - Response: `{ "winner": "...", "reasoning": "..." }`

## Frontend Setup

### 1. Open New Terminal

Keep the backend server running and open a **new terminal window**.

### 2. Navigate to Frontend Directory

```bash
cd "Code Vibers/Frontend"
```

### 3. Install Dependencies

```bash
npm install
```

This will install all required packages including:

- React 19
- Vite
- React Router
- Zustand
- Axios
- Tailwind CSS
- React Hot Toast

### 4. Start Development Server

```bash
npm run dev
```

The frontend should now be running at `http://localhost:5173`

You should see output similar to:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5. Open in Browser

Open your browser and navigate to:

```
http://localhost:5173
```

## Using the Application

### First Time Setup

1. **Start with Login Page**
    - The app will redirect you to `/login` if not authenticated

2. **Create an Account**
    - Click "Sign up" link
    - Fill in your details (email, password, name)
    - Click "Sign Up"

3. **You'll be redirected to the Dashboard**

### Submitting a Case

1. Click "New Case" from the dashboard or navigation
2. Fill in:
    - **Case Title**: A brief description
    - **Plaintiff's Statement**: The claim and evidence
    - **Defendant's Response**: The defense and counter-evidence
3. Click "Submit Case for Judgment"
4. Wait for the AI to process (requires backend running)
5. View the verdict with detailed reasoning

### Managing Cases

- **Dashboard**: Overview of all cases with statistics
- **Cases**: List of all submitted cases with search and filter
- **Case Detail**: Click any case to view full details and verdict
- **Profile**: View account info and logout

## Troubleshooting

### Backend Issues

**Error: `ModuleNotFoundError: No module named 'flask'`**

- Solution: Activate virtual environment and install dependencies
  ```bash
  .\venv\Scripts\activate  # Windows
  pip install flask flask-cors
  ```

**Error: `Address already in use`**

- Solution: Port 5000 is busy. Either:
    - Kill the process using port 5000
    - Change port in `app.py`: `app.run(debug=True, port=5001)`
    - Update `Frontend/src/utils/api.js` with new port

### Frontend Issues

**Error: `Failed to submit case`**

- Solution: Make sure backend is running on `http://localhost:5000`
- Check browser console for detailed error
- Verify backend is accessible: Open `http://localhost:5000` in browser

**Error: Module not found or import errors**

- Solution: Delete `node_modules` and reinstall
  ```bash
  rm -rf node_modules package-lock.json  # or manually delete
  npm install
  ```

**Build/Style Issues**

- Solution: Clear cache and rebuild
  ```bash
  npm run build
  rm -rf node_modules/.vite  # or manually delete
  npm run dev
  ```

### CORS Issues

If you see CORS errors in the browser console:

1. Make sure `flask-cors` is installed in backend
2. Update `app.py` to include CORS:
   ```python
   from flask_cors import CORS
   
   app = Flask(__name__)
   CORS(app)
   ```

## Production Build

### Frontend

```bash
cd "Code Vibers/Frontend"
npm run build
```

This creates an optimized build in the `dist` folder.

### Backend

For production deployment, use a production WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn app:app
```

## Environment Variables

### Frontend

Create `Frontend/.env` for custom configuration:

```env
VITE_API_URL=http://localhost:5000
```

### Backend

Create `Backend/.env` for configuration:

```env
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
```

## Support

For issues or questions:

1. Check this guide's troubleshooting section
2. Review the README files in Frontend/ and Backend/ directories
3. Check browser console for frontend errors
4. Check terminal output for backend errors

## Quick Start Commands

**Terminal 1 (Backend):**

```bash
cd "Code Vibers/Backend"
python -m venv venv
.\venv\Scripts\activate  # Windows: .\venv\Scripts\activate
pip install flask flask-cors
python app.py
```

**Terminal 2 (Frontend):**

```bash
cd "Code Vibers/Frontend"
npm install
npm run dev
```

**Then open:** http://localhost:5173

---

🎉 **Congratulations!** Your AI Court system should now be up and running!
