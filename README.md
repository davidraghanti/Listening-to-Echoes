
# Listening to Echoes - Deployment Guide

This project is a Next.js 15 application integrated with Firebase and Genkit. You can deploy it to **Vercel** or **Firebase**.

## Getting Your Code to GitHub

1. **Create a Repository**: You have already created one at `https://github.com/davidraghanti/Listening-to-Echoes.git`.
2. **Run these commands in your terminal**:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Educational Experience Archive"

# Set the main branch
git branch -M main

# Add your GitHub repository as the remote
git remote add origin https://github.com/davidraghanti/Listening-to-Echoes.git

# Push the code
git push -u origin main
```

## Option 1: Deploying to Vercel (Recommended for Next.js)

1. **Connect to Vercel**: Go to [Vercel Dashboard](https://vercel.com/new).
2. **Import Repository**: Select the `Listening-to-Echoes` repository.
3. **Configure Environment Variables**: Add your Firebase keys (found in `src/firebase/config.ts`) as Environment Variables in Vercel.
4. **Deploy**: Click "Deploy".

## Option 2: Deploying to Firebase Hosting

Since this is a Next.js app, we use the Firebase CLI's web framework support.

1. **Login to Firebase**:
   ```bash
   firebase login
   ```
2. **Enable Web Frameworks** (if not already enabled):
   ```bash
   firebase experiments:enable webframeworks
   ```
3. **Deploy**:
   ```bash
   firebase deploy
   ```

## Option 3: Firebase App Hosting (Automated)

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select **App Hosting** from the left menu.
3. Click **Get Started** and connect your GitHub repository.
4. Firebase will automatically build and deploy your app every time you push to `main`.

## Local Development

```bash
npm install
npm run dev
```
