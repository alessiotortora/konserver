import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center">
      <div className="max-w-md space-y-8 p-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Page Not Found</h1>
        <p className="text-base">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
