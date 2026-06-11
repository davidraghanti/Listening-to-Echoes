"use client"

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Story } from '@/lib/types';
import { EchoVisualizer } from '@/components/EchoVisualizer';
import { ArrowRight, Mic, Volume2, VolumeX, Activity } from 'lucide-react';
import Link from 'next/link';

export default function EchoChamberPage() {
  const db = useFirestore();
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [toneValue, setToneValue] = useState([50]);
  const [hasEngaged, setHasEngaged] = useState(false);
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

  // Sync playback rate and background color with slider position
  useEffect(() => {
    if (audioRef.current) {
      // Scale frequency rate: 0 -> 0.5x, 100 -> 1.5x
      audioRef.current.playbackRate = 0.5 + (toneValue[0] / 100);
      audioRef.current.volume = isAudioMuted ? 0 : 0.2 + (toneValue[0] / 200); 
    }

    // Dynamic background calculation: rgb(10,10,10) to rgb(60,60,60)
    const grayValue = 10 + (toneValue[0] * 0.5);
    document.documentElement.style.setProperty('--chamber-bg', `rgb(${grayValue}, ${grayValue}, ${grayValue})`);
  }, [toneValue, isAudioMuted]);

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
          }, 5000); 
        }
      }, 40);
    }
    return () => { if (textIntervalRef.current) clearInterval(textIntervalRef.current); };
  }, [stories, activeStoryIdx]);

  const handleSliderEngagement = (val: number[]) => {
    setToneValue(val);
    if (!hasEngaged && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio engagement failed", e));
      setHasEngaged(true);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsAudioMuted(audioRef.current.muted);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col overflow-hidden selection:bg-white/5 transition-colors duration-500 ease-out"
      style={{ backgroundColor: 'var(--chamber-bg, rgb(10,10,10))' }}
    >
      <Navbar />
      
      <audio 
        ref={audioRef}
        id="ambient-loop" 
        loop 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      />

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="absolute inset-0 z-0">
           <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] blur-[160px] animate-pulse pointer-events-none transition-colors duration-1000" 
            style={{ 
              background: `radial-gradient(circle, hsl(var(--accent) / ${0.02 + (toneValue[0] / 1000)}) 0%, transparent 70%)` 
            }}
           />
        </div>

        <div className="z-10 w-full max-w-4xl space-y-16">
          {stories && stories.length > 0 ? (
            <div className="space-y-16 text-center">
              <div className="min-h-[320px] flex items-center justify-center px-4">
                <p 
                  className="text-xl md:text-3xl font-headline leading-relaxed max-w-3xl mx-auto italic transition-all duration-1000 tracking-widest font-light"
                  style={{ color: `rgba(255, 255, 255, ${0.05 + (toneValue[0] / 1500)})` }}
                >
                  {displayText}
                  <span className="animate-pulse inline-block w-1 h-6 ml-1 bg-white/10" />
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-4 px-8">
                <div className="flex justify-between text-[8px] uppercase tracking-[0.5em] text-white/20 font-mono">
                  <span>Warm</span>
                  <span className="flex items-center gap-2"><Activity className="h-3 w-3" /> Resonant Tone</span>
                  <span>Synthetic</span>
                </div>
                
                <Slider 
                  id="matrix-slider"
                  value={toneValue} 
                  onValueChange={handleSliderEngagement} 
                  max={100} 
                  step={1} 
                  className="opacity-40 hover:opacity-100 transition-opacity"
                />

                <div id="slider-feedback" className="text-[7px] text-white/10 font-mono uppercase tracking-[0.2em]">
                  Active Matrix Position: {toneValue[0]}% | Frequency: {(0.5 + toneValue[0]/100).toFixed(2)}x
                </div>
              </div>

              <div 
                className="grayscale contrast-150 transition-all duration-500"
                style={{ opacity: 0.05 + (toneValue[0] / 1000), transform: `scale(${1 + toneValue[0]/200})` }}
              >
                <EchoVisualizer />
              </div>

              <div className="flex flex-col items-center gap-10">
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
    </div>
  );
}
