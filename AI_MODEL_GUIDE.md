# 🤖 AI Model Guide - Check & Test

## ✅ Your AI Model Status

Good news! Your AI model files **already exist**:

```
Backend/model/
├── models/
│   ├── judge_model.pkl      ✅ EXISTS (1.6KB)
│   └── vectorizer.pkl       ✅ EXISTS (2.0KB)
├── ai_judge.py              ✅ Main AI logic
└── train_model.py           ✅ Training script
```

## 🔍 Quick Check Methods

### Method 1: Check Backend Startup (Easiest)

When you start the backend, look for this message:

```bash
cd "Code Vibers\Backend"
python app.py
```

**If AI Model is loaded:**

```
✅ AI Judge model loaded successfully!
🤖 AI Model: Loaded
```

**If using fallback:**

```
⚠️  AI Judge model not available: [error message]
🤖 AI Model: Using Fallback Logic
```

---

### Method 2: Test AI Model Directly

Run the AI judge module directly:

```bash
cd "Code Vibers\Backend"
python -m model.ai_judge
```

**Expected Output:**

```python
{
  'verdict': 'Defendant',  # or Plaintiff/Neutral
  'reasoning': 'The defendant\'s response and supporting evidence...'
}
```

---

### Method 3: Check Model Files Exist

```bash
cd "Code Vibers\Backend\model\models"
dir
```

**Should show:**

```
judge_model.pkl     (1-3 KB)
vectorizer.pkl      (2-3 KB)
```

---

### Method 4: Test via Frontend

1. Start backend: `python app.py`
2. Start frontend: `npm run dev`
3. Check Dashboard for: **"🤖 AI Model Active"** or **"📝 Fallback Mode"**
4. Submit a test case
5. Check verdict response for `"model": "AI Judge ML Model"` or `"model": "Fallback Logic"`

---

## 🧪 Complete AI Model Test

### Test Script

Create this test file: `Backend/test_ai_model.py`

```python
import sys
import os

# Add model directory to path
sys.path.append(os.path.dirname(__file__))

print("="*50)
print("🧪 AI MODEL TEST")
print("="*50)

# Test 1: Check if model files exist
print("\n1️⃣ Checking model files...")
model_path = "model/models/judge_model.pkl"
vectorizer_path = "model/models/vectorizer.pkl"

if os.path.exists(model_path):
    print(f"   ✅ {model_path} exists")
else:
    print(f"   ❌ {model_path} NOT FOUND")

if os.path.exists(vectorizer_path):
    print(f"   ✅ {vectorizer_path} exists")
else:
    print(f"   ❌ {vectorizer_path} NOT FOUND")

# Test 2: Try to import the AI judge
print("\n2️⃣ Testing AI judge import...")
try:
    from model.ai_judge import ml_predict_verdict, genai_reasoning
    print("   ✅ AI judge imported successfully")
except Exception as e:
    print(f"   ❌ Import failed: {e}")
    sys.exit(1)

# Test 3: Run prediction
print("\n3️⃣ Testing verdict prediction...")
try:
    plaintiff = "The tenant refused to pay rent for three months."
    defendant = "The property had severe water damage."
    evidence = "Photos of damage, rental agreement"
    
    verdict = ml_predict_verdict(plaintiff, defendant, evidence)
    result = genai_reasoning(plaintiff, defendant, evidence, verdict)
    
    print(f"   ✅ Prediction successful!")
    print(f"   Winner: {result['verdict']}")
    print(f"   Reasoning: {result['reasoning'][:60]}...")
except Exception as e:
    print(f"   ❌ Prediction failed: {e}")
    sys.exit(1)

print("\n" + "="*50)
print("✅ ALL TESTS PASSED!")
print("="*50)
```

### Run Test

```bash
cd "Code Vibers\Backend"
python test_ai_model.py
```

---

## 🔄 Retrain Your AI Model

If you want to improve or retrain the model:

### Option 1: Use Existing Training Data

```bash
cd "Code Vibers\Backend"
python model/train_model.py
```

**Output:**

```
Classification Report:
              precision    recall  f1-score   support

   Defendant       1.00      1.00      1.00         1
   Plaintiff       1.00      1.00      1.00         1

    accuracy                           1.00         2

✅ Model and vectorizer saved successfully
```

### Option 2: Train with CSV Dataset

Your dataset exists at: `Backend/data/ai_judge_dataset_clean.csv`

Update `train_model.py` to use it:

```python
# Instead of the example data, load CSV:
df = pd.read_csv("../data/ai_judge_dataset_clean.csv")
```

