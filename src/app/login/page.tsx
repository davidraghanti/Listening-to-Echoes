
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
  const [configErrors, setConfigErrors] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
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

      // Check for specific missing keys in the config
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

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "Initialization Error",
        description: "Firebase services failed to initialize. Please check your Vercel Environment Variables."
      });
      return;
    }

    if (code.length !== 10) {
      toast({
        variant: "destructive",
        title: "Protocol Error",
        description: "Archival codes must be exactly 10 digits."
      });
      return;
    }

    setIsVerifying(true);
    try {
      // 1. Verify code exists in Firestore as the Document ID
      const codeRef = doc(db, 'access_codes', code);
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        throw new Error(`Entry code [${code}] not recognized by the repository.`);
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

      // Wait for propagation then redirect
      setTimeout(() => {
        router.push(role === 'librarian' ? '/librarian' : '/author');
      }, 1000);
      
    } catch (error: any) {
      console.error('Validation Error:', error);
      toast({
        variant: "destructive",
        title: "Validation Failed",
        description: error.message || "Security rules denied access. Ensure Anonymous Auth is enabled."
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
                      disabled={connectionStatus === 'offline' || connectionStatus === 'error' || isVerifying}
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
                  {isVerifying ? "Archiving Clearance..." : "Execute Entry"}
                </Button>

                {connectionStatus !== 'ok' && connectionStatus !== 'checking' && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-xs text-muted-foreground"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCcw className="h-3 w-3 mr-2" /> Attempt Re-sync
                  </Button>
                )}
              </form>
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
