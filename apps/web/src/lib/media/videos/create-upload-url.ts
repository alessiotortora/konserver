'use server';

import { muxClient } from '@/utils/mux/client';

interface CreateMuxUploadParams {
  spaceId: string;
}

interface MuxUploadResponse {
  uploadUrl: string;
  uploadId: string;
}

export async function createUploadUrl({
  spaceId,
}: CreateMuxUploadParams): Promise<MuxUploadResponse> {
  if (!spaceId) throw new Error('Space ID is required');

  try {
    const upload = await muxClient.video.uploads.create({
      new_asset_settings: {
        playback_policy: ['public'],
        video_quality: 'basic',
      },
      cors_origin: '*',
    });
    return {
      uploadUrl: upload.url,
      uploadId: upload.id,
    };
  } catch (error) {
    console.error('Error creating upload URL', error);
    throw error;
  }
}
