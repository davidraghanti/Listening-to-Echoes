
# 🔑 Internal Entry & Librarian Setup Guide

Follow these steps to unlock the repository and manage your archival broadcast.

### ⚠️ IMPORTANT: Terminal Usage
The commands below MUST be typed into the **Terminal** tab at the bottom of your editor window (next to "Console" or "Output"). **Do NOT** type these into the browser console or into a code file.

### 1. Update GitHub & Deploy
To push these code fixes to your site:
1. Click the **Terminal** tab in your editor.
2. Run these three commands in order (press Enter after each):
   - `git add .`
   - `git commit -m "Fix hydration and diagnostic tools"`
   - `git push origin main`

*Vercel will automatically see this push and start building your live site.*

### 2. Connect to Vercel (CRITICAL)
The app will say "Offline" or "API Key Invalid" unless these keys are in your **Vercel Project Settings** > **Environment Variables**:

*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
*   `NEXT_PUBLIC_FIREBASE_APP_ID`
*   `NEXT_PUBLIC_AUDIO_BUCKET_ID`: `0e61b06faeaf`

*Note: After adding these in Vercel, you must go to the **Deployments** tab and click **Redeploy** on your latest build.*

### 3. Enable Google Auth
If you get "Request Action is Invalid" or "Operation Not Allowed":
1. Go to **Firebase Console** > **Authentication**.
2. Click **Sign-in method** > **Add new provider**.
3. Select **Google**, enable it, and save.
4. **IMPORTANT**: Click the **Settings** tab (next to Sign-in method).
5. Click **Authorized Domains**.
6. Ensure your Vercel URL (e.g., `yourapp.vercel.app`) is listed.

### 4. Grant Librarian Role
1. Open your app and click **Internal** to sign in with your Google account.
2. Once signed in, go to **Firebase Console** > **Firestore Database**.
3. Locate the `users` collection and find your user document (it will have your email).
4. Change the `role` field from `"user"` to `"librarian"`.
5. Refresh the app to see the **Review** tools in the navbar.
