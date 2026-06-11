# Listening to Echoes - Deployment Guide

This project is a Next.js 15 application integrated with Firebase and Genkit. You can deploy it to **Vercel** or **Firebase App Hosting**.

## Getting Your Code to GitHub

1. **Create a Repository**: You have already created one at `https://github.com/davidraghanti/Listening-to-Echoes.git`.
2. **Run these commands in your terminal**:

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
git remote add origin https://github.com/davidraghanti/Listening-to-Echoes.git

# Push the code
git push -u origin main
```

## Deploying to Vercel

1. **Connect to Vercel**: Go to [Vercel Dashboard](https://vercel.com/new).
2. **Import Repository**: Select the `Listening-to-Echoes` repository you just pushed.
3. **Configure Environment Variables**: Add the following keys from your Firebase console:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_AUDIO_BUCKET_ID` (Use `0e61b06faeaf`)
   - `GOOGLE_GENAI_API_KEY` (Your Gemini API Key)
4. **Deploy**: Click "Deploy".

## Local Development

```bash
npm install
npm run dev
```
