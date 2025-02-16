'use client';

import { Button } from '@/components/ui/button';
import type { Image, Video } from '@/db/schema/types';
import { cn } from '@/lib/utils';
import NextImage from 'next/image';

interface MediaThumbnailProps {
  media: Image | Video;
  onRemove?: () => void;
  className?: string;
}

export function MediaThumbnail({ media, onRemove, className }: MediaThumbnailProps) {
  const isVideo = 'playbackId' in media;
  const thumbnailUrl = isVideo
    ? `https://image.mux.com/${media.playbackId}/thumbnail.jpg?time=0`
    : media.url;
  const altText = media.alt || '';

  return (
    <div
      className={cn(
        'group relative aspect-video overflow-hidden rounded-lg border bg-muted',
        className
      )}
    >
      {thumbnailUrl ? (
        <NextImage
          src={thumbnailUrl}
          alt={altText}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">
            {isVideo && media.status === 'processing' ? 'Processing...' : 'Failed'}
          </span>
        </div>
      )}
      {onRemove && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
          <Button type="button" variant="destructive" size="sm" onClick={onRemove}>
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
