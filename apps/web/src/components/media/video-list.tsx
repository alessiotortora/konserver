'use client';

import { trpc } from '@/trpc/client';
import { MediaItem } from './media-item';

interface VideoListProps {
  spaceId: string;
}

export function VideoList({ spaceId }: VideoListProps) {
  // Use tRPC query with suspense and optimized refetching
  const [videos] = trpc.video.getSpaceVideos.useSuspenseQuery(
    { spaceId },
    {
      // Refetch every 3 seconds while videos are processing
      refetchInterval: (query) => {
        const data = query.state.data;
        const hasProcessingVideos = data?.some((video) => video.status === 'processing');
        return hasProcessingVideos ? 3000 : false;
      },
      // Cache data for 1 second
      staleTime: 1000,
      // Refetch on window focus and mount
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      // Retry failed requests
      retry: 3,
      retryDelay: 1000,
    }
  );

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
