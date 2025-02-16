'use client';

import { useHeaderStore } from '@/store/header-store';
import { useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

interface HeaderButtonContainerProps {
  label: string;
  children: React.ReactNode;
}

export function HeaderButtonContainer({ label, children }: HeaderButtonContainerProps) {
  const setButton = useHeaderStore((state) => state.setButton);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  useEffect(() => {
    if (!isInView) {
      setButton({
        label,
        component: children,
        isVisible: true,
      });
    } else {
      setButton(null);
    }

    return () => {
      setButton(null);
    };
  }, [isInView, label, children, setButton]);

  return <div ref={ref}>{children}</div>;
}
