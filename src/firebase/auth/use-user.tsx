
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';

export interface UserProfile {
  role?: 'user' | 'librarian' | 'author';
  email?: string;
}

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
    
    // First, listen to the UID-based document
    const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as UserProfile);
        setLoading(false);
      } else {
        // Fallback: Check if there's an authorization by email
        if (user.email) {
          const email = user.email.toLowerCase();
          const emailDocRef = doc(db, 'users', email);
          const emailSnapshot = await getDoc(emailDocRef);
          
          if (emailSnapshot.exists()) {
            const data = emailSnapshot.data() as UserProfile;
            // "Migrate" or link the authorization to the UID for better security/performance
            setDoc(userDocRef, {
              ...data,
              email: email,
              linkedAt: new Date().toISOString()
            }, { merge: true });
            
            setProfile(data);
          } else if (email === 'davidraghanti@gmail.com') {
            // Bootstrap the first librarian role
            const bootstrapProfile: UserProfile = { role: 'librarian', email: email };
            setDoc(userDocRef, {
              ...bootstrapProfile,
              linkedAt: new Date().toISOString()
            }, { merge: true });
            setProfile(bootstrapProfile);
          } else {
            setProfile({ role: 'user' });
          }
        } else {
          setProfile({ role: 'user' });
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db, user]);

  return { user, profile, loading };
}
