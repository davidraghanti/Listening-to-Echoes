'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LogIn, Loader2, CheckCircle2, ShieldAlert, WifiOff, Terminal, Key } from 'lucide-react';
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

      // Diagnostic check for environment variables
      const keys = [
        { name: 'API_KEY', value: firebaseConfig.apiKey },
        { name: 'PROJECT_ID', value: firebaseConfig.projectId },
        { name: 'AUTH_DOMAIN', value: firebaseConfig.authDomain }
      ];

      keys.forEach(k => {
        if (!k.value || k.value === 'undefined' || k.value === '') {
          errors.push(k.name);
        }
      });

      if (errors.length > 0) {
        setConfigErrors(errors);
        setConnectionStatus('error');
      } else {
        setConnectionStatus('ok');
      }
    };

    checkConnectivity();
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
        title: "Setup Required",
        description: "Your Firebase keys (from the SDK snippet) are not in Vercel yet."
      });
      return;
    }

    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "Initializing...",
        description: "Firebase is starting up. Please try again in 3 seconds."
      });
      return;
    }

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
          title: "Entry Successful",
          description: "Sign-in successful. Check README.md step #4 to unlock Librarian role."
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
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message
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
          
          {connectionStatus === 'error' && (
            <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col gap-3 text-amber-500 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <p className="font-bold uppercase tracking-wider text-[10px]">Vercel Setup Needed</p>
              </div>
              <p className="text-xs leading-relaxed">The "SDK Snippet" values are missing from your <strong>Vercel Project Settings</strong>:</p>
              <ul className="grid gap-1 font-mono text-[9px] bg-black/20 p-2 rounded">
                {configErrors.map((err, i) => <li key={i} className="flex items-center gap-2">• NEXT_PUBLIC_FIREBASE_{err}</li>)}
              </ul>
              <p className="text-[10px] italic">Copy these from your Firebase Console &gt; Project Settings.</p>
            </div>
          )}

          {connectionStatus === 'ok' && (
            <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg flex items-center gap-3 text-accent text-[10px] uppercase tracking-widest font-bold">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Archive Node Connected</span>
            </div>
          )}

          <Card className="w-full border-muted bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
                <LogIn className="h-6 w-6 text-accent" />
                Internal Entry
              </CardTitle>
              <CardDescription className="pt-2">
                Sign in with Google to access Librarian tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleGoogleLogin}
                disabled={isVerifying || connectionStatus !== 'ok'}
                className="w-full h-14 bg-accent text-background hover:bg-accent/90 rounded-full font-bold text-lg"
              >
                {isVerifying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                {isVerifying ? "Verifying..." : "Sign in with Google"}
              </Button>

              <div className="pt-4 border-t border-muted/30">
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed">
                  Librarian Clearance Required
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
