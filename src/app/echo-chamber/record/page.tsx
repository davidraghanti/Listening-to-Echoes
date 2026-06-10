
"use client"

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Square, Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function RecordEchoPage() {
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [saving, setSaving] = useState(false);
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleToggleRecording = () => {
    if (recording) {
      setRecording(false);
      setRecorded(true);
    } else {
      setRecording(true);
      setRecorded(false);
    }
  };

  const handleSave = async () => {
    if (!db) return;
    setSaving(true);
    
    // In a real app, we would upload audio file to Storage
    // For MVP, we save a placeholder with a generated title
    const storyData = {
      title: "Audio Echo " + new Date().toLocaleTimeString(),
      content: "A spoken recollection captured in the Echo Chamber. [Awaiting full transcription]",
      submittedAt: new Date().toISOString(),
      status: 'pending',
      tone: 50,
      tags: ['audio-submission', 'echo-chamber'],
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    };

    try {
      await addDoc(collection(db, 'stories'), storyData);
      toast({
        title: "Echo Captured",
        description: "Your voice has been added to the queue for archiving."
      });
      router.push('/echo-chamber');
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-xl">
        <Link href="/echo-chamber" className="text-white/20 hover:text-white/40 flex items-center gap-2 mb-8 text-xs uppercase tracking-widest transition-colors">
          <ArrowLeft className="h-3 w-3" /> Back to Chamber
        </Link>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-white/80 font-headline">Capture Your Voice</CardTitle>
            <p className="text-white/20 text-xs">Speak your truth. We redact breadcrumbs. You remain an echo.</p>
          </CardHeader>
          <CardContent className="space-y-12 py-12">
            <div className="flex justify-center">
              <button 
                onClick={handleToggleRecording}
                disabled={saving}
                className={`h-32 w-32 rounded-full flex items-center justify-center transition-all ${recording ? 'bg-red-500/20 animate-pulse' : 'bg-white/5 hover:bg-white/10'}`}
              >
                {recording ? (
                  <Square className="h-10 w-10 text-red-500 fill-red-500" />
                ) : (
                  <Mic className="h-12 w-12 text-white/40" />
                )}
              </button>
            </div>

            <div className="text-center space-y-4">
              <p className="text-white/40 font-mono text-sm">
                {recording ? "Recording audio..." : recorded ? "Recollection captured" : "Ready to listen"}
              </p>
              
              {recorded && (
                <div className="animate-in fade-in slide-in-from-bottom-2 flex justify-center gap-4 pt-4">
                  <Button variant="outline" onClick={() => setRecorded(false)} className="border-white/10 text-white/40 hover:bg-white/5 rounded-full">
                    Discard
                  </Button>
                  <Button onClick={handleSave} disabled={saving} className="bg-accent/20 text-accent hover:bg-accent/30 rounded-full px-8">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Echo
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
