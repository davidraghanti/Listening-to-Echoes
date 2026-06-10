
"use client"

import React, { useEffect, useState } from 'react';

export function EchoVisualizer() {
  const [bars, setBars] = useState<number[]>(new Array(40).fill(10));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 80) + 10));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end justify-center gap-1 h-32 w-full max-w-xl mx-auto">
      {bars.map((height, i) => (
        <div 
          key={i} 
          className="w-1.5 bg-accent/40 rounded-t-full transition-all duration-150"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}
