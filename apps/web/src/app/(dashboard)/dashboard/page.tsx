import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

function page() {
  return (
    <div>
      this is the dashboard
      <Link href="/dashboard/private">Private</Link>
      <Button asChild>
        <Link href="/">home</Link>
      </Button>
    </div>
  );
}

export default page;
