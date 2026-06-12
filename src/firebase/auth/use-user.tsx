
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';

export interface UserProfile {
  role?: 'user' | 'librarian' | 'author';
  email?: string;
  linkedAt?: string;
}

/**
 * Hook to manage the current user state and their Firestore profile.
 * Now optimized for anonymous sessions tied to access codes.
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
    if (!db || !user) {
      if (!user) setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    
    // Listen to the user's profile document
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as UserProfile);
      } else {
        // Default to guest/standard user if no profile exists yet
        setProfile({ role: 'user' });
      }
      setLoading(false);
    }, (error) => {
      console.error("Profile listener error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, user]);

  return { user, profile, loading };
}
