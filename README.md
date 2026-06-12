
# 🔑 Unlocking the Archive: Staff Setup Guide

To access internal Librarian or Author functions, you must enable Google Authentication and set up your user profile in the database.

### 1. Enable Google Auth
1. Open your **Firebase Console**.
2. Click **Authentication** (person icon) in the left sidebar.
3. Click the **Sign-in method** tab.
4. Click **Add new provider** and select **Google**.
5. Enable it, provide a support email, and click **Save**.

### 2. Set Up Your Librarian Role
1. Open the app and click **Internal** (or go to `/login`).
2. Sign in with your Google account.
3. Once signed in, go back to your **Firebase Console**.
4. Click **Firestore Database**.
5. Find the `users` collection.
6. Find the document that matches your User ID (it will have your email inside).
7. Change the `role` field from `"user"` to `"librarian"`.
8. Refresh the app. You will now see the "Review" and "Team" tabs in the Navbar.

### 3. Check Vercel Environment Variables
Ensure these exact keys are in your **Vercel Project Settings**:

*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
*   `NEXT_PUBLIC_FIREBASE_APP_ID`

**IMPORTANT:** You must trigger a **Redeploy** on Vercel after adding these keys for them to work.
