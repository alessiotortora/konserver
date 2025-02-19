import { SpaceProvider } from '@/components/providers/space-provider';
import { db } from '@/db';
import { spaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { cache } from 'react';

type Params = Promise<{ spaceId: string }>;

interface SpaceLayoutProps {
  children: React.ReactNode;
  params: Params;
}

// Cache the getSpace function to avoid duplicate requests
const getSpace = cache(async (spaceId: string) => {
  const [space] = await db.select().from(spaces).where(eq(spaces.id, spaceId));

  return space;
});

export default async function SpaceLayout({ children, params }: SpaceLayoutProps) {
  const { spaceId } = await params;
  const space = await getSpace(spaceId);

  if (!space) {
    notFound();
  }

  return (
    <SpaceProvider space={space}>
      <div className="flex flex-col w-full h-full">
        <main className="flex-1 h-full">{children}</main>
      </div>
    </SpaceProvider>
  );
}
