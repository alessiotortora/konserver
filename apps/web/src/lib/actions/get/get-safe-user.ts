'use server';

import { createSafeUser } from '@/types/user';
import { cache } from 'react';
import { getUser } from './get-user';

export const getSafeUser = cache(async () => {
  const user = await getUser({ includeSocialLinks: true });
  if (!user) return null;

  return createSafeUser(user);
});
