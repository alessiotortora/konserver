import { db } from '@/db';
import { images } from '@/db/schema/images';
import { createUploadSignature } from './create/create-upload-signature';

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
}

interface CloudinaryResponse extends CloudinaryUploadResult {
  error?: {
    message: string;
  };
}

export async function uploadToCloudinary(file: File, spaceId: string) {
  try {
    // Get upload signature
    const { signature, timestamp } = await createUploadSignature({
      spaceId,
    });

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
    formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET || '');

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`;

    // Upload to Cloudinary
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = (await response.json()) as CloudinaryResponse;

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload image');
    }

    // Save to database
    await db.insert(images).values({
      spaceId,
      filename: file.name,
      publicId: data.public_id,
      url: data.secure_url,
      alt: file.name,
      format: data.format,
      bytes: data.bytes,
      resolution: {
        width: data.width,
        height: data.height,
      },
    });

    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export async function uploadMultipleToCloudinary(files: File[], spaceId: string) {

  const imageFiles = files.filter((file) => file.type.startsWith('image/'));

  if (imageFiles.length === 0) {
    return [];
  }

  try {
    const uploadPromises = imageFiles.map((file) => uploadToCloudinary(file, spaceId));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
}
