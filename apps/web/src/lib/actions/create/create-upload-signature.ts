import cloudinary from 'cloudinary';

interface CreateUploadSignatureParams {
  spaceId: string;
}

interface UploadSignature {
  timestamp: number;
  signature: string;
}

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createUploadSignature({
  spaceId,
}: CreateUploadSignatureParams): Promise<UploadSignature> {
  if (!spaceId) throw new Error('Space ID is required');

  const timestamp = Math.round(new Date().getTime() / 1000);

  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Missing Cloudinary API secret');
  }

  const signature = cloudinary.v2.utils.api_sign_request(
    { timestamp, upload_preset: process.env.NEXT_PUBLIC_UPLOAD_PRESET },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return {
    timestamp,
    signature,
  };
}
