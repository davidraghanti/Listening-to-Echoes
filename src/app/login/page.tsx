
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth, useFirestore } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Lock, Loader2, Key, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { firebaseConfig } from '@/firebase/config';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if critical config is present
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      setConnectionStatus('ok');
    } else {
      setConnectionStatus('error');
    }
  }, []);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Firebase is not initialized. Ensure all NEXT_PUBLIC_FIREBASE_* variables are set in Vercel."
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
      // IMPORTANT: The document ID must be the 10-digit code string
      const codeRef = doc(db, 'access_codes', code);
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        throw new Error("Access code not recognized. Check that the document ID in 'access_codes' is exactly '3305021271'.");
      }

      const { role } = codeSnap.data();

      // 2. Sign in anonymously
      // This will fail if Anonymous Auth is not enabled in Firebase Console
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // 3. Create/Update user profile
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

      // Brief delay to allow the session state to stabilize
      setTimeout(() => {
        router.push(role === 'librarian' ? '/librarian' : '/author');
      }, 1000);
      
    } catch (error: any) {
      console.error('Login Error:', error);
      
      let message = error.message;
      if (message.includes('auth/operation-not-allowed')) {
        message = "Anonymous Auth is disabled. Enable it in Firebase Console > Authentication > Sign-in method.";
      } else if (message.includes('permission-denied')) {
        message = "Security Rules blocked the request. Ensure 'access_codes' collection is readable.";
      }

      toast({
        variant: "destructive",
        title: "Verification Failed",
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
          {connectionStatus === 'error' && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive text-sm">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p>Missing Environment Variables. Authentication will fail.</p>
            </div>
          )}

          {connectionStatus === 'ok' && !isVerifying && (
            <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg flex items-center gap-3 text-accent text-[10px] uppercase tracking-widest">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>System Connected & Ready</span>
            </div>
          )}
          
          <Card className="w-full border-muted bg-card/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
                <Lock className="h-6 w-6 text-accent" />
                Internal Access
              </CardTitle>
              <CardDescription className="pt-2">
                Enter your 10-digit archival access code to authenticate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="space-y-3">
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="0000000000"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      className="pl-10 h-14 bg-muted/20 border-muted text-center text-2xl tracking-[0.5em] font-mono focus:ring-accent"
                      autoFocus
                    />
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed">
                    Access is logged and audited. <br/>Use your master librarian key.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isVerifying || code.length !== 10 || connectionStatus === 'error'}
                  className="w-full h-14 bg-accent text-background hover:bg-accent/90 rounded-full font-bold text-lg transition-all"
                >
                  {isVerifying ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  {isVerifying ? "Authenticating..." : "Enter Repository"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <p className="text-center text-[9px] text-muted-foreground uppercase tracking-tighter">
            Archival Platform v1.2 // Secure Session Protocol
          </p>
        </div>
      </main>
    </div>
  );
}
