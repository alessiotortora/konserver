import type { ReactNode } from 'react';

interface MediaGridLayoutProps {
  children: ReactNode;
  emptyMessage?: string;
  items: unknown[];
}

export function MediaGridLayout({
  children,
  items,
  emptyMessage = 'No items found',
}: MediaGridLayoutProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{children}</div>
    </div>
  );
}
