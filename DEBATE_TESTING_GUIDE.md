# Debate Feature Testing Guide 🧪

## How to Test 2-Player Debate

Since localStorage is browser-specific, here are the best ways to test the debate feature:

---

## ✅ **Method 1: Two Different Browsers** (RECOMMENDED)

### **Person A (Chrome):**

```
1. Open Chrome
2. Go to http://localhost:5173
3. Click "Live Debate" → "Start a Debate"
4. Create debate, get code (e.g., 482916)
5. Enter the debate room
6. Submit your argument
```

### **Person B (Firefox/Edge):**

```
1. Open Firefox or Edge
2. Go to http://localhost:5173
3. Click "Live Debate" → "Join a Debate"
4. Enter code: 482916
5. Join the room
6. Submit your argument
7. ✅ AI verdict appears for both!
```

---

## ✅ **Method 2: Two Devices**

### **Device 1 (Your Computer):**

- Create debate
- Share code via text/WhatsApp

### **Device 2 (Phone/Tablet):**

- Join with code
- Submit argument
- Both see verdict!

---

## ✅ **Method 3: Same Browser, Two Users** (DEMO MODE)

Since localStorage is shared in the same browser, you can simulate both users:

### **Step 1: Create Debate**

```
1. Go to /debate/start
2. Create debate as Plaintiff
3. Get code: 482916
4. Note the code
```

### **Step 2: Join as Opponent**

```
1. Go to /debate/join
2. Enter code: 482916
3. Select Defendant role
4. You're now the second player!
```

### **Step 3: Submit Arguments**

```
1. Open room in tab 1 as Plaintiff
2. Open SAME room in tab 2 as Defendant
3. Submit from tab 1
4. Submit from tab 2
5. ✅ Verdict appears in both tabs!
```

---

## ❌ **Why Incognito Doesn't Work**

**localStorage is separate between:**

- Normal window ↔ Incognito window
- Different browsers
- Different profiles

**Solution:** Use Method 1 or 2 above.

---

## 🔧 **Technical Explanation**

The debate system uses:

1. **localStorage** for data persistence
2. **Shared keys** (`shared_debate_{code}`) for cross-tab communication
3. **Polling** (checks every 2 seconds for updates)

### **What This Means:**

- ✅ Works across tabs in SAME browser
- ✅ Works across different browsers
- ✅ Works across devices
- ❌ Does NOT work: Normal ↔ Incognito (same browser)

---

## 🚀 **Quick Test Script**

### **Browser 1: Chrome**

```bash
# Open Chrome
# Visit http://localhost:5173/debate/start
# Create: "Test Case 1"
# Note code: e.g., 482916
```

### **Browser 2: Firefox**

```bash
# Open Firefox  
# Visit http://localhost:5173/debate/join
# Enter: 482916
# Join room
```

### **Both Submit:**

```
1. Chrome: Submit plaintiff argument
2. Firefox: Submit defendant argument
3. ✅ Both see AI verdict!
```

---

## 💡 **Pro Tips**

### **For Real Testing:**

1. **Use two different browsers** (Chrome + Firefox)
2. **Or use two devices** (Computer + Phone)
3. **Both must be on http://localhost:5173**

### **For Demo/Presentation:**

1. Open two tabs in same browser
2. Tab 1: Be Plaintiff
3. Tab 2: Be Defendant
4. Submit from both
5. Shows how it works!

---

## 🎯 **Expected Behavior**

### **When Creating:**

```
✅ Room code generated (6 digits)
✅ Code is copyable
✅ Room saved to localStorage
✅ Accessible via code
```

### **When Joining:**

```
✅ Code validates (6 digits)
✅ Room found if exists
✅ Can choose role
✅ Can submit argument
```

### **When Both Submit:**

```
✅ Auto-triggers AI verdict
✅ Shows "Processing..." state
✅ Generates verdict in ~20-30s
✅ Displays winner, scores, reasoning
✅ Both users see same verdict
```

---

## 🐛 **Troubleshooting**

### **"Room not found" error:**

- Make sure code is correct (6 digits)
- Check that room was created first
- Try refreshing the create page

### **Verdict not generating:**

- Ensure backend is running (port 5000)
- Check that BOTH users submitted
- Wait up to 30 seconds
- Check browser console for errors

### **Updates not showing:**

- System polls every 2 seconds
- Wait a moment after submitting
- Refresh page if needed

---

## 📱 **Mobile Testing**

### **On Mobile Browser:**

```
1. Connect phone to same network
2. Find your computer's IP (e.g., 192.168.1.100)
3. Open mobile browser
4. Visit: http://192.168.1.100:5173
5. Use debate feature normally
```

---

## 🎊 **Summary**

**Best Testing Methods:**

1. **Two different browsers** ⭐⭐⭐⭐⭐
2. **Two devices** ⭐⭐⭐⭐⭐
3. **Two tabs same browser** ⭐⭐⭐⭐ (demo only)
4. **Normal + Incognito** ❌ (doesn't work)

**The system works perfectly when both users:**

- Access the same app (localhost:5173)
- Use the same room code
- Are in different browsers OR same browser (different tabs)

---

**Ready to test!** 🚀
