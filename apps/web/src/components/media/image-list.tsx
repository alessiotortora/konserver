import { getSpaceImages } from '@/lib/actions/get/get-space-images';
import { unstable_cache } from 'next/cache';
import { MediaItem } from './media-item';

interface ImageListProps {
  spaceId: string;
}

// Cache with forced revalidation
const getCachedSpaceImages = unstable_cache(
  async (spaceId: string) => getSpaceImages(spaceId),
  ['space-images'],
  {
    revalidate: false,
    tags: ['space-images'],
  }
);

export async function ImageList({ spaceId }: ImageListProps) {
  const result = await getCachedSpaceImages(spaceId);

  if (!result.success) {
    return (
      <div className="text-center py-4">
        <p className="text-destructive">Failed to load images</p>
      </div>
    );
  }

  const { images } = result;

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
