'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StickyBarProps {
  children: ReactNode;
  className?: string;
}

export function StickyBar({ children, className }: StickyBarProps) {
  return (
    <div
      className={cn(
        'sticky top-0 w-full',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'z-20 pt-4 pb-4',
        className
      )}
    >
      {children}
    </div>
  );
}
