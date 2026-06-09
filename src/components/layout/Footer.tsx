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
              <p className="text-sm text-muted-foreground leading-relaxed">
                We believe that the nuances of the academic journey deserve to be preserved, studied, and honored without being distorted by the noise of the modern internet.
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
                  Direct link to the Podcast feed and archives for the Listening to Echoes podcast, with archived transcripts for each episode. 
                </p>
                <Link href="/podcast" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                  Access Archive & Feed <Rss className="h-3 w-3" />
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
              If you are feeling overwhelmed or in crisis, you do not have to carry this weight alone. Reach out 24/7:
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-background/50 rounded-md border border-muted">
                <span className="text-xs font-semibold">Crisis Lifeline</span>
                <span className="text-xs font-mono font-bold text-accent">988</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-background/50 rounded-md border border-muted">
                <span className="text-xs font-semibold">Crisis Text Line</span>
                <span className="text-xs font-mono font-bold text-accent">HOME to 741741</span>
              </div>
            </div>
            <Link href="/resources" className="text-xs text-accent hover:underline flex items-center gap-1 justify-center">
              View all resources <Info className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <Separator className="my-12 opacity-50" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Privacy & Anti-Social Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="font-headline font-bold text-lg">A Different Kind of Digital Space</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are intentionally built to be the antidote to traditional social media. No Likes, No Shares, No Trends. We focus solely on the connection between the writer's experience and the listener's heart.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-headline font-bold text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" /> Privacy & Anonymity
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Zero tracking. No Identity Anchors. Qualitative Review. Every submission is scrubbed of technical data and hidden identifiers before archiving. Speak your truth, but leave no breadcrumbs behind.
              </p>
            </div>
          </div>

          {/* Legal / Terms Accordion */}
          <div className="space-y-4">
            <h4 className="font-headline font-bold text-lg flex items-center gap-2">
              <Scale className="h-5 w-5 text-accent" /> Terms & Policies
            </h4>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="terms" className="border-muted">
                <AccordionTrigger className="text-sm">Terms of Use (June 2026)</AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground space-y-4 max-h-[300px] overflow-y-auto pr-4">
                  <p>1. Purpose: Listening to Echoes is a protected digital repository for conserving qualitative human encounters, free from social media metrics.</p>
                  <p>2. No-Naming Policy: You strictly agree not to name or uniquely identify any outside individuals, faculty, students, or organizations.</p>
                  <p>3. Right to Edit: We reserve the right to review, reject, or edit submissions to remove "breadcrumbs" before publication.</p>
                  <p>4. License: You retain ownership but grant us an irrevocable license to archive and display your Echo for educational purposes.</p>
                  <p>5. Disclaimer: Views expressed belong solely to anonymous contributors and do not constitute legal or medical advice.</p>
                  <p>6. Malicious Misuse: Attempts to reverse-engineer identities or scrape data will result in a permanent ban.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="anonymity" className="border-muted">
                <AccordionTrigger className="text-sm">Anonymity Guidelines</AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground space-y-2">
                  <p>To ensure your anonymity remains ironclad, please avoid mentioning:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Highly unique circumstances or project titles</li>
                    <li>Specific grant names or niche research topics</li>
                    <li>Unique geographic markers or distinct dates</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-muted flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            © 2024 Listening to Echoes | Qualitative Research Platform
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
