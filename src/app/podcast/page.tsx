
"use client"

import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rss, Mic, ExternalLink, Headphones, PlayCircle, Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Story } from '@/lib/types';
import { firebaseConfig } from '@/firebase/config';
import { format } from 'date-fns';

export default function PodcastPage() {
  const db = useFirestore();

  const podcastQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'stories'),
      where('status', '==', 'approved'),
      // Only show stories that have audio linked
      where('audioUrl', '!=', '')
    );
  }, [db]);

  const { data: episodes, loading } = useCollection<Story>(podcastQuery);

  const resolveAudioUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `https://storage.googleapis.com/${firebaseConfig.audioBucketId}/${url}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center space-y-6 mb-16">
          <div className="h-20 w-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto">
            <Mic className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold font-headline text-accent">Archival Broadcast</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sonic reflections synthesized from approved archival threads.
          </p>
        </div>

        <div className="grid gap-12">
          {/* Feed Section */}
          <Card className="bg-card/50 border-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rss className="h-5 w-5 text-accent" />
                Qualitative Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted/20 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
                <code className="text-[10px] text-accent font-mono break-all bg-black/40 p-2 rounded flex-1 w-full md:w-auto">
                  https://listening-to-echoes.web.app/podcast/rss.xml
                </code>
                <Button asChild size="sm" variant="outline" className="shrink-0 h-10 border-accent text-accent">
                  <a href="/podcast/rss.xml" target="_blank">
                    Open XML <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Episodes */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-headline flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-accent" /> Recent Episodes
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : episodes && episodes.length > 0 ? (
              <div className="grid gap-4">
                {episodes.map(episode => (
                  <Card key={episode.id} className="bg-card/30 border-muted group hover:border-accent/30 transition-all">
                    <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                        <Headphones className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between">
                          <h3 className="font-bold group-hover:text-accent transition-colors">{episode.title}</h3>
                          <span className="text-[10px] text-muted-foreground uppercase font-mono">
                            {episode.submittedAt ? format(new Date(episode.submittedAt), 'MMM d, yyyy') : 'Recently'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-4">{episode.content}</p>
                        <audio controls className="w-full h-8 grayscale opacity-50 hover:opacity-100 transition-opacity">
                          <source src={resolveAudioUrl(episode.audioUrl)!} type="audio/mpeg" />
                        </audio>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-muted rounded-xl bg-muted/5">
                <p className="text-sm text-muted-foreground italic">No archival recordings have been published yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
