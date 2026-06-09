"use client"

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Upload, CheckCircle2 } from 'lucide-react';

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6 fade-in">
            <div className="mx-auto w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-3xl font-bold font-headline">Recollection Received</h1>
            <p className="text-muted-foreground">
              Thank you for sharing your journey. Our librarians will review your submission for privacy before it is added to the archive.
            </p>
            <Button asChild className="w-full bg-accent text-background hover:bg-accent/90">
              <a href="/archive">Back to Archive</a>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold font-headline">Share Your Echo</h1>
          <p className="text-muted-foreground">
            Contribute your written or spoken experience. 
            All entries are reviewed for privacy before publishing.
          </p>
        </div>

        <Card className="bg-card/50 border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
              Privacy Assurance
            </CardTitle>
            <CardDescription>
              We automatically flag names, dates, and locations. 
              Librarians will redact these before your story goes live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title of your recollection</Label>
                <Input id="title" placeholder="e.g., The Lunchroom Divide" required className="bg-muted/20" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="story">Your Story</Label>
                <Textarea 
                  id="story" 
                  placeholder="Describe your educational experience in your own words..." 
                  className="min-h-[200px] bg-muted/20 leading-relaxed" 
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Audio Version (Optional)</Label>
                <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center hover:border-accent/40 transition-colors cursor-pointer group">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground group-hover:text-accent mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop audio file</p>
                  <p className="text-[10px] text-muted-foreground mt-1">MP3, WAV or M4A (Max 10MB)</p>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-accent text-background hover:bg-accent/90 text-lg font-semibold"
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