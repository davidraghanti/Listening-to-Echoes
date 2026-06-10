
"use client"

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState([50]);
  const db = useFirestore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const storyData = {
      title: formData.get('title') as string,
      content: formData.get('story') as string,
      tone: tone[0],
      status: 'pending',
      tags: [],
      submittedAt: new Date().toISOString(),
      piiDetected: false,
    };

    const storiesRef = collection(db, 'stories');
    addDoc(storiesRef, storyData)
      .then(() => {
        setSubmitted(true);
        setLoading(false);
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: 'stories',
          operation: 'create',
          requestResourceData: storyData,
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="mx-auto w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-3xl font-bold font-headline">Recollection Received</h1>
            <p className="text-muted-foreground">
              Thank you for sharing your journey. Our librarians will review your submission for privacy before it is added to the archive.
            </p>
            <Button asChild className="w-full bg-accent text-background hover:bg-accent/90 rounded-full">
              <a href="/archive">Back to Archive</a>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold font-headline text-accent">Share Your Echo</h1>
          <p className="text-muted-foreground">
            Contribute your written or spoken experience. All entries are reviewed for privacy before publishing.
          </p>
        </div>

        <Card className="bg-card/50 border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
              Privacy Assurance
            </CardTitle>
            <CardDescription>
              We automatically flag sensitive details. Librarians redact "breadcrumbs" before your story goes live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="title">Title of your recollection</Label>
                <Input id="title" name="title" placeholder="e.g., The Lunchroom Divide" required className="bg-muted/20 border-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="story">Your Story</Label>
                <Textarea 
                  id="story" 
                  name="story"
                  placeholder="Describe your educational experience in your own words..." 
                  className="min-h-[200px] bg-muted/20 leading-relaxed border-muted" 
                  required
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    Resonant Tone
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </Label>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {tone[0]}% {tone[0] < 50 ? 'Warm/White' : 'Dark/Synthetic'}
                  </span>
                </div>
                <Slider 
                  value={tone} 
                  onValueChange={setTone} 
                  max={100} 
                  step={1} 
                  className="py-4"
                />
                <div className="flex justify-between text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span>High Tone</span>
                  <span>Base Tone</span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-accent text-background hover:bg-accent/90 text-lg font-semibold rounded-full"
                disabled={loading}
              >
                {loading ? "Securing Entry..." : "Submit to Archive"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
