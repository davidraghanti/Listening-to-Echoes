"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Library, PenTool, ShieldCheck, PlusSquare, BookHeart, Info } from 'lucide-react';
import { Logo } from '@/components/Logo';

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
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <Logo iconClassName="h-8 w-auto group-hover:scale-105 transition-transform" />
            <span className="hidden lg:block font-headline text-base font-bold tracking-tight text-foreground whitespace-nowrap">
              Listening to Echoes
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
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
                  {/* On smaller screens, only show the label for the active item to save space */}
                  <span className={cn("xl:hidden", !isActive && "sr-only")}>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/about" className="text-muted-foreground hover:text-accent transition-colors p-2">
              <Info className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
