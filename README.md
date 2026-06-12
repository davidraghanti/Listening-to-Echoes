
# Listening to Echoes - Deployment Guide

This project is a Next.js 15 application integrated with Firebase. It uses a custom 10-digit access code system for internal management.

## 🔑 Initial Setup: Unlocking the Dashboard

Since the system uses Firestore to verify access codes, you must manually add your first code to the database to get started.

### 1. Enable Anonymous Auth (REQUIRED)
1. Go to the **Firebase Console**.
2. Navigate to **Authentication > Sign-in method**.
3. Click "Add new provider" and select **Anonymous**. 
4. Click **Enable** and save. (The app will fail without this).

### 2. Create the Access Code in Firestore
1. Navigate to **Firestore Database** in the console.
2. Click **Start collection** and name it `access_codes`.
3. **CRITICAL**: For the "Document ID", do **NOT** click "Auto-ID". Type your 10-digit code exactly: `3305021271`.
4. Add a field:
    *   **Field Name**: `role`
    *   **Type**: `string`
    *   **Value**: `librarian`
5. Add another field (optional):
    *   **Field Name**: `label`
    *   **Type**: `string`
    *   **Value**: `Master Access`
6. Save the document.

### 3. Configure Vercel Environment Variables
In your Vercel project settings, add the following keys from your Firebase Project Settings:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_AUDIO_BUCKET_ID` (Default: `0e61b06faeaf`)

## 🚀 Getting Your Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Educational Experience Archive"
git branch -M main
git remote add origin https://github.com/davidraghanti/Listening-to-Echoes.git
git push -u origin main
```

## 📂 Firestore Security & Indexes
1. **Enable Firestore**: Create database in "Production Mode".
2. **Rules**: Security rules are automatically handled by the repository.
3. **Indexes**: The Librarian queue requires a composite index. Check the browser console (`F12`) on the `/librarian` page for a link to generate it if the queue doesn't load.
