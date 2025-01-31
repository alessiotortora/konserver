'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Image as DbImage, Video } from '@/db/schema/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

interface MediaSelectorProps {
  items: (DbImage | Video)[];
  selectedId?: string;
  onSelect: (id: string) => void;
  type: 'image' | 'video';
  triggerLabel: string;
}

function isImage(item: DbImage | Video): item is DbImage {
  return 'url' in item;
}

function isVideo(item: DbImage | Video): item is Video {
  return 'playbackId' in item;
}

export function MediaSelector({
  items,
  selectedId,
  onSelect,
  type,
  triggerLabel,
}: MediaSelectorProps) {
  const [open, setOpen] = useState(false);

  const filteredItems = items.filter((item) => (type === 'image' ? isImage(item) : isVideo(item)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Select {type === 'image' ? 'Image' : 'Video'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] p-4">
          <div className="grid grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.id);
                  setOpen(false);
                }}
                className={cn(
                  'relative aspect-video overflow-hidden rounded-lg border-2 transition-all hover:border-primary',
                  item.id === selectedId ? 'border-primary ring-2 ring-primary' : 'border-muted'
                )}
              >
                {type === 'image' && isImage(item) && (
                  <Image
                    src={item.url}
                    alt={item.alt || ''}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
                {type === 'video' && isVideo(item) && item.playbackId && (
                  <div className="relative h-full w-full bg-muted">
                    {/* Add video thumbnail or player here */}
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
      </DialogContent>
    </Dialog>
  );
}
