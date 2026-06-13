'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { LogIn, Loader2, CheckCircle2, ShieldAlert, Key, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { firebaseConfig } from '@/firebase/config';

export default function LoginPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [accessCode, setAccessCode] = useState('');
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
        description: "Your Firebase keys are not in Vercel yet. Check the diagnostic box."
      });
      return;
    }

    if (!auth || !db) return;

    setIsVerifying(true);
    try {
      // Validate access code if provided
      let assignedRole: 'user' | 'librarian' | 'author' = 'user';
      if (accessCode.trim()) {
        const codeDoc = await getDoc(doc(db, 'access_codes', accessCode.trim()));
        if (codeDoc.exists()) {
          assignedRole = codeDoc.data().role || 'user';
          // Delete the code after use to prevent reuse
          await deleteDoc(doc(db, 'access_codes', accessCode.trim()));
        } else {
          toast({
            variant: "destructive",
            title: "Invalid Access Code",
            description: "The code provided does not exist or has expired."
          });
          setIsVerifying(false);
          return;
        }
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          role: assignedRole,
          joinedAt: new Date().toISOString()
        });
        
        toast({
          title: "Profile Created",
          description: assignedRole !== 'user' 
            ? `Welcome to the team! Role: ${assignedRole.toUpperCase()}`
            : "Sign-in successful. Check README.md to bootstrap Librarian role."
        });
      } else if (assignedRole !== 'user') {
        // Update existing user if they used a code
        await setDoc(userDocRef, { role: assignedRole }, { merge: true });
        toast({ title: "Role Updated", description: `Clearance level changed to ${assignedRole.toUpperCase()}` });
      }

      // Final redirect check
      const finalSnap = await getDoc(userDocRef);
      const role = finalSnap.data()?.role || 'user';
      if (role === 'librarian') router.push('/librarian');
      else if (role === 'author') router.push('/author');
      else router.push('/');
      
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
              <p className="text-xs leading-relaxed">The SDK values are missing from your <strong>Vercel Project Settings</strong>:</p>
              <ul className="grid gap-1 font-mono text-[9px] bg-black/20 p-2 rounded">
                {configErrors.map((err, i) => <li key={i} className="flex items-center gap-2">• NEXT_PUBLIC_FIREBASE_{err}</li>)}
              </ul>
              <p className="text-[10px] italic">Copy these from your Firebase Console &gt; Project Settings.</p>
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
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <Key className="h-3 w-3" /> Optional: Internal Access Code
                </Label>
                <Input 
                  id="code"
                  placeholder="10-digit code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="bg-muted/30 border-muted text-center font-mono tracking-widest"
                />
                <p className="text-[9px] text-muted-foreground italic flex items-center gap-1">
                  <Info className="h-2 w-2" /> Codes are generated by existing Librarians on the Team page.
                </p>
              </div>

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
                  Clearance Required for Dashboard
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}