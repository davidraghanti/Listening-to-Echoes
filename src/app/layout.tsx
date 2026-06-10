
import type {Metadata} from 'next';
import './globals.css';
import { Footer } from '@/components/layout/Footer';
import { FirebaseProvider } from '@/firebase/provider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Listening to Echoes | Educational Experience Archive',
  description: 'A digital library of personal human experiences related to education.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-accent/30 flex flex-col min-h-screen">
        <FirebaseProvider>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
