
# 🔑 Internal Entry & Librarian Setup Guide

Follow these steps to unlock the repository and manage your archival broadcast.

### 📍 Where is the Terminal?
Look at the **very bottom** of this screen. You will see several tabs. 
*   **DO NOT** use the tab labeled **"Console"**. That is for code errors.
*   **USE** the tab labeled **"Terminal"**. 

If you see a `>` prompt, you are likely in the wrong place. If you see a path like `/home/project`, you are in the correct place.

### 1. Update GitHub & Deploy
Type these three commands into the **Terminal** (press Enter after each):

1. `git add .`
2. `git commit -m "Fixing entry logic and bucket links"`
3. `git push origin main`

*Vercel will automatically see this push and start building your live site.*

### 2. Connect to Vercel (CRITICAL)
The app will say "Offline" or "API Key Invalid" until these keys are in your **Vercel Project Settings** > **Environment Variables**:

*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
*   `NEXT_PUBLIC_FIREBASE_APP_ID`
*   `NEXT_PUBLIC_AUDIO_BUCKET_ID`: `0e61b06faeaf`

*Note: After adding these in Vercel, you must go to the **Deployments** tab and click **Redeploy** on your latest build.*

### 3. Enable Google Auth
If you get "Request Action is Invalid":
1. Go to **Firebase Console** > **Authentication**.
2. Click **Sign-in method** > **Add new provider**.
3. Select **Google**, enable it, and save.
4. **IMPORTANT**: Click the **Settings** tab (next to Sign-in method).
5. Click **Authorized Domains**.
6. Ensure your Vercel URL (e.g., `yourapp.vercel.app`) is listed.

### 4. Grant Librarian Role
1. Open your app and click **Internal** to sign in with your Google account.
2. Once signed in, go to **Firebase Console** > **Firestore Database**.
3. Locate the `users` collection and find your user document.
4. Change the `role` field from `"user"` to `"librarian"`.
5. Refresh the app to see the **Review** tools in the navbar.
