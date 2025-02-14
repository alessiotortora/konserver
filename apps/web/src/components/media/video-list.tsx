'use client';

import { Button } from '@/components/ui/button';
import { useSpaceVideos } from '@/hooks/use-space-media';
import { useVideoRealtimeUpdates } from '@/hooks/use-video-realtime-updates';
import { MediaGridLayout } from './media-grid-layout';
import { MediaItem } from './media-item';

interface VideoListProps {
  spaceId: string;
}

export function VideoList({ spaceId }: VideoListProps) {
  const videos = useSpaceVideos(spaceId);

  // Enable real-time updates for the video list
  useVideoRealtimeUpdates(spaceId);

  if (videos.isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-muted-foreground">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MediaGridLayout items={videos} emptyMessage="No videos found">
        {videos.map((video) => (
          <MediaItem key={video.id} item={video} />
        ))}
      </MediaGridLayout>

      {videos.hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => videos.fetchNextPage()}
            disabled={videos.isFetchingNextPage}
          >
            {videos.isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
