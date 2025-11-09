#!/usr/bin/env python3
"""
Quick test script to verify the backend server is working
Run this after starting the server to test all endpoints
"""

import requests
import json
import sys

# Test against local server by default
BASE_URL = "http://localhost:5000"

def test_health():
    """Test the health endpoint"""
    print("\n🏥 Testing /health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed!")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_home():
    """Test the home endpoint"""
    print("\n🏠 Testing / endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Home endpoint passed!")
            data = response.json()
            print(f"   Status: {data.get('status')}")
            print(f"   Version: {data.get('version')}")
            print(f"   AI Model: {data.get('ai_model_available')}")
            print(f"   GenAI: {data.get('genai_available')}")
            return True
        else:
            print(f"❌ Home endpoint failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Home endpoint error: {e}")
        return False

def test_verdict():
    """Test the verdict endpoint"""
    print("\n⚖️  Testing /verdict endpoint...")
    
    test_case = {
        "plaintiff": "I paid for a product but never received it. I have proof of payment.",
        "defendant": "We shipped the product on time with tracking number. It shows delivered.",
        "evidence": "Tracking confirms delivery to the correct address on the expected date."
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/verdict",
            json=test_case,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Verdict endpoint passed!")
            data = response.json()
            print(f"   Winner: {data.get('winner')}")
            print(f"   Model: {data.get('model')}")
            print(f"   Confidence: {data.get('confidence')}")
            return True
        else:
            print(f"❌ Verdict endpoint failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Verdict endpoint error: {e}")
        return False

def test_genai_reason():
    """Test the GenAI reasoning endpoint"""
    print("\n🧠 Testing /api/genai_reason endpoint...")
    
    test_data = {
        "plaintiff": "I paid for a product but never received it.",
        "defendant": "We shipped the product on time.",
        "evidence": "Tracking confirms delivery.",
        "verdict": "Defendant"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/genai_reason",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ GenAI reasoning endpoint passed!")
            data = response.json()
            print(f"   Model: {data.get('model')}")
            reasoning = data.get('reasoning', '')
            print(f"   Reasoning length: {len(reasoning)} characters")
            print(f"   First 100 chars: {reasoning[:100]}...")
            return True
        else:
            print(f"❌ GenAI reasoning endpoint failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ GenAI reasoning endpoint error: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("🧪 AI Court Backend - API Test Suite")
    print("=" * 60)
    print(f"📍 Testing server at: {BASE_URL}")
    print(f"💡 Make sure the server is running first!")
    print("=" * 60)
    
    results = []
    
    # Run all tests
    results.append(("Health Check", test_health()))
    results.append(("Home Endpoint", test_home()))
    results.append(("Verdict Endpoint", test_verdict()))
    results.append(("GenAI Reasoning", test_genai_reason()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print("=" * 60)
    print(f"Total: {passed} passed, {failed} failed out of {len(results)} tests")
    print("=" * 60)
    
    if failed == 0:
        print("\n🎉 All tests passed! Backend is ready for deployment!")
        return 0
    else:
        print(f"\n⚠️  {failed} test(s) failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    # Allow custom URL via command line argument
    if len(sys.argv) > 1:
        BASE_URL = sys.argv[1]
        print(f"Using custom URL: {BASE_URL}")
    
    sys.exit(main())
