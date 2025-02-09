// components
import { ScrollArea } from '@/components/ui/scroll-area';

export function ScrollContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollArea className="md:faded-bottom h-screen">
      <div className="h-full px-4 pb-96 pt-4">{children}</div>
    </ScrollArea>
  );
}
