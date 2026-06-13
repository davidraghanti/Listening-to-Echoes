
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LogIn, Loader2, CheckCircle2, ShieldAlert, WifiOff, RefreshCcw, Terminal, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { firebaseConfig } from '@/firebase/config';

export default function LoginPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'ok' | 'error' | 'offline'>('checking');
  const [configErrors, setConfigErrors] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const { user, profile } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);

    const checkConnectivity = () => {
      const errors: string[] = [];
      
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setConnectionStatus('offline');
        return;
      }

      // Check for missing or literal 'undefined' string values from env
      if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
        errors.push('NEXT_PUBLIC_FIREBASE_API_KEY');
      }
      if (!firebaseConfig.projectId || firebaseConfig.projectId === 'undefined') {
        errors.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
      }
      if (!firebaseConfig.authDomain || firebaseConfig.authDomain === 'undefined') {
        errors.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
      }

      if (errors.length > 0) {
        setConfigErrors(errors);
        setConnectionStatus('error');
      } else {
        setConnectionStatus('ok');
      }
    };

    checkConnectivity();
    window.addEventListener('online', checkConnectivity);
    window.addEventListener('offline', checkConnectivity);
    
    return () => {
      window.removeEventListener('online', checkConnectivity);
      window.removeEventListener('offline', checkConnectivity);
    };
  }, []);

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'librarian') router.push('/librarian');
      else if (profile.role === 'author') router.push('/author');
    }
  }, [user, profile, router]);

  const handleGoogleLogin = async () => {
    if (connectionStatus !== 'ok') {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Your Firebase keys are missing. Please add them to Vercel Project Settings."
      });
      return;
    }

    if (!auth || !db) return;

    setIsVerifying(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          role: 'user',
          joinedAt: new Date().toISOString()
        });
        
        toast({
          title: "Initial Entry Recorded",
          description: "Sign-in successful. Contact the admin to grant Librarian role."
        });
        router.push('/');
      } else {
        const role = userSnap.data()?.role || 'user';
        toast({
          title: "Access Granted",
          description: `Clearance level: ${role.toUpperCase()}`
        });
        
        if (role === 'librarian') router.push('/librarian');
        else if (role === 'author') router.push('/author');
        else router.push('/');
      }
      
    } catch (error: any) {
      console.error('Login Error:', error);
      
      let errorMsg = error.message;
      if (error.code === 'auth/api-key-not-valid') {
        errorMsg = "The API Key in your Vercel Environment Variables is invalid or missing.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMsg = "Google login is not enabled in your Firebase Console.";
      }

      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: errorMsg
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          
          <div className="space-y-4">
            {connectionStatus === 'offline' ? (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive text-xs">
                <WifiOff className="h-5 w-5 shrink-0" />
                <p>Internet Unreachable. Check your connection.</p>
              </div>
            ) : connectionStatus === 'error' ? (
              <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col gap-3 text-amber-500">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <p className="font-bold uppercase tracking-wider text-[10px]">Configuration Required</p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs leading-relaxed">The app is missing its connection keys. You must add these to your <strong>Vercel Project Settings</strong>:</p>
                  <ul className="grid gap-1 font-mono text-[9px] bg-black/20 p-2 rounded">
                    {configErrors.map((err, i) => <li key={i} className="flex items-center gap-2">• {err}</li>)}
                  </ul>
                  <p className="text-[10px] italic">Refresh the page after adding keys and redeploying in Vercel.</p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg flex items-center gap-3 text-accent text-[10px] uppercase tracking-widest font-bold">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Archive Node: Online</span>
              </div>
            )}
          </div>

          <Card className="w-full border-muted bg-card/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
                <LogIn className="h-6 w-6 text-accent" />
                Internal Entry
              </CardTitle>
              <CardDescription className="pt-2">
                Authorized access for repository staff.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleGoogleLogin}
                disabled={isVerifying || connectionStatus !== 'ok'}
                className="w-full h-14 bg-accent text-background hover:bg-accent/90 rounded-full font-bold text-lg transition-all"
              >
                {isVerifying ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-5 w-5" />
                )}
                {isVerifying ? "Verifying..." : "Sign in with Google"}
              </Button>

              <div className="pt-4 border-t border-muted/30">
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed">
                  Clearance level required: LIBRARIAN
                </p>
              </div>

              {connectionStatus === 'error' && (
                <div className="mt-4 p-4 bg-accent/5 rounded-lg border border-accent/10 flex gap-3">
                  <Terminal className="h-4 w-4 text-accent shrink-0" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Check your .env file or Vercel Environment Variables. The API Key is currently {firebaseConfig.apiKey ? 'Present but possibly wrong' : 'Missing'}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest opacity-50">
              System: Educational Experience Archive // Node: {isMounted ? window.location.hostname : 'archive'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
