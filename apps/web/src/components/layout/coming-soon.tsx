import { cn } from '@/lib/utils';

interface ComingSoonProps {
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ComingSoon({
  description = 'This feature is under development and will be available soon.',
  className,
  children,
}: ComingSoonProps) {
  return (
    <div className={cn('flex h-full flex-col items-center justify-center p-4 ', className)}>
      <div className="text-center space-y-2 mb-32">
        <h2 className="text-4xl font-bold tracking-tight">Coming Soon</h2>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
      {children && <div className="pt-4">{children}</div>}
    </div>
  );
}
