
# Listening to Echoes - Deployment Guide

This project is a Next.js 15 application integrated with Firebase and Genkit.

## 🚀 Getting Your Code to GitHub

1. **Create a Repository**: Ensure it is created at `https://github.com/davidraghanti/Listening-to-Echoes.git`.
2. **Run these commands in your terminal**:

```bash
git init
git add .
git commit -m "Initial commit: Educational Experience Archive"
git branch -M main
git remote add origin https://github.com/davidraghanti/Listening-to-Echoes.git
git push -u origin main
```

## 🌐 Option 1: Deploying to Vercel (Recommended)

1. **Connect to Vercel**: Go to [Vercel Dashboard](https://vercel.com/new).
2. **Import Repository**: Select `Listening-to-Echoes`.
3. **CRITICAL: Configure Environment Variables**: 
   In Vercel, go to **Settings > Environment Variables** and add the following keys from your Firebase project (found in Project Settings > General):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_AUDIO_BUCKET_ID` (set this to `0e61b06faeaf`)

## 🔑 Fixing Google Sign-In (Popup Closing)

If the Google Sign-in popup opens and closes instantly or reports an "Invalid API Key":

1. **Verify Vercel Env Vars**: Double-check that `NEXT_PUBLIC_FIREBASE_API_KEY` in Vercel matches exactly the one in your Firebase Console.
2. **Whitelist your Domain**: 
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Navigate to **Authentication > Settings > Authorized domains**.
   - Add your Vercel deployment URL (e.g., `listening-to-echoes.vercel.app`).
3. **Enable Provider**:
   - In **Authentication > Sign-in method**, ensure **Google** is enabled.

## 📂 Firestore Setup
1. **Enable Firestore**: In the Firebase Console, create a database in "Production Mode".
2. **Rules**: The security rules are already in `firestore.rules`.
3. **Indexes**: If the Librarian queue is empty, check the browser console (`F12`) for a link to generate the required composite index.
