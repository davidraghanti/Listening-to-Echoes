
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, ShieldCheck, Tag, Check, X, Sparkles, Lock, Loader2, Info, Mic, AlertTriangle, ShieldAlert } from 'lucide-react';
import { detectPiiInStory, LibrarianPiiDetectionOutput } from '@/ai/flows/librarian-pii-detection';
import { librarianAutomatedTaggingAndTrends, LibrarianAutomatedTaggingAndTrendsOutput } from '@/ai/flows/librarian-automated-tagging-and-trends-flow';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Story } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function LibrarianDashboard() {
  const { user, profile, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [audioUrl, setAudioUrl] = useState('');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{
    pii: LibrarianPiiDetectionOutput | null;
    tags: LibrarianAutomatedTaggingAndTrendsOutput | null;
    loading: boolean;
  }>({ pii: null, tags: null, loading: false });

  // Query pending stories - Note: This requires a composite index on (status, submittedAt)
  const pendingQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'stories'),
      where('status', '==', 'pending'),
      orderBy('submittedAt', 'desc')
    );
  }, [db]);

  const { data: pendingStories, loading: storiesLoading, error: storiesError } = useCollection<Story>(pendingQuery);
  const activeStory = pendingStories?.find(s => s.id === selectedStoryId);

  // Run AI Analysis when a story is selected
  useEffect(() => {
    if (activeStory) {
      runAiAnalysis(activeStory.content);
      setAudioUrl(activeStory.audioUrl || '');
    }
  }, [selectedStoryId]);

  const runAiAnalysis = async (text: string) => {
    setAiAnalysis({ pii: null, tags: null, loading: true });
    try {
      const [piiResult, tagsResult] = await Promise.all([
        detectPiiInStory({ storyText: text }),
        librarianAutomatedTaggingAndTrends({ storyText: text })
      ]);
      setAiAnalysis({ pii: piiResult, tags: tagsResult, loading: false });
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setAiAnalysis({ pii: null, tags: null, loading: false });
    }
  };

  const handleApprove = (id: string) => {
    if (!db) return;
    const docRef = doc(db, 'stories', id);
    const finalTags = Array.from(new Set([
      ...(activeStory?.tags || []),
      ...(aiAnalysis.tags?.thematicTags || [])
    ]));

    const updateData = { 
      status: 'approved',
      tags: finalTags,
      piiDetected: aiAnalysis.pii?.hasPii || false,
      audioUrl: audioUrl.trim() || null
    };

    updateDoc(docRef, updateData)
      .then(() => {
        toast({
          title: "Echo Approved",
          description: "Story has been permanently archived."
        });
        setSelectedStoryId(null);
      })
      .catch(async (err) => {
        const pError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: updateData
        });
        errorEmitter.emit('permission-error', pError);
      });
  };

  const handleReject = (id: string) => {
    if (!db) return;
    const docRef = doc(db, 'stories', id);
    const updateData = { status: 'rejected' };
    
    updateDoc(docRef, updateData)
      .then(() => {
        toast({ title: "Submission Rejected", description: "Entry removed from queue." });
        setSelectedStoryId(null);
      })
      .catch(async (err) => {
        const pError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: updateData
        });
        errorEmitter.emit('permission-error', pError);
      });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  // If user is not logged in or not a librarian
  if (!user || profile?.role !== 'librarian') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-destructive/20 bg-destructive/5">
            <CardHeader className="text-center">
              <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-2xl font-headline">Access Restricted</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground text-sm">
                You are currently signed in as <span className="text-foreground font-mono">{user?.email || 'Anonymous'}</span>. 
                This area is reserved for authorized Librarians.
              </p>
              {!user && (
                <Button asChild className="w-full bg-accent text-background">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Return Home</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold font-headline text-accent">Librarian Review</h1>
            <p className="text-muted-foreground">Ensuring anonymity and tagging the human experience.</p>
          </div>
          <Badge variant="outline" className="h-8 border-accent text-accent">
            {pendingStories?.length || 0} Pending Entries
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending List */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Queue
            </h2>
            
            {storiesError ? (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Queue Error</span>
                </div>
                <p className="text-xs leading-relaxed">
                  The pending queue requires a Firestore composite index. If you are the developer, click the link in your browser's console to create it.
                </p>
              </div>
            ) : storiesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : pendingStories && pendingStories.length > 0 ? (
              pendingStories.map(story => (
                <Card 
                  key={story.id} 
                  className={`cursor-pointer transition-all ${selectedStoryId === story.id ? 'border-accent bg-accent/5' : 'border-muted hover:border-muted-foreground'}`}
                  onClick={() => setSelectedStoryId(story.id)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-md font-headline line-clamp-1">{story.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Submitted {story.submittedAt ? format(new Date(story.submittedAt), 'MMM d, yyyy') : 'Recently'}
                    </p>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground italic text-sm">No pending stories at this time.</p>
            )}
          </div>

          {/* Review Area */}
          <div className="lg:col-span-2">
            {activeStory ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <Card className="bg-card/50 border-muted">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-muted">
                    <div>
                      <CardTitle className="text-2xl font-headline text-accent">{activeStory.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleReject(activeStory.id)}
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-accent text-background hover:bg-accent/90"
                        onClick={() => handleApprove(activeStory.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/20 p-2 rounded">
                       <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Tone: {activeStory.tone}%</span>
                       <span>Submitted: {activeStory.submittedAt ? format(new Date(activeStory.submittedAt), 'PPp') : 'Recently'}</span>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                        {activeStory.content}
                      </p>
                      
                      <div className="pt-6 border-t border-muted/30 space-y-4">
                        <Label className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
                          <Mic className="h-3 w-3" /> Link Archival Audio
                        </Label>
                        <Input 
                          placeholder="e.g., episode-001.mp3"
                          value={audioUrl}
                          onChange={(e) => setAudioUrl(e.target.value)}
                          className="bg-muted/30 border-muted text-xs h-10"
                        />
                        <p className="text-[10px] text-muted-foreground italic">
                          Filename from bucket 0e61b06faeaf
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* PII Detection */}
                  <Card className="border-muted bg-muted/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-accent" />
                        PII Scan Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      {aiAnalysis.loading ? (
                        <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                          <Sparkles className="h-4 w-4" /> Analyzing story...
                        </div>
                      ) : aiAnalysis.pii?.hasPii ? (
                        <div className="space-y-2">
                          {aiAnalysis.pii.detectedPii.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-2 py-1 rounded bg-destructive/10 text-destructive border border-destructive/20">
                              <span className="font-medium text-[10px] uppercase">{item.type}:</span>
                              <span className="text-[10px]">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic text-xs">No sensitive info detected.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tagging suggestions */}
                  <Card className="border-muted bg-muted/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Tag className="h-4 w-4 text-accent" />
                        AI Thematic Tagging
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      {aiAnalysis.loading ? (
                        <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                          <Sparkles className="h-4 w-4" /> Identifying themes...
                        </div>
                      ) : aiAnalysis.tags ? (
                        <div className="flex flex-wrap gap-2">
                          {aiAnalysis.tags.thematicTags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-primary/20 text-accent border-none text-[9px] uppercase">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic text-xs">Pending analysis.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-dashed border-muted rounded-xl bg-muted/5">
                <ShieldCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-headline font-semibold mb-2">Select a Submission</h3>
                <p className="text-muted-foreground max-w-xs">
                  Choose an entry to begin the qualitative review process.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
