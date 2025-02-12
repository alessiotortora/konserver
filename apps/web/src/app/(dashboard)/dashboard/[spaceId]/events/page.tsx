import { Heading } from '@/components/layout/heading';
import { PageContainer } from '@/components/layout/page-container';

export default function EventPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <Heading title="Events" description="Manage and organize your events" />
      </div>
    </PageContainer>
  );
}
