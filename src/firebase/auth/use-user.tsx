
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
    
    const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as UserProfile);
        setLoading(false);
      } else {
        if (user.email) {
          const email = user.email.toLowerCase();
          
          // Check for manual bootstrap or explicit email-based authorization
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
          } else if (email === 'davidraghanti@gmail.com') {
            const bootstrapProfile: UserProfile = { role: 'librarian', email: email };
            await setDoc(userDocRef, {
              ...bootstrapProfile,
              linkedAt: new Date().toISOString()
            }, { merge: true });
            setProfile(bootstrapProfile);
          } else {
            setProfile({ role: 'user', email });
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
