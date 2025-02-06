'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateMedia() {
  console.log('Revalidating media');
  revalidateTag('space-media');
  console.log('Revalidated media');
}
