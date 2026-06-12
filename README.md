
# 🔑 Unlocking the Archive: Step-by-Step Guide

To make your secret 10-digit code work, you need to tell the "App's Brain" (Firebase) to allow anonymous visitors and register your code.

### 1. Enable Anonymous Auth (The "Secret Door")
1. Open your **Firebase Console**.
2. Click **Authentication** (person icon) in the left sidebar.
3. Click the **Sign-in method** tab at the top.
4. Locate **Anonymous** in the provider list.
5. Click the pencil ✏️ icon, flip the switch to **Enabled**, and click **Save**.

### 2. Create your Secret Code in the Database
1. Click **Firestore Database** in the left sidebar.
2. Click **Start collection** and name it `access_codes`.
3. **CRITICAL STEP**: When it asks for a "Document ID":
    *   Do **NOT** click "Auto-ID".
    *   Type your code exactly: `3305021271`.
4. Add a field to this document:
    *   **Field Name**: `role`
    *   **Type**: `string`
    *   **Value**: `librarian`
5. Click **Save**.

### 3. Check Vercel Environment Variables
If the app says "Client is Offline" or "Missing Credentials", ensure these exact keys are in your **Vercel Project Settings**:

*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
*   `NEXT_PUBLIC_FIREBASE_APP_ID`
*   `NEXT_PUBLIC_AUDIO_BUCKET_ID` (Default: `0e61b06faeaf`)

**IMPORTANT:** You must trigger a **Redeploy** on Vercel after adding these keys.
