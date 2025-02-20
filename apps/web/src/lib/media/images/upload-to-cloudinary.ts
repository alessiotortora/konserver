interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  width: number;
  format: string;
  bytes: number;
  alt?: string;
  error?: {
    message: string;
  };
}

export async function uploadToCloudinary(file: File, signature: string, timestamp: number) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
    formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET || '');

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = (await response.json()) as CloudinaryResponse;

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload image');
    }

    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}
