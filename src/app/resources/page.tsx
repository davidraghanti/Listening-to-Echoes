"use client"

import { Navbar } from '@/components/layout/Navbar';
import { RESOURCES } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartPulse, Phone, MessageSquare, ExternalLink } from 'lucide-react';

export default function ResourcesPage() {
  const categories = Array.from(new Set(RESOURCES.map(r => r.category)));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12 text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
            <HeartPulse className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold font-headline">Support Resources</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            If sharing your story or listening to others has brought up difficult emotions, 
            please know that help is available. You don't have to carry these echoes alone.
          </p>
        </div>

        <div className="space-y-12">
          {categories.map(category => (
            <div key={category} className="space-y-6">
              <h2 className="text-xl font-headline font-bold text-accent border-b border-muted pb-2">
                {category}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {RESOURCES.filter(r => r.category === category).map(resource => (
                  <Card key={resource.id} className="bg-card border-muted hover:border-accent/30 transition-colors">
                    <CardHeader>
                      <CardTitle className="font-headline text-lg">{resource.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-accent">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span className="text-lg font-mono font-bold">{resource.contact}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full text-xs font-semibold uppercase tracking-wider h-10 border-muted-foreground/30">
                        <MessageSquare className="h-3 w-3 mr-2" /> 
                        Connect with {resource.name}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-2xl bg-primary/10 border border-primary/20 text-center space-y-4">
          <h3 className="text-2xl font-headline font-bold">Emergency?</h3>
          <p className="text-muted-foreground">
            If you are in immediate danger to yourself or others, please call 
            your local emergency services or go to the nearest emergency room.
          </p>
          <Button className="bg-accent text-background hover:bg-accent/90 px-8">
            Global Crisis Resources <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
}