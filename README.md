# Listening to Echoes - Deployment Guide

This project is a Next.js 15 application integrated with Firebase and Genkit. You can deploy it to **Vercel** or **Firebase App Hosting**.

## Deploying to Vercel

1. **Push your code to a Git provider** (GitHub, GitLab, or Bitbucket).
2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Import your repository.
3. **Configure Environment Variables**:
   - In the Vercel project settings, add the following environment variables using the values from your `src/firebase/config.ts` or `.env` file:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
     - `NEXT_PUBLIC_AUDIO_BUCKET_ID`
   - Also add `GOOGLE_GENAI_API_KEY` for Genkit functionality.
4. **Build & Deploy**: Click "Deploy". Vercel will automatically detect Next.js and build your app.

## Deploying to Firebase App Hosting (Recommended)

Since this project already contains `apphosting.yaml`, it is optimized for Firebase App Hosting.

1. **Connect your repository** in the [Firebase Console](https://console.firebase.google.com/) under "App Hosting".
2. **Setup**: Firebase will automatically detect the Next.js framework and use the `apphosting.yaml` configuration.
3. **Environment Variables**: Set your secrets and environment variables in the Firebase Console.

## Local Development

```bash
npm install
npm run dev
```
