import { HydrateClient, trpc } from '@/trpc/server';
import { Suspense } from 'react';
import { ImageList } from './image-list';
import { VideoList } from './video-list';

export const dynamic = 'force-dynamic';

interface MediaGridProps {
  spaceId: string;
}

export async function MediaGrid({ spaceId }: MediaGridProps) {
  void trpc.video.getVideos.prefetch({ spaceId });
  void trpc.image.getImages.prefetch({ spaceId });

  return (
    <HydrateClient>
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-4">Images</h2>
          <Suspense
            fallback={
              <div className="text-center py-4">
                <p className="text-muted-foreground">Loading images...</p>
              </div>
            }
          >
            <ImageList spaceId={spaceId} />
          </Suspense>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Videos</h2>
          <Suspense
            fallback={
              <div className="text-center py-4">
                <p className="text-muted-foreground">Loading videos...</p>
              </div>
            }
          >
            <VideoList spaceId={spaceId} />
          </Suspense>
        </section>
      </div>
    </HydrateClient>
  );
}
