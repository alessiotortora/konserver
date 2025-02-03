'use server';

import Mux from '@mux/mux-node';
import { z } from 'zod';

const createMuxUploadSchema = z.object({
  spaceId: z.string().uuid(),
});

const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function createMuxUpload(input: z.infer<typeof createMuxUploadSchema>) {
  try {
    const { spaceId } = createMuxUploadSchema.parse(input);

    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      throw new Error('Missing Mux credentials');
    }

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
    console.error('Error creating Mux upload:', error);
    throw new Error('Failed to create upload URL');
  }
}
