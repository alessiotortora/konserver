'use client';

import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user-store';
import Link from 'next/link';

export default function HomePage() {
  const { user, isLoading } = useUserStore();

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Konserver</h1>
        {user && (
          <p className="text-xl mb-4">Welcome back, {user.fullName || user.email || 'User'}!</p>
        )}
        <p className="text-xl mb-8">Your digital space for content</p>

        {user ? (
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
