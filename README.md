
# 🔑 Internal Entry & Librarian Setup Guide

Follow these steps to unlock the repository and manage your archival broadcast.

### 1. Update GitHub & Deploy to Vercel
Open your terminal (usually at the bottom of your editor) and run these three commands in order:
1. `git add .`
2. `git commit -m "Update internal entry and archival bucket"`
3. `git push origin main`
*Vercel will automatically see this push and start building your live site.*

### 2. Enable Google Auth & Fix "Invalid Request"
If you get "Request Action is Invalid" when clicking Google login:
1. Go to **Firebase Console** > **Authentication**.
2. Click **Sign-in method** > **Add new provider**.
3. Select **Google**, enable it, and save.
4. **IMPORTANT**: Click the **Settings** tab (next to Sign-in method).
5. Click **Authorized Domains**.
6. Ensure your Vercel URL (e.g., `yourapp.vercel.app`) and `localhost` are listed.
7. Also, check **Project Settings** (gear icon) > **General**. Ensure your **Default GCP resource location** is set (e.g., `us-central`).

### 3. Connect to Vercel (REQUIRED)
The app will say "Offline" unless these keys are in your **Vercel Project Settings**:

*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
*   `NEXT_PUBLIC_FIREBASE_APP_ID`
*   `NEXT_PUBLIC_AUDIO_BUCKET_ID`: Set this to `0e61b06faeaf`

### 4. Grant Librarian Role
1. Open your app and click **Internal** to sign in with your Google account.
2. Once signed in, go to **Firebase Console** > **Firestore Database**.
3. Locate the `users` collection and find your user document (match by email).
4. Change the `role` field from `"user"` to `"librarian"`.
5. Refresh the app to see the **Review** tools in the navbar.
