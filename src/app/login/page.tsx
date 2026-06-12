
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth, useFirestore } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Lock, Loader2, Key, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Firebase is not initialized. Check your environment variables in Vercel."
      });
      return;
    }

    if (code.length !== 10) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Access codes must be exactly 10 digits."
      });
      return;
    }

    setIsVerifying(true);
    try {
      // 1. Check if code exists in Firestore
      // The document ID in 'access_codes' must be the 10-digit string
      const codeRef = doc(db, 'access_codes', code);
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        throw new Error("Access code not recognized. Ensure it was added to the 'access_codes' collection.");
      }

      const { role } = codeSnap.data();

      // 2. Sign in anonymously to get a stable UID
      // CRITICAL: Anonymous Auth MUST be enabled in Firebase Console
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // 3. Create/Update profile with the granted role
      await setDoc(doc(db, 'users', user.uid), {
        role,
        grantedAt: new Date().toISOString(),
        codeUsed: code,
        email: `anonymous-${user.uid.substring(0, 5)}@listeningtoechoes.internal`
      }, { merge: true });

      toast({
        title: "Access Granted",
        description: `Authenticated as ${role}. Redirecting...`
      });

      // Force a small delay to ensure profile listener in useUser can catch the update
      setTimeout(() => {
        router.push(role === 'librarian' ? '/librarian' : '/author');
      }, 800);
      
    } catch (error: any) {
      console.error('Login diagnostic error:', error);
      
      let message = error.message || "Could not verify code.";
      if (message.includes('auth/operation-not-allowed')) {
        message = "Anonymous Auth is not enabled in Firebase Console.";
      } else if (message.includes('permission-denied')) {
        message = "Database permissions denied. Check your Firestore rules.";
      }

      toast({
        variant: "destructive",
        title: "Access Denied",
        description: message
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          {!auth && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive text-sm">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p>Firebase Auth is unavailable. Check API keys.</p>
            </div>
          )}
          
          <Card className="w-full border-muted bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
                <Lock className="h-6 w-6 text-accent" />
                Internal Access
              </CardTitle>
              <CardDescription>
                Enter your 10-digit archival access code to authenticate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="0000000000"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      className="pl-10 h-12 bg-muted/20 border-muted text-center text-xl tracking-[0.5em] font-mono"
                      autoFocus
                    />
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                    Your master code is your key to the repository.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isVerifying || code.length !== 10 || !auth}
                  className="w-full h-12 bg-accent text-background hover:bg-accent/90 rounded-full font-semibold"
                >
                  {isVerifying ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
