'use client';

import { useSpaceImages } from '@/hooks/use-space-media';
import { MediaItem } from './media-item';

interface ImageListProps {
  spaceId: string;
}

export function ImageList({ spaceId }: ImageListProps) {
  const images = useSpaceImages(spaceId);

  if (images.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No images found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <MediaItem key={image.id} item={image} />
      ))}
    </div>
  );
}
