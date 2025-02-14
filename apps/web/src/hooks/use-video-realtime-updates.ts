import { useVideoRealtime } from '@/lib/media/videos/use-video-realtime';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';

export function useVideoRealtimeUpdates(spaceId: string) {
  const utils = trpc.useUtils();

  useVideoRealtime(spaceId, (payload) => {
    // Check if the video status changed to ready
    const newRow = payload.new as { status?: string; filename?: string };
    const oldRow = payload.old as { status?: string };

    if (oldRow?.status !== 'ready' && newRow?.status === 'ready' && newRow.filename) {
      toast.success(`Video "${newRow.filename}" is ready to view!`);
    }

    utils.video.getVideos.invalidate({ spaceId });
  });
}
