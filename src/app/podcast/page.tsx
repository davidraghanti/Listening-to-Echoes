
"use client"

import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rss, Mic, ExternalLink, Headphones } from 'lucide-react';

export default function PodcastPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center space-y-6 mb-16">
          <div className="h-20 w-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto">
            <Mic className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold font-headline text-accent">Archival Broadcast</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The Listening to Echoes podcast synthesizes qualitative human encounters into sonic reflections for asynchronous professional development.
          </p>
        </div>

        <div className="grid gap-8">
          <Card className="bg-card/50 border-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rss className="h-5 w-5 text-accent" />
                Podcast Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Subscribe to our qualitative feed to receive new reflections directly in your preferred podcast player.
              </p>
              <div className="p-4 bg-muted/20 rounded-lg flex items-center justify-between gap-4">
                <code className="text-[10px] text-accent font-mono break-all">
                  https://listening-to-echoes.web.app/podcast/rss.xml
                </code>
                <Button asChild size="sm" variant="outline" className="shrink-0 h-8 border-accent text-accent">
                  <a href="/podcast/rss.xml" target="_blank">
                    Open XML <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 bg-accent/10 rounded flex items-center justify-center text-accent">
                <Headphones className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">A Reflective Experience</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every episode is generated from approved archival threads. We respect the silence between the words, ensuring that each broadcast maintains the dignity of the original encounter.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
