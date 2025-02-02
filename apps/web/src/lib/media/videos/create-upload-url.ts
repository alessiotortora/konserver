import Mux from '@mux/mux-node';

interface CreateMuxUploadParams {
  spaceId: string;
}

interface MuxUploadResponse {
  uploadUrl: string;
  uploadId: string;
}

const client = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || '',
  tokenSecret: process.env.MUX_TOKEN_SECRET || '',
});

export async function createUploadUrl({
  spaceId,

}: CreateMuxUploadParams): Promise<MuxUploadResponse> {
  if (!spaceId) throw new Error('Space ID is required');


  const upload = await client.video.uploads.create({
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
}