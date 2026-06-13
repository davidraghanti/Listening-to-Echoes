# 🔑 Internal Entry & Librarian Setup Guide

Follow these steps to connect your "Archival Brain" (Firebase) to your "Archival Body" (Vercel).

### 📍 Where is the Terminal?
Look at the **very bottom** of this screen. You will see several tabs like "Console", "Terminal", and "Output".
*   **DO NOT** use the tab labeled **"Console"**. That is for JavaScript code.
*   **USE** the tab labeled **"Terminal"**. 

---

### 1. Update GitHub & Deploy
Type these three commands into the **Terminal** tab (press Enter after each):

1. `git add .`
2. `git commit -m "Add access code logic for team onboarding"`
3. `git push origin main`

*Vercel will automatically see this push and start building your live site.*

---

### 2. Connect the "SDK Snippet" (CRITICAL)
Your app will stay "Offline" or show "Invalid API Key" until you add your Firebase keys to Vercel.

1.  Go to **Firebase Console** > **Project Settings** (gear icon).
2.  Scroll down to **"SDK setup and configuration"**.
3.  Select **"Config"** to see your SDK Snippet.
4.  Open **Vercel** > **Project Settings** > **Environment Variables**.
5.  Add these keys using the values from your snippet:

*   `NEXT_PUBLIC_FIREBASE_API_KEY`: (Copy the `apiKey` value)
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: (Copy the `authDomain` value)
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: (Copy the `projectId` value)
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: (Copy the `storageBucket` value)
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: (Copy the `messagingSenderId` value)
*   `NEXT_PUBLIC_FIREBASE_APP_ID`: (Copy the `appId` value)
*   `NEXT_PUBLIC_AUDIO_BUCKET_ID`: `0e61b06faeaf`

**IMPORTANT**: After adding these in Vercel, you must go to the **Deployments** tab in Vercel and click **Redeploy** on your latest build for the changes to take effect.

---

### 3. Enable Google Auth
If you get "Request Action is Invalid":
1.  Go to **Firebase Console** > **Authentication**.
2.  Click **Sign-in method** > **Add new provider**.
3.  Select **Google**, enable it, and save.
4.  **Authorized Domains**: In the **Settings** tab (next to Sign-in method), ensure your Vercel URL (e.g., `yourapp.vercel.app`) is listed.

---

### 4. Grant THE FIRST Librarian Role (Bootstrapping)
1.  Open your live app and click **Internal** to sign in with your Google account.
2.  Once signed in, go to **Firebase Console** > **Firestore Database**.
3.  Locate the `users` collection and find your user document (matched by your email).
4.  Change the `role` field from `"user"` to `"librarian"`.
5.  Refresh the app. You will now see the **Review** and **Team** tools in the navbar.

---

### 5. Adding Future Librarians
Now that you are a Librarian:
1.  Go to the **Team** page in the navbar.
2.  Generate a **10-Digit Access Code**.
3.  Give this code to your colleague. 
4.  They can enter it on the **Login** page when signing in to automatically receive their role.