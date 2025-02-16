import { Suspense } from 'react';

import { HeaderButtonContainer } from '@/components/layout/header-button-container';
import { Heading } from '@/components/layout/heading';
import { PageContainer } from '@/components/layout/page-container';
import { AddMediaPopover } from '@/components/media/add-media-popover';
import { MediaGrid } from '@/components/media/media-grid';

type Params = Promise<{ spaceId: string }>;

interface MediaPageProps {
  params: Params;
}

export default async function MediaPage({ params }: MediaPageProps) {
  const { spaceId } = await params;
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading title="Media Library" description="Upload and manage your media assets" />
          <HeaderButtonContainer label="Add Media">
            <AddMediaPopover spaceId={spaceId} />
          </HeaderButtonContainer>
        </div>

        <Suspense fallback={<div>Loading media...</div>}>
          <MediaGrid spaceId={spaceId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
