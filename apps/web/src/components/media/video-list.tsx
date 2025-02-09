'use client';

import { useVideoRealtime } from '@/lib/media/videos/use-video-realtime';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';
import { MediaItem } from './media-item';

interface VideoListProps {
  spaceId: string;
}

export function VideoList({ spaceId }: VideoListProps) {
  const [videos] = trpc.video.getVideos.useSuspenseQuery(
    { spaceId },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const utils = trpc.useUtils();

  useVideoRealtime(spaceId, (payload) => {
    console.log('Received realtime update for videos:', payload);

    // Check if the video status changed to ready
    const newRow = payload.new as { status?: string; filename?: string };
    const oldRow = payload.old as { status?: string };

    if (oldRow?.status !== 'ready' && newRow?.status === 'ready' && newRow.filename) {
      toast.success(`Video "${newRow.filename}" is ready to view!`);
    }

    utils.video.getVideos.invalidate({ spaceId });
  });

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
