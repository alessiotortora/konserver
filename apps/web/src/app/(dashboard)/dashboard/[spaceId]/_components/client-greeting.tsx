'use client';

import { trpc } from '@/trpc/client';

export function ClientGreeting() {
  const [data] = trpc.hello.useSuspenseQuery({ text: 'Alessio' });
  return <div>{data.greeting}</div>;
}
