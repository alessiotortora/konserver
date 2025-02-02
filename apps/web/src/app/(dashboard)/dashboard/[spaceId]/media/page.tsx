import { Suspense } from 'react';

import { Heading } from '@/components/layout/heading';
import { AddMediaPopover } from '@/components/media/add-media-popover';
import { MediaGrid } from '@/components/media/media-grid';

type Params = Promise<{ spaceId: string }>;

interface MediaPageProps {
  params: Params;
}

export default async function MediaPage({ params }: MediaPageProps) {
  const { spaceId } = await params;
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Heading title="Media Library" description="Upload and manage your media assets" />
        <AddMediaPopover spaceId={spaceId} />
      </div>

      <Suspense fallback={<div>Loading media...</div>}>
        <MediaGrid spaceId={spaceId} />
      </Suspense>
    </div>
  );
}
