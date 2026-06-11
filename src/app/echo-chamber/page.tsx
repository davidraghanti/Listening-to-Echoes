
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
      limit(10)
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
          }, 4000);
        }
      }, 40);
    }
    return () => { if (textIntervalRef.current) clearInterval(textIntervalRef.current); };
  }, [stories, activeStoryIdx]);

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-hidden selection:bg-white/10">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {/* Atmosphere */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-gradient from-accent/5 to-transparent blur-[120px] animate-pulse" />
        </div>

        <div className="z-10 w-full max-w-4xl space-y-16">
          {stories && stories.length > 0 ? (
            <div className="space-y-24 text-center">
              <div className="min-h-[240px] flex items-center justify-center">
                <p className="text-xl md:text-2xl font-headline text-white/10 leading-relaxed max-w-2xl mx-auto italic transition-all duration-1000 tracking-wide">
                  {displayText}
                </p>
              </div>

              <div className="opacity-40 grayscale contrast-150">
                <EchoVisualizer />
              </div>

              <div className="flex flex-col items-center gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.8em] text-white/10 font-mono">
                    Echo Layer {activeStoryIdx + 1}
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.4em] text-white/5 font-mono">
                    Synthesizing shared historical threads
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="outline" className="border-white/5 text-white/20 hover:bg-white/5 hover:text-white/40 rounded-full px-10 transition-all border-dashed">
                    <Link href="/echo-chamber/record">
                      <Mic className="h-4 w-4 mr-2" /> Spoken Recollection
                    </Link>
                  </Button>
                  <Button asChild className="bg-white/5 text-white/40 hover:bg-white/10 rounded-full px-10 border border-white/5">
                    <Link href="/archive">
                      Enter Archive <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-8">
              <div className="relative inline-block">
                <VolumeX className="h-20 w-20 text-white/5 mx-auto" />
                <div className="absolute inset-0 animate-ping bg-white/5 rounded-full blur-xl" />
              </div>
              <p className="text-white/20 font-headline text-2xl tracking-widest uppercase">The chamber is silent...</p>
              <Button asChild className="bg-accent/10 text-accent hover:bg-accent/20 rounded-full px-12 border border-accent/20">
                <Link href="/submit">Be the first echo</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <style jsx global>{`
        .bg-radial-gradient {
          background: radial-gradient(circle, var(--tw-gradient-from) 0%, transparent 70%);
        }
      `}</style>
    </div>
  );
}
