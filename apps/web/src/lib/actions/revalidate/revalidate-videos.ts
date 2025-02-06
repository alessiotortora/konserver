'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateVideos() {
  console.log('Revalidating videos');
  revalidateTag('space-videos');
  console.log('Revalidated videos');
}
