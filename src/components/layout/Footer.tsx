
"use client"

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Info, Scale, Rss, HeartPulse } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="bg-card mt-auto border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Mission Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo iconClassName="h-8" />
              <h3 className="font-headline font-bold text-xl uppercase tracking-tighter">Listening to Echoes</h3>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold flex items-center gap-2 text-accent">
                <Info className="h-4 w-4" /> Our Mission
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Welcome to a digital curation site dedicated to conserving qualitative human encounters. This platform functions as a protected repository where your accomplishments, tribulations, and reflections on the academic learning environment are cataloged over time.
              </p>
            </div>
          </div>

          {/* Podcast Section */}
          <div className="space-y-6">
            <h4 className="font-bold flex items-center gap-2 text-accent">
              <Rss className="h-4 w-4" /> RSS Feed & Podcast
            </h4>
            <div className="flex gap-4 items-start">
              <div className="shrink-0 w-24 h-24 bg-black rounded-lg flex items-center justify-center border border-muted p-2" aria-label="Podcast Logo">
                <Logo iconClassName="h-16" />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Direct link to the Podcast feed and archives for the Listening to Echoes podcast.
                </p>
                <Link href="/podcast/rss.xml" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                  RSS XML Feed <Rss className="h-3 w-3" />
                </Link>
                <Link href="/podcast" className="text-xs block text-muted-foreground hover:text-accent transition-colors">
                  Podcast Information
                </Link>
              </div>
            </div>
          </div>

          {/* Crisis Section */}
          <div className="space-y-6 bg-accent/5 p-6 rounded-2xl border border-accent/20">
            <h4 className="font-bold flex items-center gap-2 text-accent">
              <HeartPulse className="h-4 w-4" /> Immediate Support
            </h4>
            <p className="text-xs text-muted-foreground italic">
              Reach out 24/7 if you are feeling overwhelmed:
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-background/50 rounded-md border border-muted">
                <span className="text-xs font-semibold">Crisis Lifeline</span>
                <span className="text-xs font-mono font-bold text-accent">988</span>
              </div>
            </div>
            <Link href="/resources" className="text-xs text-accent hover:underline flex items-center gap-1 justify-center">
              View all resources <Info className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <Separator className="my-12 opacity-50" />

        <div className="mt-16 pt-8 border-t border-muted flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            © 2026 Listening to Echoes | Qualitative Research Platform
          </p>
          <div className="flex gap-6">
             <Link href="/about" className="text-[10px] text-muted-foreground hover:text-accent uppercase tracking-widest">About</Link>
             <Link href="/resources" className="text-[10px] text-muted-foreground hover:text-accent uppercase tracking-widest">Support</Link>
             <Link href="/librarian" className="text-[10px] text-muted-foreground hover:text-accent uppercase tracking-widest">Internal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
