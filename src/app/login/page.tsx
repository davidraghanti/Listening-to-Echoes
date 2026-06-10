
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    if (!auth) return;
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  if (loading) return null;

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
          <CardContent>
            <Button 
              onClick={handleGoogleLogin} 
              className="w-full h-12 bg-accent text-background hover:bg-accent/90 rounded-full font-semibold"
            >
              <LogIn className="mr-2 h-5 w-5" /> Sign In with Google
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
