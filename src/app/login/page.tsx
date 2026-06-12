
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
import { Lock, Loader2, Key, CheckCircle2, ShieldAlert, WifiOff, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { firebaseConfig } from '@/firebase/config';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'ok' | 'error' | 'offline'>('checking');
  const [isMounted, setIsMounted] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);

    const checkConnectivity = () => {
      if (!navigator.onLine) {
        setConnectionStatus('offline');
        return;
      }

      // Check if essential config exists and isn't a placeholder
      const hasConfig = !!(
        firebaseConfig.apiKey && 
        firebaseConfig.projectId && 
        firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
        !firebaseConfig.apiKey.includes('placeholder')
      );
      
      if (hasConfig) {
        setConnectionStatus('ok');
      } else {
        setConnectionStatus('error');
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

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "Archive Connection Refused",
        description: "Verify that your Vercel Environment Variables are set correctly."
      });
      return;
    }

    if (code.length !== 10) {
      toast({
        variant: "destructive",
        title: "Protocol Error",
        description: "Entry codes must be exactly 10 digits."
      });
      return;
    }

    setIsVerifying(true);
    try {
      // 1. Verify code exists in Firestore as the Document ID
      const codeRef = doc(db, 'access_codes', code);
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        throw new Error(`The entry code [${code}] was not found in the master registry.`);
      }

      const { role } = codeSnap.data();

      // 2. Establish Secure Session (Anonymous)
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // 3. Link role to session profile
      await setDoc(doc(db, 'users', user.uid), {
        role,
        grantedAt: new Date().toISOString(),
        codeUsed: code,
        email: `internal-${user.uid.substring(0, 4)}@echoes.archive`
      }, { merge: true });

      toast({
        title: "Access Granted",
        description: `Clearance level [${role.toUpperCase()}] established.`
      });

      // Redirect based on role
      setTimeout(() => {
        router.push(role === 'librarian' ? '/librarian' : '/author');
      }, 800);
      
    } catch (error: any) {
      console.error('Validation Error:', error);
      toast({
        variant: "destructive",
        title: "Validation Failed",
        description: error.message || "Access denied by the repository security rules."
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
                <p>Network Unreachable. Check your connection.</p>
              </div>
            ) : connectionStatus === 'error' ? (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive text-xs">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold">Missing Archive Credentials</p>
                  <p>Check Vercel environment variables for NEXT_PUBLIC_FIREBASE_API_KEY.</p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg flex items-center gap-3 text-accent text-[10px] uppercase tracking-widest font-bold">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Synchronized with Main Archive</span>
              </div>
            )}
          </div>

          <Card className="w-full border-muted bg-card/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
                <Lock className="h-6 w-6 text-accent" />
                Internal Entry
              </CardTitle>
              <CardDescription className="pt-2">
                Provide your 10-digit archival entry code.
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
                      disabled={connectionStatus === 'offline' || connectionStatus === 'error'}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isVerifying || code.length !== 10 || connectionStatus !== 'ok'}
                  className="w-full h-14 bg-accent text-background hover:bg-accent/90 rounded-full font-bold text-lg transition-all"
                >
                  {isVerifying ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  {isVerifying ? "Verifying Protocol..." : "Execute Entry"}
                </Button>

                {connectionStatus !== 'ok' && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-xs text-muted-foreground"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCcw className="h-3 w-3 mr-2" /> Re-sync Connection
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
          
          <div className="text-center space-y-2">
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest opacity-50">
              System: Educational Experience Archive // Node: {isMounted ? window.location.hostname : 'archive'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
