"use client"

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { INITIAL_STORIES } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Volume2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const approvedStories = INITIAL_STORIES.filter(s => s.status === 'approved');
  
  const filteredStories = approvedStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         story.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || story.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(approvedStories.flatMap(s => s.tags)));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12 space-y-6">
          <h1 className="text-4xl font-bold font-headline text-accent">The Archive</h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse approved recollections of triumphs and tribulations in education. 
            This space is designed for reflection, not reaction.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search stories..." 
                className="pl-10 h-12 bg-muted/30 border-muted rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedTag === null ? "default" : "outline"} 
              className="cursor-pointer px-4 py-1 rounded-full text-xs"
              onClick={() => setSelectedTag(null)}
            >
              All
            </Badge>
            {allTags.map(tag => (
              <Badge 
                key={tag} 
                variant={selectedTag === tag ? "default" : "outline"} 
                className="cursor-pointer px-4 py-1 rounded-full text-xs"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {filteredStories.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-xl border-muted">
            <p className="text-muted-foreground">No stories found matching your criteria.</p>
          </div>
        ) : (
          <div className="archive-grid">
            {filteredStories.map((story) => (
              <Card key={story.id} className="bg-card/50 border-muted/30 flex flex-col h-full hover:border-accent/40 transition-colors group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {format(new Date(story.submittedAt), 'MMMM d, yyyy')}
                    </span>
                    {story.audioUrl ? (
                      <Volume2 className="h-4 w-4 text-accent" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <CardTitle className="font-headline text-xl leading-snug group-hover:text-accent transition-colors">
                    {story.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed">
                    {story.content}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 flex flex-wrap gap-1">
                  {story.tags.map(tag => (
                    <span key={tag} className="text-[10px] text-accent/70 uppercase">#{tag}</span>
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}