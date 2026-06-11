# Listening to Echoes - Deployment Guide

This project is a Next.js 15 application integrated with Firebase and Genkit. You can deploy it to **Vercel** or **Firebase App Hosting**.

## Getting Your Code to GitHub

1. **Create a Repository**: Go to [GitHub](https://github.com/new) and create a new repository. Do **not** initialize it with a README or .gitignore (we have those).
2. **Copy the URL**: Copy the repository URL (e.g., `https://github.com/your-username/listening-to-echoes.git`).
3. **Run these commands in your terminal**:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Educational Experience Archive"

# Set the main branch
git branch -M main

# Add your GitHub repository as the remote
git remote add origin <YOUR_GITHUB_URL>

# Push the code
git push -u origin main
```

## Deploying to Vercel

1. **Connect to Vercel**: Go to [Vercel Dashboard](https://vercel.com/new).
2. **Import Repository**: Select the GitHub repository you just pushed.
3. **Configure Environment Variables**: Add the following keys from your `.env` or Firebase console:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_AUDIO_BUCKET_ID`
   - `GOOGLE_GENAI_API_KEY`
4. **Deploy**: Click "Deploy".

## Deploying to Firebase App Hosting (Recommended)

1. **Connect your repository** in the [Firebase Console](https://console.firebase.google.com/) under "App Hosting".
2. **Setup**: Firebase will automatically detect the Next.js framework and use the `apphosting.yaml` configuration.

## Local Development

```bash
npm install
npm run dev
```
