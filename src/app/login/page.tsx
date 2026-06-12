
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Lock, Loader2, Key } from 'lucide-react';
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
    if (!auth || !db) return;

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
      const codeRef = doc(db, 'access_codes', code);
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        throw new Error("The access code entered is not recognized by the repository.");
      }

      const { role } = codeSnap.data();

      // 2. Sign in anonymously to get a stable UID
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // 3. Create/Update profile with the granted role
      await setDoc(doc(db, 'users', user.uid), {
        role,
        grantedAt: new Date().toISOString(),
        codeUsed: code
      }, { merge: true });

      toast({
        title: "Access Granted",
        description: `Welcome. You have been authenticated as a ${role}.`
      });

      router.push(role === 'librarian' ? '/librarian' : '/author');
    } catch (error: any) {
      console.error('Login failed', error);
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: error.message || "Could not verify code."
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-muted bg-card/50 backdrop-blur-sm">
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
                    maxLength={10}
                    placeholder="0000000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="pl-10 h-12 bg-muted/20 border-muted text-center text-xl tracking-[0.5em] font-mono"
                  />
                </div>
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                  Archival codes are managed by the repository lead.
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={isVerifying || code.length !== 10}
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
      </main>
    </div>
  );
}
