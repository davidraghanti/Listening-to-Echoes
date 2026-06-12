'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Firebase Auth is not initialized. Check your environment variables."
      });
      return;
    }

    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Login failed', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred during sign-in."
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-muted bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Internal Access</CardTitle>
            <CardDescription>
              Authorized personnel only. Please sign in to access internal archives and creative tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGoogleLogin} 
              disabled={isLoggingIn}
              className="w-full h-12 bg-accent text-background hover:bg-accent/90 rounded-full font-semibold"
            >
              {isLoggingIn ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {isLoggingIn ? "Connecting..." : "Sign In with Google"}
            </Button>

            {!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-2 text-[10px] text-destructive leading-tight">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>
                  <strong>Missing Configuration:</strong> You must set your Firebase Environment Variables in Vercel/GitHub for authentication to work.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
