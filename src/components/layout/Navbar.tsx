"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Library, PenTool, ShieldCheck, PlusSquare, BookHeart, Info } from 'lucide-react';

const navItems = [
  { name: 'Archive', href: '/archive', icon: Library },
  { name: 'Submit', href: '/submit', icon: PlusSquare },
  { name: 'Librarian', href: '/librarian', icon: ShieldCheck },
  { name: 'Authors', href: '/author', icon: PenTool },
  { name: 'Resources', href: '/resources', icon: BookHeart },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-background animate-pulse" />
            </div>
            <span className="font-headline text-xl font-bold tracking-tight text-foreground">
              Listening to Echoes
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-muted/50",
                    isActive ? "text-accent bg-muted" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">
            <Info className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}