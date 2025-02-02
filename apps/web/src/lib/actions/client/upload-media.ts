'use server';

import { uploadMultipleToCloudinary } from '../cloudinary';
import { createMuxUpload } from '../create/create-mux-upload';

interface UploadMediaResponse {
  success: boolean;
  error?: string;
  details?: {
    message: string;
    type: 'video' | 'image';
    filename: string;
  }[];
}

const MAX_CHUNK_SIZE = 1024 * 1024; // 1MB

async function processImageBatch(
  images: File[],
  spaceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await uploadMultipleToCloudinary(images, spaceId);
    return { success: true };
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload images',
    };
  }
}

async function processVideoUpload(
  file: File,
  spaceId: string,
  onProgress?: (filename: string, progress: number) => void
): Promise<{ success: boolean; error?: string }> {
  try {
    const { uploadUrl } = await createMuxUpload({
      spaceId,
      filename: file.name,
    });

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded * 100) / event.total);
          onProgress(file.name, progress);
        }
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Failed to upload to Mux: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(file);
    });

    return { success: true };
  } catch (error) {
    console.error(`Error uploading video ${file.name}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload video',
    };
  }
}

export async function uploadMedia(
  files: File[],
  spaceId: string,
  onProgress?: (filename: string, progress: number) => void
): Promise<UploadMediaResponse> {
  try {
    const errors: { message: string; type: 'video' | 'image'; filename: string }[] = [];

    // Separate video and image files
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    const videoFiles = files.filter((file) => file.type.startsWith('video/'));

    // Process images in batches
    if (imageFiles.length > 0) {
      let currentBatch: File[] = [];
      let currentSize = 0;

      for (const file of imageFiles) {
        if (currentSize + file.size > MAX_CHUNK_SIZE) {
          // Upload current batch
          const result = await processImageBatch(currentBatch, spaceId);
          if (!result.success) {
            errors.push({
              message: result.error || 'Failed to upload images',
              type: 'image',
              filename: currentBatch.map((f) => f.name).join(', '),
            });
          }
          // Reset batch
          currentBatch = [file];
          currentSize = file.size;
        } else {
          currentBatch.push(file);
          currentSize += file.size;
        }
      }

      // Upload remaining batch
      if (currentBatch.length > 0) {
        const result = await processImageBatch(currentBatch, spaceId);
        if (!result.success) {
          errors.push({
            message: result.error || 'Failed to upload images',
            type: 'image',
            filename: currentBatch.map((f) => f.name).join(', '),
          });
        }
      }
    }

    // Process videos one at a time
    if (videoFiles.length > 0) {
      for (const file of videoFiles) {
        const result = await processVideoUpload(file, spaceId, onProgress);
        if (!result.success) {
          errors.push({
            message: result.error || 'Failed to upload video',
            type: 'video',
            filename: file.name,
          });
        }
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: 'Some uploads failed',
        details: errors,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'There was an error uploading your media.',
      details: [
        {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          type: 'video',
          filename: 'multiple files',
        },
      ],
    };
  }
}
