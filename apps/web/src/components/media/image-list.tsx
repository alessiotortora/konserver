'use client';

import { Button } from '@/components/ui/button';
import { useSpaceImages } from '@/hooks/use-space-media';
import { MediaGridLayout } from './media-grid-layout';
import { MediaItem } from './media-item';

interface ImageListProps {
  spaceId: string;
}

export function ImageList({ spaceId }: ImageListProps) {
  const images = useSpaceImages(spaceId);

  if (images.isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-muted-foreground">Loading images...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MediaGridLayout items={images} emptyMessage="No images found">
        {images.map((image) => (
          <MediaItem key={image.id} item={image} />
        ))}
      </MediaGridLayout>

      {images.hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => images.fetchNextPage()}
            disabled={images.isFetchingNextPage}
          >
            {images.isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
