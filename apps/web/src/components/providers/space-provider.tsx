'use client';

import type { Space } from '@/db/schema';
import { useSpaceStore } from '@/store/space-store';
import { useEffect } from 'react';

interface SpaceProviderProps {
  children: React.ReactNode;
  space: Space;
}

export function SpaceProvider({ children, space }: SpaceProviderProps) {
  const setCurrentSpace = useSpaceStore((state) => state.setCurrentSpace);
  const setLoading = useSpaceStore((state) => state.setLoading);

  useEffect(() => {
    // Set loading true on mount
    setLoading(true);

    try {
      // Update space in store
      setCurrentSpace(space);
    } catch (error) {
      console.error('Error setting space:', error);
    } finally {
      // Ensure loading is set to false even if there's an error
      setLoading(false);
    }

    // Cleanup function to reset store state when unmounting
    return () => {
      setCurrentSpace(null);
      setLoading(false);
    };
  }, [space, setCurrentSpace, setLoading]);

  // Wrap children in a fragment to avoid unnecessary DOM nesting
  return <>{children}</>;
}
