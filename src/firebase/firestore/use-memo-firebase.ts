'use client';

import { useMemo, useRef } from 'react';

/**
 * A specialized version of useMemo for Firebase Query or DocumentReference objects.
 * It prevents unnecessary re-subscriptions by only re-calculating the reference 
 * if the dependencies actually change.
 */
export function useMemoFirebase<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<T | null>(null);
  const lastDeps = useRef<React.DependencyList | null>(null);

  return useMemo(() => {
    const depsChanged = !lastDeps.current || !deps.every((dep, i) => dep === lastDeps.current![i]);
    if (depsChanged) {
      ref.current = factory();
      lastDeps.current = deps;
    }
    return ref.current!;
  }, deps);
}
