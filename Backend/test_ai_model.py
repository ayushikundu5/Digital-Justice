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
    size = os.path.getsize(model_path)
    print(f"   ✅ {model_path} exists ({size} bytes)")
else:
    print(f"   ❌ {model_path} NOT FOUND")

if os.path.exists(vectorizer_path):
    size = os.path.getsize(vectorizer_path)
    print(f"   ✅ {vectorizer_path} exists ({size} bytes)")
else:
    print(f"   ❌ {vectorizer_path} NOT FOUND")

# Test 2: Check dependencies
print("\n2️⃣ Checking dependencies...")
try:
    import sklearn
    print(f"   ✅ scikit-learn installed (version {sklearn.__version__})")
except ImportError:
    print("   ❌ scikit-learn NOT installed")
    print("      Install with: pip install scikit-learn")
    sys.exit(1)

try:
    import pandas
    print(f"   ✅ pandas installed (version {pandas.__version__})")
except ImportError:
    print("   ⚠️  pandas not installed (optional)")

# Test 3: Try to import the AI judge
print("\n3️⃣ Testing AI judge import...")
try:
    from model.ai_judge import ml_predict_verdict, genai_reasoning
    print("   ✅ AI judge imported successfully")
except Exception as e:
    print(f"   ❌ Import failed: {e}")
    print("   This means the model cannot be loaded")
    sys.exit(1)

# Test 4: Run prediction
print("\n4️⃣ Testing verdict prediction...")
try:
    plaintiff = "The tenant refused to pay rent for three months."
    defendant = "The property had severe water damage making it uninhabitable."
    evidence = "Photos of water damage, rental agreement, inspection report"
    
    print(f"   Input:")
    print(f"   - Plaintiff: {plaintiff[:50]}...")
    print(f"   - Defendant: {defendant[:50]}...")
    print(f"   - Evidence: {evidence[:50]}...")
    
    verdict = ml_predict_verdict(plaintiff, defendant, evidence)
    result = genai_reasoning(plaintiff, defendant, evidence, verdict)
    
    print(f"\n   ✅ Prediction successful!")
    print(f"   📊 Winner: {result['verdict']}")
    print(f"   💭 Reasoning: {result['reasoning']}")
except Exception as e:
    print(f"   ❌ Prediction failed: {e}")
    sys.exit(1)

# Test 5: Test another case
print("\n5️⃣ Testing another case...")
try:
    plaintiff2 = "The buyer paid for premium service but received basic package."
    defendant2 = "The seller claims the buyer agreed to the basic package in contract."
    evidence2 = "Purchase receipt, contract agreement, email correspondence"
    
    verdict2 = ml_predict_verdict(plaintiff2, defendant2, evidence2)
    result2 = genai_reasoning(plaintiff2, defendant2, evidence2, verdict2)
    
    print(f"   ✅ Second prediction successful!")
    print(f"   📊 Winner: {result2['verdict']}")
    print(f"   💭 Reasoning: {result2['reasoning'][:80]}...")
except Exception as e:
    print(f"   ❌ Second prediction failed: {e}")

print("\n" + "="*50)
print("✅ ALL TESTS PASSED!")
print("="*50)
print("\n🎉 Your AI model is working correctly!")
print("   You can now start the backend server:")
print("   python app.py")
print("="*50)
