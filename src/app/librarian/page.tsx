
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ShieldCheck, Tag, Check, X, Sparkles, UserRound, MapPin, Calendar, Lock, Loader2, Info } from 'lucide-react';
import { detectPiiInStory, LibrarianPiiDetectionOutput } from '@/ai/flows/librarian-pii-detection';
import { librarianAutomatedTaggingAndTrends, LibrarianAutomatedTaggingAndTrendsOutput } from '@/ai/flows/librarian-automated-tagging-and-trends-flow';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Story } from '@/lib/types';

export default function LibrarianDashboard() {
  const { user, profile, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  
  const pendingQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'stories'),
      where('status', '==', 'pending'),
      orderBy('submittedAt', 'desc')
    );
  }, [db]);

  const { data: pendingStories, loading: storiesLoading } = useCollection<Story>(pendingQuery);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{
    pii: LibrarianPiiDetectionOutput | null;
    tags: LibrarianAutomatedTaggingAndTrendsOutput | null;
    loading: boolean;
  }>({ pii: null, tags: null, loading: false });

  const activeStory = pendingStories?.find(s => s.id === selectedStoryId);

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'librarian')) {
      router.push('/login');
    }
  }, [user, profile, authLoading, router]);

  const runAiAnalysis = async (text: string) => {
    setAiAnalysis({ pii: null, tags: null, loading: true });
    try {
      const [piiResult, tagsResult] = await Promise.all([
        detectPiiInStory({ storyText: text }),
        librarianAutomatedTaggingAndTrends({ storyText: text })
      ]);
      setAiAnalysis({ pii: piiResult, tags: tagsResult, loading: false });
    } catch (error) {
      console.error(error);
      setAiAnalysis({ pii: null, tags: null, loading: false });
    }
  };

  const handleApprove = async (id: string) => {
    if (!db) return;
    const docRef = doc(db, 'stories', id);
    // Combine suggested tags with AI tags for final approval
    const finalTags = Array.from(new Set([
      ...(activeStory?.tags || []),
      ...(aiAnalysis.tags?.thematicTags || [])
    ]));

    await updateDoc(docRef, { 
      status: 'approved',
      tags: finalTags,
      piiDetected: aiAnalysis.pii?.hasPii || false
    });
    setSelectedStoryId(null);
    setAiAnalysis({ pii: null, tags: null, loading: false });
  };

  const handleReject = async (id: string) => {
    if (!db) return;
    const docRef = doc(db, 'stories', id);
    await updateDoc(docRef, { status: 'rejected' });
    setSelectedStoryId(null);
    setAiAnalysis({ pii: null, tags: null, loading: false });
  };

  if (authLoading || !user || profile?.role !== 'librarian') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto animate-pulse" />
          <h2 className="text-xl font-headline font-bold">Verifying Credentials...</h2>
        </div>
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
            {storiesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : pendingStories && pendingStories.length > 0 ? (
              pendingStories.map(story => (
                <Card 
                  key={story.id} 
                  className={`cursor-pointer transition-all ${selectedStoryId === story.id ? 'border-accent bg-accent/5' : 'border-muted hover:border-muted-foreground'}`}
                  onClick={() => {
                    setSelectedStoryId(story.id);
                    runAiAnalysis(story.content);
                  }}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-md font-headline line-clamp-1">{story.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">Submitted {story.submittedAt ? format(new Date(story.submittedAt), 'MMM d, yyyy') : 'unknown date'}</p>
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
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/20 p-2 rounded">
                       <span className="flex items-center gap-1"><Info className="h-3 w-3" /> User-assigned Tone: {activeStory.tone}%</span>
                       <span>Submitted: {format(new Date(activeStory.submittedAt), 'PPp')}</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                      {activeStory.content}
                    </p>
                    
                    {activeStory.tags.length > 0 && (
                      <div className="pt-4 border-t border-muted/30">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">User Suggested Labels:</p>
                        <div className="flex flex-wrap gap-2">
                          {activeStory.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px] border-muted">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
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
                              {item.type === 'NAME' && <UserRound className="h-3 w-3" />}
                              {item.type === 'LOCATION' && <MapPin className="h-3 w-3" />}
                              {item.type === 'DATE' && <Calendar className="h-3 w-3" />}
                              <span className="font-medium text-xs uppercase">{item.type}:</span>
                              <span className="text-xs">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">No sensitive info detected.</p>
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
                            <Badge key={idx} variant="secondary" className="bg-primary/20 text-accent border-none text-[10px] uppercase">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">Pending analysis.</p>
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
                  Choose an entry from the queue to perform PII screening and metadata tagging.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
