
/**
 * Firebase Configuration
 * 
 * Values are pulled from environment variables. 
 * Ensure NEXT_PUBLIC_ prefixes are used for client-side access.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // Your dedicated sound bucket ID
  audioBucketId: process.env.NEXT_PUBLIC_AUDIO_BUCKET_ID || "0e61b06faeaf" 
};

// Validation for development debugging
if (typeof window !== 'undefined') {
  const isInvalid = !firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined';
  if (isInvalid) {
    console.error("CRITICAL: Firebase API Key is missing or 'undefined'. Check your Vercel Environment Variables.");
  }
}
