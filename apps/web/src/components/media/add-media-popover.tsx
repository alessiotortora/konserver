'use client';

import { MediaManager } from './media-manager';

interface AddMediaPopoverProps {
  spaceId: string;
}

export function AddMediaPopover({ spaceId }: AddMediaPopoverProps) {
  return (
    <MediaManager
      spaceId={spaceId}
      mode="upload"
      type="all"
      triggerLabel="Add Media"
      triggerVariant="default"
      onSelect={() => {}}
    />
  );
}
