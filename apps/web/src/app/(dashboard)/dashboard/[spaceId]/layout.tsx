import { SpaceProvider } from '@/components/providers/space-provider';
import { db } from '@/db';
import { spaces } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

type Params = Promise<{ spaceId: string }>;

interface SpaceLayoutProps {
  children: React.ReactNode;
  params: Params;
}

async function getSpace(spaceId: string) {
  const [space] = await db.select().from(spaces).where(eq(spaces.id, spaceId));

  return space;
}

export default async function SpaceLayout({ children, params }: SpaceLayoutProps) {
  const { spaceId } = await params;
  const space = await getSpace(spaceId);

  if (!space) {
    notFound();
  }

  return (
    <SpaceProvider space={space}>
      <div className="flex flex-col w-full">
        <main className="flex-1 container py-6">{children}</main>
      </div>
    </SpaceProvider>
  );
}
