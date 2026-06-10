
"use client"

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Story } from '@/lib/types';
import { EchoVisualizer } from '@/components/EchoVisualizer';
import { ArrowRight, Mic, VolumeX } from 'lucide-react';
import Link from 'next/link';

export default function EchoChamberPage() {
  const db = useFirestore();
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const textIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const chamberQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'stories'),
      where('status', '==', 'approved'),
      limit(5)
    );
  }, [db]);

  const { data: stories } = useCollection<Story>(chamberQuery);

  useEffect(() => {
    if (stories && stories.length > 0) {
      const story = stories[activeStoryIdx];
      let currentText = "";
      let i = 0;
      
      setDisplayText('');
      if (textIntervalRef.current) clearInterval(textIntervalRef.current);

      textIntervalRef.current = setInterval(() => {
        if (i < story.content.length) {
          currentText += story.content[i];
          setDisplayText(currentText);
          i++;
        } else {
          clearInterval(textIntervalRef.current!);
          setTimeout(() => {
            setActiveStoryIdx((prev) => (prev + 1) % stories.length);
          }, 3000);
        }
      }, 50);
    }
    return () => { if (textIntervalRef.current) clearInterval(textIntervalRef.current); };
  }, [stories, activeStoryIdx]);

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {/* Atmosphere */}
        <div className="absolute inset-0 z-0 opacity-10">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-r from-accent/20 to-transparent blur-[120px] animate-pulse" />
        </div>

        <div className="z-10 w-full max-w-4xl space-y-12">
          {stories && stories.length > 0 ? (
            <div className="space-y-16 text-center">
              <div className="min-h-[200px] flex items-center justify-center">
                <p className="text-xl md:text-3xl font-headline text-white/10 leading-relaxed max-w-2xl mx-auto italic transition-opacity duration-1000">
                  {displayText}
                </p>
              </div>

              <EchoVisualizer />

              <div className="flex flex-col items-center gap-6">
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-mono">
                  Synthesizing Echo {activeStoryIdx + 1} of {stories.length}
                </p>
                <div className="flex gap-4">
                  <Button asChild variant="outline" className="border-white/10 text-white/40 hover:bg-white/5 rounded-full px-8">
                    <Link href="/echo-chamber/record">
                      <Mic className="h-4 w-4 mr-2" /> Record Your Echo
                    </Link>
                  </Button>
                  <Button asChild className="bg-white/5 text-white/60 hover:bg-white/10 rounded-full px-8">
                    <Link href="/archive">
                      Enter Archive <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <VolumeX className="h-16 w-16 text-white/5 mx-auto" />
              <p className="text-white/20 font-headline text-xl">The chamber is silent...</p>
              <Button asChild className="bg-accent/20 text-accent hover:bg-accent/30 rounded-full">
                <Link href="/submit">Be the first echo</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
