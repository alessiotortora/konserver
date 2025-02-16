'use client';

import { useHeaderStore } from '@/store/header-store';
import { useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

export function Heading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const setTitle = useHeaderStore((state) => state.setTitle);

  useEffect(() => {
    setTitle(isInView ? '' : title);
  }, [isInView, setTitle, title]);

  return (
    <div ref={ref}>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
