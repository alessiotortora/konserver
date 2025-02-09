'use client';

import { useSpaceVideos } from '@/hooks/use-space-media';
import { useVideoRealtimeUpdates } from '@/hooks/use-video-realtime-updates';
import { MediaItem } from './media-item';

interface VideoListProps {
  spaceId: string;
}

export function VideoList({ spaceId }: VideoListProps) {
  const videos = useSpaceVideos(spaceId);

  // Enable real-time updates for the video list
  useVideoRealtimeUpdates(spaceId);

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
