# 📄 AppConvert – Document Scanner & Converter (React Native)

AppConvert is a mobile application built with **React Native (CLI)** that allows users to **scan documents, perform OCR, merge PDFs, convert files, and summarize text using AI**.  
The app is designed to work **offline-first where possible** and supports multiple document workflows on mobile devices.

---

## ✨ Features

- 📷 **Scan documents** using the device camera
- 🔍 **OCR (Optical Character Recognition)** for images and scanned documents
- 📄 **Merge multiple PDF files** into a single document
- 🖼️ **Convert PDF pages to images**
- 📝 **Export OCR results to DOCX**
- 🧠 **AI text summarization**
- 🕘 **History management** for processed files
- 📤 **Share and download files**
- ⚡ Optimized for mobile performance

---

## 🧱 Tech Stack

- **React Native (CLI)**
- **Expo (Bare / Modules usage)**
- **TypeScript**
- **React Navigation**
- **ML Kit OCR**
- **PDF & DOCX processing**
- **Axios for API requests**

---

## 📁 Project Structure

```text
src
 ┣ components
 ┃ ┣ docx
 ┃ ┃ ┗ downloadDocFile.ts
 ┃ ┣ ocr
 ┃ ┃ ┣ exportDocx.ts
 ┃ ┃ ┗ OcrResultModal.tsx
 ┃ ┣ pdf
 ┃ ┃ ┣ MergePDF.ts
 ┃ ┃ ┣ PdfPreview.tsx
 ┃ ┃ ┗ PdfResultModal.tsx
 ┃ ┣ summary
 ┃ ┃ ┗ SummaryResultModal.tsx
 ┃ ┣ DowloadFile.tsx
 ┃ ┣ FilePicker.tsx
 ┃ ┣ HeaderBack.tsx
 ┃ ┣ HelpModal.tsx
 ┃ ┣ IconImage.tsx
 ┃ ┣ ItemFile.tsx
 ┃ ┗ LoadingModal.tsx
 ┣ navigation
 ┃ ┗ StackNavigator.tsx
 ┣ screens
 ┃ ┣ BasicOcrScreen.tsx
 ┃ ┣ HistoryScreen.tsx
 ┃ ┣ HomeScreen.tsx
 ┃ ┣ MergePdfScreen.tsx
 ┃ ┣ PdfToImageScreen.tsx
 ┃ ┣ ScanDocumentScreen.tsx
 ┃ ┣ SettingScreen.tsx
 ┃ ┗ SummaryScreen.tsx
 ┣ style
 ┃ ┗ style.css
 ┗ utils
 ┃ ┣ ai
 ┃ ┃ ┗ summarizeText.ts
 ┃ ┣ extract
 ┃ ┃ ┣ extractDocxText.ts
 ┃ ┃ ┗ readTextFile.ts
 ┃ ┣ history
 ┃ ┃ ┣ historyCleanup.ts
 ┃ ┃ ┗ historyManager.ts
 ┃ ┣ validate
 ┃ ┃ ┗ validatePdf.ts
 ┃ ┣ constants.ts
 ┃ ┣ env.d.ts
 ┃ ┣ ocrImageOffline.ts
 ┃ ┗ prepareImageForOCR.ts
📦 Main Dependencies
Core
react

react-native

expo

expo-file-system

expo-asset

Navigation
@react-navigation/native

@react-navigation/native-stack

@react-navigation/bottom-tabs

OCR & Scanning
rn-mlkit-ocr

react-native-document-scanner-plugin

PDF & DOCX
pdf-lib

react-native-pdf

react-native-pdf-to-image

react-native-pdf-from-image

react-native-pdf-renderer

docx

jszip

Utilities
axios

@react-native-async-storage/async-storage

react-native-share

react-native-blob-util

react-native-fs

react-native-permissions

react-native-paper

🚀 Getting Started
1️⃣ Install dependencies
bash
Sao chép mã
npm install
2️⃣ Run Metro
bash
Sao chép mã
npx react-native start
3️⃣ Run on Android
bash
Sao chép mã
npx react-native run-android
4️⃣ Run with Expo (for Expo Go testing)
bash
Sao chép mã
npx expo start
🔐 Environment Variables
Create a .env file:

env
Sao chép mã
HF_API_URL=your_api_url
HF_TOKEN=your_api_token
🧪 Supported Platforms
✅ Android (APK / AAB)

✅ iOS (Expo Go / TestFlight via EAS)

❌ Web (not supported)

📌 Notes
Some features (OCR, scanning) require camera permissions

iOS builds are handled via EAS Build (no Mac required)

PDF and OCR processing is optimized for mobile memory limits

📄 License
MIT License

Feel free to contribute or open an issue!