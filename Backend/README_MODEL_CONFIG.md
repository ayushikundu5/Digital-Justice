# 🧠 AI Model Configuration Guide

## RAM Issues & Solutions

If you're experiencing slow model loading or crashes, this is likely due to RAM constraints.

### Current Issue:

- **Phi-3 Mini** model is ~7.6GB in size
- Loading on CPU is much slower than GPU
- Flask debug mode loads the model **twice** (causing double the wait time)

## ✅ Solutions Implemented

### 1. **Debug Mode Disabled**

- Changed `debug=True` to `debug=False` in `app.py`
- This prevents Flask from reloading and loading the model twice
- **Saves ~5 minutes of loading time**

### 2. **Switched to TinyLlama (Default)**

- New default model: `TinyLlama/TinyLlama-1.1B-Chat-v1.0`
- Only **~1.1GB** vs 7.6GB (Phi-3)
- Much faster loading (10-20 seconds vs 2-3 minutes)
- Still provides good quality reasoning

## 🎛️ Model Options

### Option A: TinyLlama (Recommended for low RAM)

```python
# In model/gen_ai_reasoner.py (DEFAULT)
genai = LocalGenAIReasoner(
    model_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    use_quantization=False
)
```

- **RAM Required:** ~2GB
- **Load Time:** 10-20 seconds
- **Quality:** Good for most cases

### Option B: Phi-3 Mini (Better quality, needs more RAM)

```python
# In model/gen_ai_reasoner.py
genai = LocalGenAIReasoner(
    model_name="microsoft/phi-3-mini-4k-instruct",
    use_quantization=False
)
```

- **RAM Required:** ~8-10GB
- **Load Time:** 2-3 minutes (CPU)
- **Quality:** Excellent

### Option C: Disable Local AI (Fastest)

If you don't need local AI reasoning, you can comment out the model loading in `app.py`:

```python
# Comment out these lines in app.py:
# try:
#     from model.gen_ai_reasoner import LocalGenAIReasoner
#     genai = LocalGenAIReasoner()
#     print("🧠 Local GenAI Reasoner loaded successfully!")
# except Exception as e:
#     genai = None
#     print(f"⚠️  Local GenAI Reasoner not available: {e}")
```

## 🚀 Performance Comparison

| Model | Size | CPU Load Time | RAM Usage | Quality |
|-------|------|--------------|-----------|---------|
| TinyLlama | 1.1B | 10-20s | ~2GB | Good |
| Phi-3 Mini | 3.8B | 2-3min | ~8GB | Excellent |
| No Model | 0 | 0s | 0GB | Fallback only |

## 💡 Tips

1. **Use TinyLlama** if you have <8GB RAM available
2. **Disable debug mode** in production (already done)
3. **Add more RAM** if you want to use Phi-3 Mini
4. **Use GPU** if available - 10-20x faster loading
5. **Close other apps** before starting the server

## 🔧 Checking Your RAM

**Windows:**

```powershell
systeminfo | findstr /C:"Available Physical Memory"
```

**Recommended Minimum:**

- TinyLlama: 4GB total RAM
- Phi-3 Mini: 12GB total RAM

## 🐛 Troubleshooting

### Model loads but takes forever:

- You're likely swapping to disk due to low RAM
- Solution: Use TinyLlama or disable local AI

### Out of memory errors:

- Close other applications
- Use TinyLlama instead of Phi-3
- Disable local AI model

### Still too slow:

- The model is running on CPU (no GPU detected)
- Consider using a GPU if available
- Or disable local AI and rely on fallback logic
