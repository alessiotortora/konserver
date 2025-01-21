'use client';

import type { Space } from '@/db/schema';
import { useSpaceStore } from '@/store/space-store';
import { useEffect } from 'react';

interface SpaceProviderProps {
  children: React.ReactNode;
  space: Space;
}

export function SpaceProvider({ children, space }: SpaceProviderProps) {
  const { setCurrentSpace, setLoading } = useSpaceStore();

  useEffect(() => {
    setCurrentSpace(space);
    setLoading(false);
  }, [space, setCurrentSpace, setLoading]);

  return children;
}
