'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Image as DbImage, Video } from '@/db/schema/types';
import { useMediaUpload } from '@/hooks/use-media-upload';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { MediaUploader } from './media-uploader';

export interface MediaManagerProps {
  spaceId: string;
  items?: (DbImage | Video)[] & {
    hasNextPage?: boolean;
    fetchNextPage?: () => Promise<unknown>;
    isFetchingNextPage?: boolean;
    isLoading?: boolean;
  };
  selectedId?: string;
  onSelect?: (id: string) => void;
  mode?: 'gallery' | 'upload' | 'all';
  type?: 'image' | 'video' | 'all';
  triggerLabel?: string;
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  showProgress?: boolean;
}

const ACCEPTED_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  'video/*': ['.mp4', '.webm', '.ogg'],
};

function isImage(item: DbImage | Video): item is DbImage {
  return 'url' in item;
}

function isVideo(item: DbImage | Video): item is Video {
  return 'playbackId' in item;
}

export function MediaManager({
  spaceId,
  items = [],
  selectedId,
  onSelect,
  mode = 'all',
  type = 'all',
  triggerLabel = 'Select Media',
  triggerVariant = 'outline',
  showProgress = true,
}: MediaManagerProps) {
  const [open, setOpen] = useState(false);

  const { uploadState, handleUpload } = useMediaUpload({
    spaceId,
    onUploadComplete: (id) => {
      onSelect?.(id);
      if (mode === 'upload') {
        setOpen(false);
      }
    },
    acceptedTypes: {
      images: type === 'all' || type === 'image',
      videos: type === 'all' || type === 'video',
    },
  });

  const filteredItems = items.filter((item) => {
    if (type === 'all') return true;
    return type === 'image' ? isImage(item) : isVideo(item);
  });

  const acceptedFileTypes: Record<string, string[]> =
    type === 'all'
      ? { ...ACCEPTED_TYPES }
      : type === 'image'
        ? { 'image/*': ACCEPTED_TYPES['image/*'] }
        : { 'video/*': ACCEPTED_TYPES['video/*'] };

  const defaultTab = mode === 'upload' ? 'upload' : 'gallery';
  const showTabs = mode === 'all';

  const gallery = (
    <ScrollArea className="h-[min(calc(100vh-10rem),480px)]">
      <div className="grid grid-cols-2 gap-2 p-4">
        {items.isLoading ? (
          <div className="col-span-2 flex justify-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-2 flex justify-center py-8">
            <p className="text-muted-foreground">No items found</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect?.(item.id);
                if (mode === 'gallery') {
                  setOpen(false);
                }
              }}
              className={cn(
                'group relative aspect-video overflow-hidden rounded-lg border bg-muted transition-colors hover:border-primary',
                selectedId === item.id && 'border-primary'
              )}
            >
              {isImage(item) ? (
                <Image
                  src={item.url}
                  alt={item.alt || ''}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  {item.playbackId ? (
                    <Image
                      src={`https://image.mux.com/${item.playbackId}/thumbnail.jpg?time=0`}
                      alt={item.alt || ''}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {item.status === 'processing' ? 'Processing...' : 'Failed'}
                    </span>
                  )}
                </div>
              )}
            </button>
          ))
        )}
      </div>
      {'hasNextPage' in items && items.hasNextPage && (
        <div className="flex justify-center p-4 pt-0">
          <Button
            variant="outline"
            onClick={() => items.fetchNextPage?.()}
            disabled={items.isFetchingNextPage}
          >
            {items.isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </ScrollArea>
  );

  const content = (
    <div className="space-y-4">
      {showTabs ? (
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="gallery" className="flex-1">
              Gallery
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex-1">
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-0">
            {gallery}
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <div className="p-4">
              <MediaUploader
                onUpload={handleUpload}
                disabled={uploadState.isUploading}
                accept={acceptedFileTypes}
              />
              {showProgress && uploadState.isUploading && (
                <UploadProgress progress={uploadState.progress} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      ) : mode === 'gallery' ? (
        gallery
      ) : (
        <div className="p-4">
          <MediaUploader
            onUpload={handleUpload}
            disabled={uploadState.isUploading}
            accept={acceptedFileTypes}
          />
          {showProgress && uploadState.isUploading && (
            <UploadProgress progress={uploadState.progress} />
          )}
        </div>
      )}
    </div>
  );

  if (mode === 'upload' && !onSelect) {
    return content;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={triggerVariant}>{triggerLabel}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(calc(100vw-2rem),480px)] p-0" align="start">
        {content}
      </PopoverContent>
    </Popover>
  );
}

interface UploadProgressProps {
  progress: number;
}

function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div
      className="w-full bg-secondary rounded-full h-2.5"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
    >
      <div
        className="bg-primary h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
