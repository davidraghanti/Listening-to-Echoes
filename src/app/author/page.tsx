
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ARCHIVE_POSTS } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, PenTool, Mic, Plus, FileText, BarChart2, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { useUser } from '@/firebase';

const trendingTopics = [
  { name: 'Classroom Invisibility', count: 42 },
  { name: 'Parental Pressure', count: 28 },
  { name: 'Late-Night Study Groups', count: 19 },
  { name: 'Standardized Testing Anxiety', count: 15 },
];

export default function AuthorDashboard() {
  const { user, profile, loading: authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'author')) {
      router.push('/login');
    }
  }, [user, profile, authLoading, router]);

  if (authLoading || !user || profile?.role !== 'author') {
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
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold font-headline text-accent">Author Lab</h1>
            <p className="text-muted-foreground">Synthesizing the collective echoes into insightful media.</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-accent text-background hover:bg-accent/90 rounded-full px-6">
              <Plus className="h-4 w-4 mr-2" /> New Podcast
            </Button>
            <Button variant="outline" className="rounded-full px-6 border-muted-foreground/30">
              <Plus className="h-4 w-4 mr-2" /> New Article
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Trending Panel */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Insights
            </h2>
            <Card className="bg-card border-muted overflow-hidden">
               <div className="p-4 bg-primary/20 border-b border-muted">
                 <h3 className="font-headline font-bold text-accent flex items-center gap-2">
                   <BarChart2 className="h-4 w-4" /> Trending Echoes
                 </h3>
               </div>
               <div className="p-0">
                 {trendingTopics.map((topic, i) => (
                   <div key={i} className="flex justify-between items-center p-4 border-b border-muted/30 last:border-0 hover:bg-muted/10 transition-colors">
                      <span className="text-sm">{topic.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{topic.count}</Badge>
                   </div>
                 ))}
               </div>
            </Card>
            
            <Card className="bg-accent/5 border-accent/20 p-4">
               <p className="text-xs text-accent leading-relaxed italic">
                 "A surge in 'isolation' tags suggests a thematic opportunity for a new podcast episode."
               </p>
            </Card>
          </div>

          {/* Published/Draft Content */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <PenTool className="h-4 w-4" /> Creative Output
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {ARCHIVE_POSTS.map(post => (
                <Card key={post.id} className="bg-card/50 border-muted flex flex-col group hover:border-accent/40 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] text-muted-foreground font-mono">
                         {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                       </span>
                       {post.type === 'podcast' ? (
                         <Mic className="h-4 w-4 text-accent" />
                       ) : (
                         <FileText className="h-4 w-4 text-muted-foreground" />
                       )}
                    </div>
                    <CardTitle className="font-headline text-lg group-hover:text-accent transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 flex flex-wrap gap-1">
                    {post.relatedTags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-[9px] border-muted px-2 py-0 uppercase">
                        {tag}
                      </Badge>
                    ))}
                  </CardFooter>
                </Card>
              ))}
              
              {/* Draft Placeholder */}
              <div className="border-2 border-dashed border-muted rounded-xl flex items-center justify-center p-8 bg-muted/5 group hover:bg-muted/10 cursor-pointer transition-all">
                <div className="text-center">
                  <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2 group-hover:text-accent group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-headline text-muted-foreground font-medium">New Reflection Piece</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