Then run:

```bash
python model/train_model.py
```

---

## 📊 Understanding Your AI Model

### Model Type

- **Algorithm:** Logistic Regression
- **Input:** Text (plaintiff + defendant + evidence)
- **Output:** Verdict (Plaintiff / Defendant / Neutral)
- **Vectorization:** TF-IDF (Term Frequency-Inverse Document Frequency)

### How It Works

```
1. User input (plaintiff, defendant, evidence)
           ↓
2. Text preprocessing & vectorization
           ↓
3. ML Model prediction
           ↓
4. Verdict classification (Plaintiff/Defendant/Neutral)
           ↓
5. Reasoning generation
           ↓
6. Response to frontend
```

---

## 🔍 Model Performance Indicators

### When Backend Starts

**Good Signs:**

```
✅ AI Judge model loaded successfully!
🤖 AI Model: Loaded
```

**Fallback Mode (Still Works):**

```
⚠️  AI Judge model not available: No module named 'sklearn'
📝 Using fallback logic for verdicts
🤖 AI Model: Using Fallback Logic
```

### In Frontend

Check the Dashboard status indicator:

- 🟢 **"🤖 AI Model Active"** = Using ML model
- 🟡 **"📝 Fallback Mode"** = Using rule-based logic

### In Verdict Response

```json
{
  "winner": "Defendant",
  "reasoning": "...",
  "confidence": "high",
  "model": "AI Judge ML Model"  ← Check this field
}
```

---

## 🐛 Troubleshooting

### Issue 1: "No module named 'sklearn'"

**Solution:**

```bash
pip install scikit-learn
```

### Issue 2: "FileNotFoundError: judge_model.pkl"

**Solution:**

```bash
cd "Code Vibers\Backend"
python model/train_model.py
```

### Issue 3: Model loads but gives poor predictions

**Solution:** Retrain with more data

1. Add more cases to `data/ai_judge_dataset_clean.csv`
2. Run `python model/train_model.py`

### Issue 4: Import errors

**Solution:**

```bash
pip install pandas scikit-learn
```

---

## 📈 Improve Your AI Model

### 1. Add More Training Data

Edit `Backend/model/train_model.py`:

```python
data = [
    {
        "plaintiff": "Your case 1 plaintiff statement",
        "defendant": "Your case 1 defendant statement",
        "evidence": "Evidence details",
        "verdict": "Plaintiff"  # or Defendant, Neutral
    },
    # Add 50-100+ more cases for better accuracy
]
```

### 2. Use CSV Dataset

Load from your existing CSV:

```python
df = pd.read_csv("../data/ai_judge_dataset_clean.csv")
```

### 3. Try Different Models

Replace Logistic Regression with:

```python
# Random Forest
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(n_estimators=100)

# OR Support Vector Machine
from sklearn.svm import SVC
model = SVC(kernel='linear')
```

---

## ✅ Quick Verification Checklist

Run these checks:

```bash
# 1. Check Python packages
pip list | findstr scikit-learn

# 2. Check model files exist
dir "Code Vibers\Backend\model\models"

# 3. Test model import
cd "Code Vibers\Backend"
python -c "from model.ai_judge import ml_predict_verdict; print('✅ Model works!')"

# 4. Start backend and check output
python app.py
```

**Expected Results:**

- ✅ scikit-learn installed
- ✅ judge_model.pkl exists
- ✅ vectorizer.pkl exists
- ✅ Model import succeeds
- ✅ Backend shows "AI Judge model loaded successfully!"

---

## 🎯 Current Status Summary

Based on your files:

| Component | Status | Location |
|-----------|--------|----------|
| **ML Model** | ✅ EXISTS | `model/models/judge_model.pkl` |
| **Vectorizer** | ✅ EXISTS | `model/models/vectorizer.pkl` |
| **AI Logic** | ✅ EXISTS | `model/ai_judge.py` |
| **Training Script** | ✅ EXISTS | `model/train_model.py` |
| **Training Data** | ✅ EXISTS | `data/ai_judge_dataset_clean.csv` |

**Your AI model is ready! Just make sure scikit-learn is installed.**

---

## 🚀 Next Steps

1. **Install scikit-learn** (if not already):
   ```bash
   pip install scikit-learn pandas
   ```

2. **Start backend** and check for AI model message:
   ```bash
   python app.py
   ```

3. **Test with a case** via frontend or API

4. **Optional:** Retrain with more data for better accuracy

---

**Your AI model is set up and ready to use!** 🎉
