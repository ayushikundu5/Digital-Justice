# AI Court Android APK - Build Complete ✅

## 🎉 APK Successfully Built!

Your AI Court app has been compiled into a downloadable Android APK file.

## 📍 APK Location

The APK file is located at:

```
Frontend/ai_court_app/build/app/outputs/flutter-apk/app-release.apk
```

**Full Path:**

```
C:/Users/SOUVIK/Desktop/Code Vibers/Code Vibers/Code Vibers/Code Vibers/Code Vibers/Frontend/ai_court_app/build/app/outputs/flutter-apk/app-release.apk
```

## 📦 APK Details

- **File Name**: `app-release.apk`
- **File Size**: 46.1 MB
- **Build Type**: Release (optimized for distribution)
- **Architecture**: Universal (works on all Android devices)
- **Minimum Android Version**: Android 5.0 (API 21) or higher

## 📱 How to Install

### Option 1: Direct Installation on Your Phone

1. **Copy APK to Your Phone**:
    - Connect your phone via USB
    - Copy `app-release.apk` to your phone's Downloads folder
    - Or use Google Drive, WhatsApp, etc. to transfer

2. **Enable Installation from Unknown Sources**:
    - Go to **Settings** → **Security**
    - Enable **"Install from unknown sources"** or **"Install unknown apps"**
    - (On Android 8+: Enable for the specific app you're using to install)

3. **Install the APK**:
    - Open your phone's **File Manager** or **Downloads** app
    - Tap on `app-release.apk`
    - Tap **"Install"**
    - Wait for installation to complete
    - Tap **"Open"** to launch the app

### Option 2: Using ADB (Android Debug Bridge)

If you have ADB installed:

```bash
adb install "Frontend/ai_court_app/build/app/outputs/flutter-apk/app-release.apk"
```

### Option 3: Share via Email/Cloud

1. Upload the APK to:
    - Google Drive
    - Dropbox
    - OneDrive
    - Email it to yourself

2. Download on your phone
3. Install as described in Option 1

## 🎯 App Features

This APK includes all features:

- ✅ Login/Authentication
- ✅ Dashboard with statistics
- ✅ Cases management (create, view, list)
- ✅ AI-powered verdicts (connects to backend)
- ✅ Debate feature (start, join rooms)
- ✅ Dark mode toggle
- ✅ Local data persistence
- ✅ Beautiful Material Design 3 UI

## 🔧 Backend Connection

### Important for Production Use

The APK is currently configured to connect to:

```
http://10.0.2.2:5000
```

This works for **Android emulator only**. For real devices, you need to:

1. **Host your backend on a server** (e.g., Heroku, AWS, DigitalOcean)
2. **Update the API URL** in the code before building:
    - Edit: `Frontend/ai_court_app/lib/services/api_service.dart`
    - Change: `static const String baseUrl = 'http://YOUR_SERVER_IP:5000';`
    - Rebuild the APK

### For Local Testing on Physical Device

If you want to test with your local backend:

1. Find your computer's local IP address:
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. Look for IPv4 address (e.g., `192.168.1.100`)

3. Update API URL to:
   ```dart
   static const String baseUrl = 'http://192.168.1.100:5000';
   ```

4. Rebuild APK:
   ```bash
   flutter build apk --release
   ```

5. Make sure your phone and computer are on the same Wi-Fi network

## 🔐 App Signing

This is a **debug-signed APK** suitable for:

- ✅ Personal use
- ✅ Testing
- ✅ Development
- ✅ Internal distribution

**Not suitable for:**

- ❌ Google Play Store (requires release signing)
- ❌ Production deployment (needs proper keystore)

### For Play Store Release

To publish on Google Play Store, you need to:

1. **Create a keystore**:
   ```bash
   keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
   ```

2. **Configure signing** in `android/app/build.gradle`

3. **Build signed APK**:
   ```bash
   flutter build apk --release
   ```

4. **Upload to Play Console**

## 📊 Build Optimization

The APK has been optimized with:

- ✅ **Tree-shaking**: Reduced MaterialIcons from 1.6MB to 4.5KB (99.7% reduction)
- ✅ **Code minification**: Removed unused code
- ✅ **Resource optimization**: Compressed assets
- ✅ **Release mode**: Maximum performance

## 🎨 App Icon & Name

### Current Settings

- **App Name**: "ai_court_app"
- **Icon**: Default Flutter icon

### To Customize (Before Rebuilding)

1. **Change App Name**:
    - Edit: `android/app/src/main/AndroidManifest.xml`
    - Change: `android:label="AI Court"`

2. **Change App Icon**:
    - Replace icon files in `android/app/src/main/res/mipmap-*/`
    - Or use `flutter_launcher_icons` package

3. **Rebuild**:
   ```bash
   flutter build apk --release
   ```

## 📱 Testing Checklist

After installing, test:

- [ ] App opens successfully
- [ ] Login screen displays correctly
- [ ] Can toggle dark mode
- [ ] Dashboard shows properly
- [ ] Can navigate between screens
- [ ] Backend connection (if configured)
- [ ] Create case works (with backend)
- [ ] Debate feature accessible
- [ ] App icon appears in launcher
- [ ] No crashes or errors

## 🌐 Distribution Options

### Free Distribution

- **Google Drive**: Upload and share link
- **Dropbox**: Share APK file
- **GitHub Releases**: Create a release with APK
- **Direct Download**: Host on your website

### Paid Distribution

- **Google Play Store**: Official store ($25 one-time fee)
- **Amazon Appstore**: Alternative store
- **Samsung Galaxy Store**: For Samsung devices

## 🔄 Updating the App

To release an update:

1. **Update version** in `pubspec.yaml`:
   ```yaml
   version: 1.1.0+2  # Increment version
   ```

2. **Rebuild APK**:
   ```bash
   flutter build apk --release
   ```

3. **Distribute new APK** to users

## 📝 Version Info

- **Version**: 1.0.0+1
- **Build Date**: November 9, 2025
- **Flutter Version**: 3.35.3
- **Dart Version**: 3.9.2
- **Android SDK**: Minimum API 21 (Android 5.0)

## ✅ Success!

Your AI Court app is now ready to install on any Android device!

The APK file is at:

```
Frontend/ai_court_app/build/app/outputs/flutter-apk/app-release.apk
```

**Just transfer it to your phone and install!** 📱✨

---

## 🆘 Troubleshooting

### "App not installed" error

- Enable "Install from unknown sources"
- Check if you have enough storage space
- Try uninstalling any previous version first

### "Parse error"

- APK file might be corrupted during transfer
- Re-copy the APK file
- Try a different transfer method

### Backend connection fails

- Check the API URL in the code
- Ensure backend is accessible from your phone
- Phone and backend must be on same network (for local testing)

### App crashes on startup

- Check Android version (minimum 5.0)
- Clear app data and cache
- Reinstall the app

---

**Need help?** Check the full documentation or rebuild with different settings.
