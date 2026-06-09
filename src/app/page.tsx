import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, HeartHandshake, Shield } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
             <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-primary/20 blur-[120px] rounded-full" />
             <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-accent/20 blur-[120px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <div className="mb-12 flex justify-center">
              <Logo iconClassName="h-32" showText className="animate-in fade-in zoom-in duration-1000" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-headline">
              Your Experience is the <span className="text-accent">Archive</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              A digital sanctuary for personal human experiences in education. 
              Share your triumphs and tribulations. Listen to the whispers of shared history.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full bg-accent hover:bg-accent/90 text-background font-semibold">
                <Link href="/archive">Enter Archive</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-muted-foreground/30 hover:bg-muted/30">
                <Link href="/submit" className="flex items-center gap-2">
                  Contribute Story <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-accent">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold font-headline">Privacy First</h3>
                <p className="text-muted-foreground">
                  Our librarians meticulously review every submission to redact personal details, 
                  ensuring a safe space for genuine reflection.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-accent">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold font-headline">Purely Qualitative</h3>
                <p className="text-muted-foreground">
                  No likes. No comments. No social media loops. We focus solely on the 
                  connection between the writer's experience and the listener's heart.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-accent">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold font-headline">Deep Support</h3>
                <p className="text-muted-foreground">
                  Reflecting on the past can be difficult. We provide direct access to 
                  mental health resources for those in need of immediate support.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
