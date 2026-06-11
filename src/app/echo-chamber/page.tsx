
"use client"

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Story } from '@/lib/types';
import { EchoVisualizer } from '@/components/EchoVisualizer';
import { ArrowRight, Mic, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';

export default function EchoChamberPage() {
  const db = useFirestore();
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const textIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
          }, 5000); // Pause on finished text before rotating
        }
      }, 40);
    }
    return () => { if (textIntervalRef.current) clearInterval(textIntervalRef.current); };
  }, [stories, activeStoryIdx]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsAudioMuted(audioRef.current.muted);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-hidden selection:bg-white/5">
      <Navbar />
      
      {/* Fallback Ambient Audio Loop */}
      <audio 
        ref={audioRef}
        id="ambient-loop" 
        autoPlay 
        loop 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      />

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {/* Extreme Dark Atmosphere */}
        <div className="absolute inset-0 z-0 bg-black">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-radial-gradient from-accent/5 to-transparent blur-[160px] animate-pulse pointer-events-none" />
        </div>

        <div className="z-10 w-full max-w-4xl space-y-16">
          {stories && stories.length > 0 ? (
            <div className="space-y-20 text-center">
              {/* The Text-Based Tapestry */}
              <div className="min-h-[320px] flex items-center justify-center px-4">
                <p className="text-xl md:text-3xl font-headline text-white/5 leading-relaxed max-w-3xl mx-auto italic transition-all duration-1000 tracking-widest font-light">
                  {displayText}
                  <span className="animate-pulse inline-block w-1 h-6 ml-1 bg-white/10" />
                </p>
              </div>

              {/* Shifting Sound Bar Display */}
              <div className="opacity-10 grayscale contrast-150 scale-125 hover:opacity-20 transition-opacity">
                <EchoVisualizer />
              </div>

              <div className="flex flex-col items-center gap-12">
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.8em] text-white/5 font-mono">
                    Echo Streamed: Layer {activeStoryIdx + 1}
                  </p>
                  <p className="text-[7px] uppercase tracking-[0.4em] text-white/5 font-mono">
                    Conserving Qualitative Human Encounters
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <Button asChild variant="outline" className="border-white/5 text-white/10 hover:bg-white/5 hover:text-white/30 rounded-full px-12 transition-all border-dashed bg-transparent">
                    <Link href="/echo-chamber/record">
                      <Mic className="h-4 w-4 mr-2" /> Spoken Recollection
                    </Link>
                  </Button>
                  <Button asChild className="bg-white/5 text-white/20 hover:bg-white/10 rounded-full px-12 border border-white/5">
                    <Link href="/archive">
                      Enter Archive <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-12 py-20">
              <div className="relative inline-block">
                <VolumeX className="h-24 w-24 text-white/5 mx-auto" />
                <div className="absolute inset-0 animate-pulse bg-white/5 rounded-full blur-3xl" />
              </div>
              <div className="space-y-4">
                <p className="text-white/10 font-headline text-3xl tracking-[0.2em] uppercase font-light">The chamber is silent</p>
                <p className="text-white/5 text-xs font-mono tracking-widest uppercase">Waiting for the first archival thread</p>
              </div>
              <Button asChild className="bg-accent/5 text-accent/40 hover:bg-accent/10 rounded-full px-16 border border-accent/10 h-14 text-lg">
                <Link href="/submit">Contribute an Echo</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Audio Controls */}
        <div className="absolute bottom-8 right-8 z-20">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMute} 
            className="text-white/10 hover:text-white/30 hover:bg-transparent"
          >
            {isAudioMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
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
