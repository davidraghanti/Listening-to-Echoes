
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';

export interface UserProfile {
  role?: 'user' | 'librarian' | 'author';
  email?: string;
  linkedAt?: string;
}

/**
 * Hook to manage the current user state and their Firestore profile.
 * Handles automatic bootstrapping for the primary admin email.
 */
export function useUser() {
  const auth = useAuth();
  const db = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;

    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setProfile(null);
        setLoading(false);
      }
    });
  }, [auth]);

  useEffect(() => {
    if (!db || !user) return;

    const userDocRef = doc(db, 'users', user.uid);
    
    // Listen to the user's private profile document
    const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as UserProfile);
        setLoading(false);
      } else {
        // Handle First-time Sign-in / Bootstrapping
        if (user.email) {
          const email = user.email.toLowerCase();
          
          // 1. Check for manual pre-authorization in the email-based collection
          const emailDocRef = doc(db, 'users', email);
          const emailSnapshot = await getDoc(emailDocRef);
          
          if (emailSnapshot.exists()) {
            const data = emailSnapshot.data() as UserProfile;
            await setDoc(userDocRef, {
              ...data,
              email: email,
              linkedAt: new Date().toISOString()
            }, { merge: true });
            setProfile(data);
          } 
          // 2. Bootstrap primary admin email
          else if (email === 'davidraghanti@gmail.com') {
            const bootstrapProfile: UserProfile = { 
              role: 'librarian', 
              email: email 
            };
            await setDoc(userDocRef, {
              ...bootstrapProfile,
              linkedAt: new Date().toISOString()
            }, { merge: true });
            setProfile(bootstrapProfile);
          } 
          // 3. Default to standard user
          else {
            const defaultProfile: UserProfile = { role: 'user', email };
            // Optional: You could write this to DB too, but we can just set state
            setProfile(defaultProfile);
          }
        } else {
          setProfile({ role: 'user' });
        }
        setLoading(false);
      }
    }, (error) => {
      console.error("Profile listener error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, user]);

  return { user, profile, loading };
}
