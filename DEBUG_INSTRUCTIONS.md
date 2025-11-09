# Debug Instructions - Text Truncation Issue

## Problem

The reasoning text is showing "ogical Justification:" instead of "**L**ogical Justification:" - the
first "L" is being cut off.

## Comprehensive Logging Added

We've added extensive logging at every step of the data flow to identify exactly where the
truncation happens.

### 1. Backend: GenAI Model Output

**File**: `Backend/model/gen_ai_reasoner.py`  
**Look for**:

```
🔍 DEBUG: Raw model output length: XXX
🔍 DEBUG: First 300 chars: ...
```

### 2. Backend: Extraction Process

**File**: `Backend/model/gen_ai_reasoner.py` → `_extract_reasoning()`  
**Look for**:

```
✅ DEBUG: Extracted using phrase: ...
```

### 3. Backend: Cleaning Process

**File**: `Backend/model/gen_ai_reasoner.py` → `_clean_reasoning_start()`  
**Look for**:

```
🧹 CLEANING REASONING START:
   Input length: XXX
   First 80 chars: '...'
   First char: 'X' (code: XXX)
   ...
   ✅ FINAL first 80 chars: '...'
   ✅ FINAL first char: 'X' (code: XXX)
```

### 4. Backend: API Response

**File**: `Backend/app.py` → `/api/genai_reason` endpoint  
**Look for**:

```
============================================================
🔍 BACKEND DEBUG - SENDING TO FRONTEND:
============================================================
Reasoning length: XXX
First 100 chars: '...'
First char code: XXX
First char: 'X' (visible: True)
============================================================
```

### 5. Frontend: Reception

**File**: `Frontend/src/pages/NewCase.jsx`  
**Look in Browser Console (F12) for**:

```
📥 FRONTEND RECEIVED FROM BACKEND:
Raw response: {...}
Reasoning field: ...
First 100 chars: ...
First char: 'X'
First char code: XXX
```

### 6. Frontend: Typing Animation

**Look in Browser Console for**:

```
🔍 FRONTEND DEBUG: Full reasoning received: ...
🔍 FRONTEND DEBUG: Reasoning length: XXX
🔍 FRONTEND DEBUG: First 50 chars: ...
```

## How to Debug

### Step 1: Restart Backend

```powershell
cd "Code Vibers\Code Vibers\Code Vibers\Backend"
python app.py
```

### Step 2: Submit a Test Case

1. Go to http://localhost:5173/new-case
2. Fill in the form with any test data
3. Click "Submit Case for Judgment"

### Step 3: Check Backend Terminal

Look at the backend terminal output and trace through each step:

1. **Raw Model Output** - Does it start with the full prompt?
2. **After Extraction** - Does it correctly remove the prompt?
3. **After Cleaning** - Does the first character look correct?
4. **Sending to Frontend** - Is the full text with correct first char being sent?

### Step 4: Check Browser Console

Open Browser DevTools (F12) → Console tab:

1. Look for "📥 FRONTEND RECEIVED FROM BACKEND:"
2. Check the "First char" and "First char code"
3. Compare with what the backend sent
4. Check "First 100 chars" - does it match the backend?

### Step 5: Identify Where Truncation Happens

**If backend shows correct text but frontend shows truncated:**
→ Problem is in JSON transmission or frontend reception

**If cleaning step shows truncation:**
→ Problem is in `_clean_reasoning_start()` method

**If extraction step shows truncation:**
→ Problem is in how we split the prompt from response

**If raw model output is already truncated:**
→ Problem is in model generation or tokenization

## Expected vs Actual

### Expected:

```
Backend: "Logical Justification: ..."
Frontend receives: "Logical Justification: ..."
Display shows: "Logical Justification: ..."
```

### Current (Actual):

```
Backend: ??? (to be determined)
Frontend receives: ??? (to be determined)  
Display shows: "ogical Justification: ..."
```

## Next Steps

After running the test with full logging:

1. **Copy the backend terminal output** showing all debug logs
2. **Copy the browser console output** showing all debug logs
3. **Compare the first 100 characters** at each step
4. **Identify which step introduces the truncation**
5. **Fix that specific step**

The comprehensive logging will tell us EXACTLY where the "L" is being lost!
