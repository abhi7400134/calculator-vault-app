# 🔐 Calculator Vault App

A secret photo vault disguised as a fully functional calculator. Hide your private photos behind a working calculator interface with advanced security features.

## ✨ Features

### 🧮 Dual Functionality
- **Working Calculator**: Fully functional calculator interface
- **Secret Vault**: Hidden photo storage accessible via secret PIN

### 🔒 Security Features
- PIN/Password protection
- Fingerprint/biometric authentication
- Fake calculator mode (looks like normal calculator)
- Decoy password (shows fake photos with wrong PIN)
- Auto-lock after inactivity
- Intruder detection with photo capture

### 📸 Photo Management
- Hide/unhide photos
- Create albums and organize photos
- Delete photos securely
- Import from gallery
- Export photos back to gallery
- Photo viewer with zoom and swipe

### ☁️ Cloud Backup
- Automatic cloud sync
- Restore photos on new device
- Encrypted cloud storage

### 🎨 UI/UX
- Clean, modern calculator interface
- Smooth animations
- Dark/Light theme support
- Intuitive navigation

## 🚀 Tech Stack

- **React Native** - Cross-platform (Android & iOS)
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **AsyncStorage** - Local storage
- **React Native Biometrics** - Fingerprint auth
- **React Native Image Picker** - Photo selection
- **React Native FS** - File system access
- **Firebase** - Cloud backup (optional)

## 📱 Installation

### Prerequisites
- Node.js (v16+)
- React Native CLI
- Android Studio / Xcode
- Java JDK 11+

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/abhi7400134/calculator-vault-app.git
cd calculator-vault-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Install iOS dependencies** (Mac only)
```bash
cd ios && pod install && cd ..
```

4. **Configure Firebase** (for cloud backup)
- Create Firebase project
- Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
- Place in respective folders

5. **Run the app**

**Android:**
```bash
npm run android
# or
yarn android
```

**iOS:**
```bash
npm run ios
# or
yarn ios
```

## 🔧 Configuration

### Secret PIN Access
Default access pattern: Enter any calculation, then press `=` followed by your secret PIN and `=` again.

Example: `5+5=1234=` (where 1234 is your PIN)

### First Time Setup
1. Open app (shows calculator)
2. Enter setup mode: `0000=`
3. Set your master PIN
4. Set decoy PIN (optional)
5. Enable biometric authentication (optional)

## 📖 Usage Guide

### Hiding Photos
1. Access vault with secret PIN
2. Tap "+" button
3. Select photos from gallery
4. Photos are encrypted and hidden

### Creating Albums
1. In vault, tap "Albums"
2. Create new album
3. Move photos to albums

### Decoy Mode
- Set a decoy PIN in settings
- When someone enters decoy PIN, they see fake photos
- Real photos remain hidden

### Cloud Backup
1. Enable in settings
2. Sign in with Google/Apple
3. Photos automatically sync
4. Restore on any device

## 🏗️ Project Structure

```
calculator-vault-app/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Calculator.tsx
│   │   ├── PhotoGrid.tsx
│   │   └── PINInput.tsx
│   ├── screens/          # App screens
│   │   ├── CalculatorScreen.tsx
│   │   ├── VaultScreen.tsx
│   │   ├── AlbumsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/       # Navigation setup
│   ├── services/         # Business logic
│   │   ├── AuthService.ts
│   │   ├── StorageService.ts
│   │   ├── EncryptionService.ts
│   │   └── CloudService.ts
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
├── android/             # Android native code
├── ios/                # iOS native code
└── assets/             # Images, fonts, etc.
```

## 🔐 Security Features Explained

### Encryption
- AES-256 encryption for photos
- Secure key storage using Keychain (iOS) / Keystore (Android)
- Encrypted file names

### Biometric Authentication
- Fingerprint support
- Face ID support (iOS)
- Fallback to PIN

### Intruder Detection
- Captures photo on wrong PIN attempts
- Logs failed access attempts
- Email alerts (optional)

## 🎯 Roadmap

- [ ] Video support
- [ ] Document hiding
- [ ] Fake crash screen
- [ ] Remote wipe
- [ ] Multiple vaults
- [ ] Break-in alerts
- [ ] Stealth mode icon

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## ⚠️ Disclaimer

This app is for educational purposes. Use responsibly and respect privacy laws in your jurisdiction.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ for privacy-conscious users**
