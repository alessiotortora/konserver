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
  items?: (DbImage | Video)[];
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

          <TabsContent value="gallery">
            <MediaGallery
              items={filteredItems}
              selectedId={selectedId}
              onSelect={(id) => {
                onSelect?.(id);
                setOpen(false);
              }}
            />
          </TabsContent>

          <TabsContent value="upload">
            <MediaUploader
              onUpload={handleUpload}
              disabled={uploadState.isUploading}
              accept={acceptedFileTypes}
            />
            {showProgress && uploadState.isUploading && (
              <UploadProgress progress={uploadState.progress} />
            )}
          </TabsContent>
        </Tabs>
      ) : mode === 'gallery' ? (
        <MediaGallery
          items={filteredItems}
          selectedId={selectedId}
          onSelect={(id) => {
            onSelect?.(id);
            setOpen(false);
          }}
        />
      ) : (
        <div className="space-y-4">
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
        <Button variant={triggerVariant} type="button">
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[800px] p-4" align="start">
        {content}
      </PopoverContent>
    </Popover>
  );
}

interface MediaGalleryProps {
  items: (DbImage | Video)[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

function MediaGallery({ items, selectedId, onSelect }: MediaGalleryProps) {
  return (
    <ScrollArea className="h-[300px]">
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              'relative aspect-video overflow-hidden rounded-lg border-2 transition-all hover:border-primary',
              item.id === selectedId ? 'border-primary ring-2 ring-primary' : 'border-muted'
            )}
          >
            {isImage(item) && (
              <Image
                src={item.url}
                alt={item.alt || ''}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            {isVideo(item) && item.playbackId && (
              <div className="relative h-full w-full bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    Video: {item.alt || item.playbackId}
                  </span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
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
