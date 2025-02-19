// components
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  fadeBottom?: boolean;
  noPadding?: boolean;
}

export function PageContainer({
  scrollable = true,
  fadeBottom = false,
  noPadding = false,
  children,
}: PageContainerProps) {
  if (scrollable) {
    return (
      <ScrollArea
        className={cn(
          'h-[calc(100vh-50px)] [@supports(height:100dvh)]:h-[calc(100dvh-50px)]',
          fadeBottom && 'md:faded-bottom'
        )}
      >
        <div className={cn('min-h-full px-4 pt-4 relative', noPadding ? 'pb-0' : 'pb-20')}>
          {children}
        </div>
      </ScrollArea>
    );
  }

  return (
    <div className={cn('min-h-full px-4 pt-4 relative', noPadding ? 'pb-0' : 'pb-20')}>
      {children}
    </div>
  );
}
