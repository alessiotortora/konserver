import { desc, eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

import { db } from '@/db';
import { images } from '@/db/schema/images';
import { videos } from '@/db/schema/videos';
import { MediaItem } from './media-item';

interface MediaGridProps {
  spaceId: string;
}

async function getSpaceMedia(spaceId: string) {
  const [spaceImages, spaceVideos] = await Promise.all([
    db.query.images.findMany({
      where: eq(images.spaceId, spaceId),
      orderBy: desc(images.createdAt),
    }),
    db.query.videos.findMany({
      where: eq(videos.spaceId, spaceId),
      orderBy: desc(videos.createdAt),
    }),
  ]);

  return {
    images: spaceImages,
    videos: spaceVideos,
  };
}

const getCachedSpaceMedia = unstable_cache(
  async (spaceId: string) => getSpaceMedia(spaceId),
  ['space-media'],
  {
    revalidate: 60,
    tags: ['space-media'],
  }
);

export async function MediaGrid({ spaceId }: MediaGridProps) {
  const { images, videos } = await getCachedSpaceMedia(spaceId);

  if (images.length === 0 && videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No media found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...images, ...videos].map((item) => (
        <MediaItem key={item.id} item={item} />
      ))}
    </div>
  );
}
