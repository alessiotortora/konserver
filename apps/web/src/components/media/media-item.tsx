'use client';

import { Card } from '@/components/ui/card';
import type { Image as ImageType } from '@/db/schema/types';
import type { Video as VideoType } from '@/db/schema/videos';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MediaItemProps {
  item: ImageType | VideoType;
}

export function MediaItem({ item }: MediaItemProps) {
  const isImage = 'url' in item;
  const isVideo = 'playbackId' in item;

  return (
    <Card className="group relative aspect-square overflow-hidden">
      {isImage && (
        <Image
          src={item.url}
          alt={item.alt || ''}
          className="object-cover transition-transform group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}

      {isVideo && item.playbackId && (
        <Image
          src={`https://image.mux.com/${item.playbackId}/thumbnail.jpg?time=0`}
          alt={item.alt || ''}
          className={cn(
            'object-cover transition-transform group-hover:scale-105',
            item.status === 'processing' && 'opacity-50'
          )}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}

      {isVideo && item.status === 'processing' && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <p className="text-sm text-muted-foreground">Processing...</p>
        </div>
      )}

      {isVideo && item.status === 'failed' && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <p className="text-sm text-destructive">Failed to process</p>
        </div>
      )}
    </Card>
  );
}
