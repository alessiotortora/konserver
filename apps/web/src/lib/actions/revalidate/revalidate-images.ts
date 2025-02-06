'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateImages() {
  console.log('Revalidating images');
  revalidateTag('space-images');
  console.log('Revalidated images');
}
