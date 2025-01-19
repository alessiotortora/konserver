'use server';

import { eq } from 'drizzle-orm';
import { cache } from 'react';

import { db } from '@/db';
import { users } from '@/db/schema';
import { getServerUser } from '@/utils/supabase/server';

export const getUser = cache(async (options?: { includeSocialLinks?: boolean }) => {
  const authUser = await getServerUser();

  if (!authUser) return null;

  if (options?.includeSocialLinks) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, authUser.id),
      with: {
        socialLinks: true,
      },
    });
    return user ?? null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
  });

  return user ?? null;
});
