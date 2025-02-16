'use client';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Image as DbImage, Video } from '@/db/schema/types';
import { useMediaUpload } from '@/hooks/use-media-upload';
import { cn } from '@/lib/utils';
import { Check, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { DialogTitle } from '../ui/dialog';
import { useSidebar } from '../ui/sidebar';
import { MediaUploader } from './media-uploader';

export interface MediaManagerProps {
  spaceId: string;
  items?: (DbImage | Video)[] & {
    hasNextPage?: boolean;
    fetchNextPage?: () => Promise<unknown>;
    isFetchingNextPage?: boolean;
    isLoading?: boolean;
  };
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  mode?: 'gallery' | 'upload' | 'all';
  type?: 'image' | 'video' | 'all';
  triggerLabel?: string;
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  showProgress?: boolean;
  maxSelection?: number;
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
  selectedIds = [],
  onSelect,
  mode = 'all',
  type = 'all',
  triggerLabel = 'Select Media',
  triggerVariant = 'outline',
  showProgress = true,
  maxSelection = 1,
}: MediaManagerProps) {
  const [open, setOpen] = useState(false);
  const { isMobile } = useSidebar();

  const { uploadState, handleUpload } = useMediaUpload({
    spaceId,
    onUploadComplete: useCallback(
      (id: string) => {
        onSelect?.(id);
        if (mode === 'upload') {
          setOpen(false);
        }
      },
      [mode, onSelect]
    ),
    acceptedTypes: {
      images: type === 'all' || type === 'image',
      videos: type === 'all' || type === 'video',
    },
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (type === 'all') return true;
      return type === 'image' ? isImage(item) : isVideo(item);
    });
  }, [items, type]);

  const acceptedFileTypes = useMemo(() => {
    const types: Record<string, string[]> = {};
    if (type === 'all') {
      return { ...ACCEPTED_TYPES };
    }
    if (type === 'image') {
      types['image/*'] = ACCEPTED_TYPES['image/*'];
    } else {
      types['video/*'] = ACCEPTED_TYPES['video/*'];
    }
    return types;
  }, [type]);

  const defaultTab = mode === 'upload' ? 'upload' : 'gallery';
  const showTabs = mode === 'all';

  const handleItemClick = useCallback(
    (itemId: string) => {
      onSelect?.(itemId);
      if (mode === 'gallery' && !showTabs) {
        setOpen(false);
      }
    },
    [mode, onSelect, showTabs]
  );

  const gallery = (
    <ScrollArea className="h-[min(calc(100vh-10rem),480px)]">
      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 md:grid-cols-4">
        {items.isLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full flex justify-center py-8">
            <p className="text-muted-foreground">No items found</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className="w-full"
                disabled={maxSelection > 1 && !isSelected && selectedIds.length >= maxSelection}
              >
                <div
                  className={cn(
                    'group relative aspect-video overflow-hidden rounded-lg border bg-muted transition-colors hover:border-primary',
                    isSelected && 'border-primary'
                  )}
                >
                  {isImage(item) ? (
                    <Image
                      src={item.url}
                      alt={item.alt || ''}
                      className={cn('object-cover', isSelected && 'brightness-95')}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      {item.playbackId ? (
                        <Image
                          src={`https://image.mux.com/${item.playbackId}/thumbnail.jpg?time=0`}
                          alt={item.alt || ''}
                          className={cn('object-cover', isSelected && 'brightness-95')}
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
                  <div
                    className={cn(
                      'absolute inset-0 bg-black/10 transition-opacity',
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    )}
                  />
                  <div
                    className={cn(
                      'bg-primary absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-transform',
                      isSelected ? 'scale-100' : 'scale-0'
                    )}
                  >
                    <Check className="text-primary-foreground h-3.5 w-3.5" />
                  </div>
                </div>
              </button>
            );
          })
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

  const trigger = (
    <Button
      variant={triggerVariant}
      size="sm"
      className={cn('gap-1', triggerVariant === 'ghost' ? 'text-muted-foreground' : '')}
    >
      {!selectedIds.length && <ImageIcon className="h-4 w-4" />}
      {triggerLabel}
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DialogTitle className="sr-only">Media Manager</DialogTitle>
        <DrawerContent>{content}</DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
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
