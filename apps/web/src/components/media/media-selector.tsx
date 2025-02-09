'use client';

import type { Image as DbImage, Video } from '@/db/schema/types';
import { MediaManager } from './media-manager';

interface MediaSelectorProps {
  items: (DbImage | Video)[];
  selectedId?: string;
  onSelect: (id: string) => void;
  type: 'image' | 'video';
  triggerLabel: string;
  spaceId: string;
}

export function MediaSelector({
  items,
  selectedId,
  onSelect,
  type,
  triggerLabel,
  spaceId,
}: MediaSelectorProps) {
  return (
    <MediaManager
      spaceId={spaceId}
      items={items}
      selectedId={selectedId}
      onSelect={onSelect}
      mode="all"
      type={type}
      triggerLabel={triggerLabel}
      triggerVariant="outline"
    />
  );
}
