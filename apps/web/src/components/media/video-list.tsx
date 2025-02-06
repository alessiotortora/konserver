import { getSpaceVideos } from '@/lib/actions/get/get-space-videos';
import { unstable_cache } from 'next/cache';
import { MediaItem } from './media-item';

interface VideoListProps {
  spaceId: string;
}

// Cache with forced revalidation
const getCachedSpaceVideos = unstable_cache(
  async (spaceId: string) => getSpaceVideos(spaceId),
  ['space-videos'],
  {
    revalidate: false,
    tags: ['space-videos'],
  }
);

export async function VideoList({ spaceId }: VideoListProps) {
  const result = await getCachedSpaceVideos(spaceId);

  if (!result.success) {
    return (
      <div className="text-center py-4">
        <p className="text-destructive">Failed to load videos</p>
      </div>
    );
  }

  const { videos } = result;

  if (videos.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No videos found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <MediaItem key={video.id} item={video} />
      ))}
    </div>
  );
}
