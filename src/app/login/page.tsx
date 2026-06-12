
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LogIn, Loader2, CheckCircle2, ShieldAlert, WifiOff, RefreshCcw } from 'lucide-react';
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

      if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY') errors.push('API Key');
      if (!firebaseConfig.projectId) errors.push('Project ID');
      if (!firebaseConfig.appId) errors.push('App ID');

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

  // Redirect if already logged in and has a role
  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'librarian') router.push('/librarian');
      else if (profile.role === 'author') router.push('/author');
    }
  }, [user, profile, router]);

  const handleGoogleLogin = async () => {
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "Initialization Error",
        description: "Firebase services failed to initialize. Please check your Environment Variables."
      });
      return;
    }

    setIsVerifying(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check for existing profile
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        // Create a default user profile if none exists
        await setDoc(userDocRef, {
          email: user.email,
          role: 'user', // Default role. Librarian roles must be assigned manually in Console for first user.
          joinedAt: new Date().toISOString()
        });
        
        toast({
          title: "Session Established",
          description: "Authenticated successfully. Note: Staff access requires librarian approval."
        });
        router.push('/');
      } else {
        const role = userSnap.data()?.role || 'user';
        toast({
          title: "Access Granted",
          description: `Welcome back. Clearance level: ${role.toUpperCase()}`
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
        description: error.message || "Failed to sign in with Google."
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
        <div className="max-w-md w-full space-y-4">
          
          <div className="space-y-2">
            {connectionStatus === 'offline' ? (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive text-xs">
                <WifiOff className="h-5 w-5 shrink-0" />
                <p>Internet Unreachable. Check your connection.</p>
              </div>
            ) : connectionStatus === 'error' ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3 text-amber-500 text-xs">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wider">Archive Connection Issue</p>
                  <p>Check Vercel Environment Variables for:</p>
                  <ul className="list-disc list-inside mt-1 font-mono">
                    {configErrors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              </div>
            ) : connectionStatus === 'ok' ? (
              <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg flex items-center gap-3 text-accent text-[10px] uppercase tracking-widest font-bold">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Secure Connection Established</span>
              </div>
            ) : (
              <div className="p-3 bg-muted/20 border border-muted rounded-lg flex items-center gap-3 text-muted-foreground text-[10px] uppercase tracking-widest">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Verifying Repository Node...</span>
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
                Sign in with your authorized Google account to access librarian tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                {isVerifying ? "Archiving Clearance..." : "Continue with Google"}
              </Button>

              {connectionStatus !== 'ok' && connectionStatus !== 'checking' && (
                <Button 
                  variant="ghost" 
                  className="w-full text-xs text-muted-foreground mt-4"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCcw className="h-3 w-3 mr-2" /> Attempt Re-sync
                </Button>
              )}
            </CardContent>
          </Card>
          
          <div className="text-center">
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest opacity-50 font-mono">
              System: Educational Experience Archive // Node: {isMounted ? window.location.hostname : 'archive'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
