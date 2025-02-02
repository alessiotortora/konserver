import Mux from '@mux/mux-node';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { videos } from '@/db/schema/videos';

interface CreateMuxUploadParams {
  spaceId: string;
  filename: string;
}

interface MuxUploadResponse {
  uploadUrl: string;
  videoId: string;
}

const client = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function createMuxUpload({
  spaceId,
  filename,
}: CreateMuxUploadParams): Promise<MuxUploadResponse> {
  if (!spaceId) throw new Error('Space ID is required');
  if (!filename) throw new Error('Filename is required');

  // Create a new upload URL
  const upload = await client.video.uploads.create({
    new_asset_settings: {
      playback_policy: ['public'],
      video_quality: 'basic',
    },
    cors_origin: '*',
  });

  const video = await db
    .insert(videos)
    .values({
      spaceId,
      filename,
      identifier: upload.id,
      alt: filename,
      status: 'processing',
    })
    .returning();

  revalidatePath(`/dashboard/${spaceId}/media`);

  return {
    uploadUrl: upload.url,
    videoId: video[0].id,
  };
}
