
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

/**
 * Global listener for Firebase permission errors.
 * Surfaces contextual error information to the user via Toasts.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = errorEmitter.on('permission-error', (error) => {
      console.error('Firestore Permission Error:', error);

      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: error.message,
      });
    });

    return () => unsubscribe();
  }, [toast]);

  return null;
}
