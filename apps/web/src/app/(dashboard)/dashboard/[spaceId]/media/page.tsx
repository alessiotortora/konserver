import { Suspense } from 'react';

import { Heading } from '@/components/layout/heading';
import { ScrollContainer } from '@/components/layout/scroll-container';
import { AddMediaPopover } from '@/components/media/add-media-popover';
import { MediaGrid } from '@/components/media/media-grid';

type Params = Promise<{ spaceId: string }>;

interface MediaPageProps {
  params: Params;
}

export default async function MediaPage({ params }: MediaPageProps) {
  const { spaceId } = await params;
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Heading title="Media Library" description="Upload and manage your media assets" />
        <AddMediaPopover spaceId={spaceId} />
      </div>
      
      <ScrollContainer>
        <Suspense fallback={<div>Loading media...</div>}>
          <MediaGrid spaceId={spaceId} />
        </Suspense>
      </ScrollContainer>
    </div>
  );
}
