
"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'brand';
  externalUrl?: string;
}

export function Logo({ className, iconClassName, showText = false, variant = 'brand', externalUrl = "https://your-external-site.com" }: LogoProps) {
  const accentColor = "#4dabf7"; // The blue from the logo
  
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <svg 
        viewBox="0 0 100 80" 
        className={cn("h-full w-auto", iconClassName)}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bars on the left (Sound Wave) */}
        <rect x="4" y="38" width="1.5" height="4" fill="white" />
        <rect x="8" y="34" width="1.5" height="12" fill="white" />
        <rect x="12" y="30" width="1.5" height="20" fill={accentColor} />
        <rect x="16" y="26" width="1.5" height="28" fill="white" />
        <rect x="20" y="22" width="1.5" height="36" fill="white" />
        <rect x="24" y="18" width="1.5" height="44" fill={accentColor} />
        <rect x="28" y="14" width="1.5" height="52" fill="white" />
        <rect x="32" y="10" width="1.5" height="60" fill="white" />
        <rect x="36" y="16" width="1.5" height="48" fill={accentColor} />
        <rect x="40" y="22" width="1.5" height="36" fill="white" />

        {/* Head Silhouette */}
        <path 
          d="M48 5C56 5 62 13 62 25C62 33 60 37 60 40C60 43 62 45 62 47C62 50 60 53 57 57C54 60 50 63 46 65" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />

        {/* Waves on the right (Echoes) */}
        <path d="M68 27C72 32 72 38 68 43" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M74 22C80 29 80 41 74 48" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M80 17C88 27 88 43 80 53" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M86 12C96 24 96 46 86 58" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      
      {showText && (
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center leading-none">
            <span className="font-headline text-3xl font-bold tracking-[0.25em] uppercase text-white">Listening</span>
            <div className="flex items-center gap-4 w-full my-2">
              <div className="h-[1px] flex-1 bg-white/40"></div>
              <span className="text-xs text-[#4dabf7] uppercase tracking-[0.6em] font-medium">to</span>
              <div className="h-[1px] flex-1 bg-white/40"></div>
            </div>
            <span className="font-headline text-4xl font-bold tracking-[0.45em] uppercase text-white">Echoes</span>
          </div>
          <div className="w-full flex items-center justify-between gap-2 mt-4">
            <div className="h-[1.5px] w-8 bg-white/60"></div>
            <a 
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-white/80 uppercase tracking-[0.35em] font-headline font-bold hover:text-accent transition-colors"
            >
              David Raghanti
            </a>
            <div className="h-[1.5px] w-8 bg-white/60"></div>
          </div>
        </div>
      )}
    </div>
  );
}
