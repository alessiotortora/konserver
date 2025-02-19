'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StickyBarProps {
  children: ReactNode;
  className?: string;
  position?: 'top' | 'bottom';
}

export function StickyBar({ children, className, position = 'top' }: StickyBarProps) {
  return (
    <div
      className={cn(
        'sticky w-[calc(100%+2rem)] -ml-4',
        position === 'top' ? 'top-0' : 'bottom-0',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'z-20',
        position === 'bottom' && 'border-t',
        'p-4',
        className
      )}
    >
      {children}
    </div>
  );
}
