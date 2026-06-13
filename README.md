
# 🔑 Internal Entry & Librarian Setup Guide

Follow these steps to unlock the repository and manage your archival broadcast.

### 1. Enable Google Auth
1. Go to **Firebase Console** > **Authentication**.
2. Click **Sign-in method** > **Add new provider**.
3. Select **Google**, enable it, and save.

### 2. Grant Librarian Role
1. Open your app and click **Internal** to sign in with Google.
2. Once signed in, go to **Firebase Console** > **Firestore Database**.
3. Locate the `users` collection and find your ID.
4. Change the `role` field from `"user"` to `"librarian"`.
5. Refresh the app to see the **Review** tools.

### 3. Connect to Vercel (IMPORTANT)
If the login page says "Offline," you must add these keys to your **Vercel Project Settings**:

*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
*   `NEXT_PUBLIC_FIREBASE_APP_ID`
*   `NEXT_PUBLIC_AUDIO_BUCKET_ID`: Set this to `0e61b06faeaf` (or your chosen bucket).

### 4. Podcast & RSS
When approving stories in the Librarian dashboard, enter the filename (e.g., `echo-001.mp3`) in the audio field. The RSS feed will automatically link it to your bucket:
`https://storage.googleapis.com/0e61b06faeaf/your-file.mp3`
