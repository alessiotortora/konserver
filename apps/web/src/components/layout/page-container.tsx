// components
import { ScrollArea } from '@/components/ui/scroll-area';

export function PageContainer({
  scrollable = true,
  children,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  if (scrollable) {
    return (
      <ScrollArea className="md:faded-bottom h-screen">
        <div className="h-full px-4 pb-80 pt-4">{children}</div>
      </ScrollArea>
    );
  }

  return <div className="h-full px-4 pb-80 pt-4">{children}</div>;
}
