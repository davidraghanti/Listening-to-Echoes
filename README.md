
# 🔑 Unlocking the Archive: Step-by-Step Guide

To make your secret 10-digit code work, you need to tell the "App's Brain" (Firebase) to allow anonymous visitors. Follow these simple steps:

### 1. Enable Anonymous Auth (The "Secret Door")
1. Open your **Firebase Console**.
2. On the left side, look for the **person icon** that says **Authentication**. Click it.
3. At the top, click the tab that says **Sign-in method**.
4. Look down the list for **Anonymous**. 
5. Click the little pencil ✏️ next to it.
6. Flip the switch to **Enabled**.
7. Click the blue **Save** button.

### 2. Create your Secret Code in the Database
1. On the left side of the Firebase Console, click **Firestore Database**.
2. Click **Start collection** and name it `access_codes`.
3. **STOP!** When it asks for a "Document ID":
    *   Do **NOT** click "Auto-ID".
    *   Type your code exactly: `3305021271`.
4. Add a field:
    *   **Field Name**: `role`
    *   **Type**: `string`
    *   **Value**: `librarian`
5. Click **Save**.

### 3. Check your Vercel Settings
Ensure these keys are in your Vercel project settings, or the app will say "Client is offline":
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_AUDIO_BUCKET_ID` (Default: `0e61b06faeaf`)

Once these 3 parts are done, you can type your code into the login box and press **Execute Entry**!
