"use client"

import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { GraduationCap, BookOpen, ShieldCheck, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center space-y-6 mb-16">
          <Logo iconClassName="h-24 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline">The Narrative Repository</h1>
          <p className="text-xl text-muted-foreground italic">
            "Every echo is a lesson waiting to be heard."
          </p>
        </div>

        <div className="grid gap-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-headline text-accent flex items-center gap-2">
              <GraduationCap className="h-6 w-6" /> Academic Roots
            </h2>
            <Card className="bg-card/50 border-muted">
              <CardContent className="pt-6">
                <p className="leading-relaxed text-muted-foreground">
                  This platform was developed as a capstone project for a <strong>Master's course in Developing Educational Courses for the Web</strong>. 
                  The objective was to create a digital environment that prioritizes qualitative human experience over quantitative metrics, exploring how asynchronous, 
                  anonymous storytelling can foster reflection and professional development in the academic sphere.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-headline text-accent flex items-center gap-2">
              <BookOpen className="h-6 w-6" /> Our Mission
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-bold">Conserving Encounters</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We function as a protected repository where accomplishments, tribulations, and reflections on the academic learning environment are cataloged over time.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Antidote to Social Media</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We are intentionally built to be the antidote to traditional social media—no likes, no shares, no trends. Stories stand on their own merit.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-headline text-accent flex items-center gap-2">
              <ShieldCheck className="h-6 w-6" /> Radical Anonymity
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              True reflection requires a space free from fear. We have built privacy into our architecture: zero tracking, no identity anchors, and qualitative review of every submission. 
              We scrub the technical breadcrumbs so you can speak your truth without compromise.
            </p>
          </section>

          <div className="pt-12 border-t border-muted text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              Made with <Heart className="h-4 w-4 text-accent fill-accent" /> for the future of educational reflection.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
