import { createDefaultSpace } from '@/lib/actions/create/create-default-space';
import { getDefaultSpace } from '@/lib/actions/get/get-default-space';
import { createClient } from '@/utils/supabase/client/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/login');
  }

  // Get or create default space
  const { success: getSuccess, space } = await getDefaultSpace(session.user.id);

  if (getSuccess && space) {
    redirect(`/dashboard/${space.id}`);
  }

  // If no space exists, create one
  const { success: createSuccess, space: newSpace } = await createDefaultSpace(session.user.id);

  if (createSuccess && newSpace) {
    redirect(`/dashboard/${newSpace.id}`);
  }

  // If we get here, something went wrong
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p>We could not load your dashboard. Please try again later.</p>
    </div>
  );
}
