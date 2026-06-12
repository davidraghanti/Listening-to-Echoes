
# Listening to Echoes - Deployment Guide

This project is a Next.js 15 application integrated with Firebase and Genkit. It uses a custom 10-digit access code system for internal repository management.

## 🔑 Initial Setup: Unlocking the Librarian Dashboard

Since the system uses Firestore to verify access codes, you must manually add your first code to the database to get started.

1.  **Open Firebase Console**: Navigate to your project's **Firestore Database**.
2.  **Enable Anonymous Auth**: Go to **Authentication > Sign-in method** and enable **Anonymous**. (CRITICAL: The site will not log you in without this).
3.  **Create Collection**: Click "Start collection" and name it `access_codes`.
4.  **Add Document**:
    *   **Document ID**: `3305021271` (Your master code)
    *   **Field**: `role` (string) = `librarian`
    *   **Field**: `label` (string) = `Master Access`
5.  **Login**: Go to `/login` on your deployed site and enter `3305021271`.

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
   In Vercel, add the following keys from your Firebase project (Project Settings > General):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_AUDIO_BUCKET_ID` (set to `0e61b06faeaf`)

## 📂 Firestore Security & Indexes
1. **Enable Firestore**: Create database in "Production Mode".
2. **Rules**: Security rules are automatically handled by the repository.
3. **Indexes**: The Librarian queue requires a composite index. Check the browser console (`F12`) on the `/librarian` page for a link to generate it if the queue doesn't load.
