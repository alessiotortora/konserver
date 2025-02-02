import Mux from '@mux/mux-node';

const client = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || '',
  tokenSecret: process.env.MUX_TOKEN_SECRET || '',
});

export async function checkUploadStatus(uploadId: string) {
    try {
      console.log('Checking upload status for:', uploadId)
      const upload = await client.video.uploads.retrieve(uploadId)
      const asset = upload.asset_id ? await client.video.assets.retrieve(upload.asset_id) : null
  
      console.log('Upload status:', {
        uploadStatus: upload.status,
        assetStatus: asset?.status,
        assetId: upload.asset_id,
        playbackId: asset?.playback_ids?.[0]?.id
      })
  
      return {
        status: asset?.status || 'preparing',
        assetId: upload.asset_id,
        playbackId: asset?.playback_ids?.[0]?.id,
      }
    } catch (error) {
      console.error('Error checking upload status:', error)
      throw new Error('Failed to check upload status')
    }
  }