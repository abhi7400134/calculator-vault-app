# 📱 Calculator Vault App - Complete Setup Guide

## 🎯 Quick Start (Hindi + English)

### Prerequisites / जरूरी चीजें

1. **Node.js** (v16 या उससे ऊपर)
   - Download: https://nodejs.org/
   
2. **Android Studio** (Android के लिए)
   - Download: https://developer.android.com/studio
   
3. **Xcode** (iOS के लिए - Mac only)
   - Mac App Store से install करें

4. **Git**
   - Download: https://git-scm.com/

---

## 📥 Step 1: Repository Clone करें

```bash
git clone https://github.com/abhi7400134/calculator-vault-app.git
cd calculator-vault-app
```

---

## 📦 Step 2: Dependencies Install करें

```bash
npm install
# या
yarn install
```

### iOS के लिए (Mac only):
```bash
cd ios
pod install
cd ..
```

---

## ⚙️ Step 3: Android Setup

### Android Studio में:

1. **Android Studio खोलें**
2. **SDK Manager** खोलें (Tools → SDK Manager)
3. ये install करें:
   - Android SDK Platform 33
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools

4. **Environment Variables** set करें:

**Windows:**
```
ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
```

**Mac/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### AVD (Android Virtual Device) बनाएं:

1. Android Studio में **AVD Manager** खोलें
2. **Create Virtual Device** पर click करें
3. कोई भी phone select करें (Pixel 5 recommended)
4. System Image: **Android 13 (API 33)** select करें
5. **Finish** पर click करें

---

## 🍎 Step 4: iOS Setup (Mac Only)

```bash
sudo gem install cocoapods
cd ios
pod install
cd ..
```

---

## 🚀 Step 5: App Run करें

### Android पर:

**Emulator start करें:**
1. Android Studio खोलें
2. AVD Manager से emulator start करें

**App run करें:**
```bash
npm run android
# या
yarn android
```

### iOS पर (Mac only):

```bash
npm run ios
# या
yarn ios
```

---

## 🔧 Troubleshooting / समस्याएं

### Problem 1: "SDK location not found"

**Solution:**
```bash
cd android
echo "sdk.dir = /Users/YOUR_USERNAME/Library/Android/sdk" > local.properties
# Windows: C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

### Problem 2: "Command not found: react-native"

**Solution:**
```bash
npm install -g react-native-cli
```

### Problem 3: Metro Bundler Error

**Solution:**
```bash
npm start -- --reset-cache
```

### Problem 4: Build Failed

**Solution:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

---

## 📱 App कैसे Use करें

### First Time Setup:

1. **App खोलें** - Calculator दिखेगा
2. **Secret Mode में जाएं:**
   - कोई भी calculation करें (जैसे: `5+5`)
   - `=` press करें
   - अपना **4-digit PIN** enter करें (जैसे: `1234`)
   - फिर से `=` press करें
3. **Master PIN Set करें** - Confirmation dialog आएगा
4. **Done!** अब आप vault access कर सकते हैं

### Vault Access करना:

**Pattern:** `[कोई calculation]=PIN=`

**Examples:**
- `5+5=1234=`
- `10-2=1234=`
- `7×8=1234=`

### Photos Add करना:

1. Vault में जाएं
2. ऊपर **+** button पर click करें
3. Gallery से photos select करें
4. Photos automatically encrypt होकर hide हो जाएंगे

### Photos Delete करना:

1. Photo पर **long press** करें
2. **Delete** icon पर tap करें
3. Confirm करें

### Photos Export करना:

1. Photo पर **long press** करें
2. **Download** icon पर tap करें
3. Photo gallery में save हो जाएगी

---

## 🔐 Security Features

### Master PIN:
- आपका main password
- Vault access के लिए

### Decoy PIN (Optional):
- Fake PIN
- Wrong PIN enter करने पर fake photos दिखाता है
- Setup: Settings → Set Decoy PIN

### Biometric (Fingerprint):
- Settings में enable करें
- Quick access के लिए

---

## 🎨 Customization

### Calculator Theme बदलना:

`src/components/Calculator.tsx` में:
```typescript
backgroundColor: '#000',  // Black
// बदलें:
backgroundColor: '#1a1a1a',  // Dark Gray
```

### PIN Length बदलना:

`src/services/AuthService.ts` में:
```typescript
if (secretPin.length >= 4)  // 4-digit
// बदलें:
if (secretPin.length >= 6)  // 6-digit
```

---

## 📊 Build APK (Android)

### Debug APK:
```bash
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK:

1. **Keystore बनाएं:**
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **android/gradle.properties** में add करें:
```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=****
MYAPP_RELEASE_KEY_PASSWORD=****
```

3. **Build करें:**
```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🍎 Build IPA (iOS)

1. Xcode में project खोलें
2. Signing & Capabilities में Apple Developer account add करें
3. Product → Archive
4. Distribute App

---

## 🔄 Updates & Maintenance

### Dependencies Update:
```bash
npm update
cd ios && pod update && cd ..
```

### Clear Cache:
```bash
npm start -- --reset-cache
```

### Clean Build:
```bash
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && xcodebuild clean && cd ..
```

---

## 📞 Support

**Issues:** https://github.com/abhi7400134/calculator-vault-app/issues

**Questions:** Open a discussion on GitHub

---

## ⚠️ Important Notes

1. **Backup:** PIN भूल गए तो data recover नहीं हो सकता
2. **Security:** Production में strong encryption keys use करें
3. **Testing:** Real device पर test करें
4. **Privacy:** User data को respect करें

---

## 🎉 You're All Set!

App successfully setup हो गया है! Enjoy your private vault! 🔐

**Star the repo** अगर helpful लगा: ⭐
