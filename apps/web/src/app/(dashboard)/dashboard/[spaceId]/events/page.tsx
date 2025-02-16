import { Heading } from '@/components/layout/heading';
import { PageContainer } from '@/components/layout/page-container';
import { StickyBar } from '@/components/layout/sticky-bar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function EventPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <Heading title="Events" description="Manage and organize your events" />

        <StickyBar>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search events..." className="pl-8" />
          </div>
        </StickyBar>

        {/* Add your events content here */}
        <div className="p-4 space-y-4">
          {Array.from({ length: 20 }).map((_, i) => {
            const eventId = `event-${crypto.randomUUID()}`;
            return (
              <div key={eventId} className="p-4 border rounded-lg">
                Event {i + 1}
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
