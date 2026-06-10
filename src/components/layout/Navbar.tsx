
"use client"

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Library, PenTool, ShieldCheck, PlusSquare, BookHeart, Info, LogIn, LogOut, Users } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';

const publicNavItems = [
  { name: 'Archive', href: '/archive', icon: Library },
  { name: 'Submit', href: '/submit', icon: PlusSquare },
  { name: 'Resources', href: '/resources', icon: BookHeart },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, profile, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  const isLibrarian = profile?.role === 'librarian';
  const isAuthor = profile?.role === 'author';

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <Logo iconClassName="h-8 w-auto group-hover:scale-105 transition-transform" />
            <span className="hidden lg:block font-headline text-base font-bold tracking-tight text-foreground whitespace-nowrap">
              Listening to Echoes
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {publicNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors rounded-md hover:bg-muted/50 whitespace-nowrap",
                    isActive ? "text-accent bg-muted/50" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline">{item.name}</span>
                  <span className={cn("xl:hidden", !isActive && "sr-only")}>{item.name}</span>
                </Link>
              );
            })}

            {isLibrarian && (
              <>
                <Link
                  href="/librarian"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors rounded-md hover:bg-muted/50 whitespace-nowrap",
                    pathname === '/librarian' ? "text-accent bg-muted/50" : "text-muted-foreground"
                  )}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline">Review</span>
                </Link>
                <Link
                  href="/librarian/team"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors rounded-md hover:bg-muted/50 whitespace-nowrap",
                    pathname === '/librarian/team' ? "text-accent bg-muted/50" : "text-muted-foreground"
                  )}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline">Team</span>
                </Link>
              </>
            )}

            {isAuthor && (
              <Link
                href="/author"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors rounded-md hover:bg-muted/50 whitespace-nowrap",
                  pathname === '/author' ? "text-accent bg-muted/50" : "text-muted-foreground"
                )}
              >
                <PenTool className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">Author Lab</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!loading && (
              user ? (
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-accent">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
                    <LogIn className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Internal</span>
                  </Button>
                </Link>
              )
            )}
            <Link href="/about" className="text-muted-foreground hover:text-accent transition-colors p-2">
              <Info className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
