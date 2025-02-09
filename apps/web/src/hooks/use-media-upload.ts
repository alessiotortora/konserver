import { createUploadSignature } from '@/lib/media/images/create-upload-signature';
import { uploadToCloudinary } from '@/lib/media/images/upload-to-cloudinary';
import { createUploadUrl } from '@/lib/media/videos/create-upload-url';
import { uploadToMux } from '@/lib/media/videos/upload-to-mux';
import { trpc } from '@/trpc/client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface UploadState {
  isUploading: boolean;
  progress: number;
}

interface UseMediaUploadOptions {
  spaceId: string;
  onUploadComplete?: (id: string) => void;
  acceptedTypes?: {
    images?: boolean;
    videos?: boolean;
  };
}

export function useMediaUpload({
  spaceId,
  onUploadComplete,
  acceptedTypes = { images: true, videos: true },
}: UseMediaUploadOptions) {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
  });

  const utils = trpc.useUtils();
  const createVideo = trpc.video.create.useMutation({
    onSuccess: (data) => {
      utils.video.getVideos.invalidate({ spaceId });
      onUploadComplete?.(data.id);
    },
  });

  const createImage = trpc.image.create.useMutation({
    onSuccess: (data) => {
      utils.image.getImages.invalidate({ spaceId });
      onUploadComplete?.(data.id);
    },
  });

  const handleUpload = useCallback(
    async (files: File[]) => {
      setUploadState({ isUploading: true, progress: 0 });

      const imageFiles = acceptedTypes.images
        ? files.filter((file) => file.type.startsWith('image/'))
        : [];
      const videoFiles = acceptedTypes.videos
        ? files.filter((file) => file.type.startsWith('video/'))
        : [];
      const totalFiles = imageFiles.length + videoFiles.length;

      if (totalFiles === 0) {
        toast.error('Please select at least one media file');
        setUploadState({ isUploading: false, progress: 0 });
        return;
      }

      let processedFiles = 0;

      try {
        // Handle image uploads
        for (const file of imageFiles) {
          try {
            const { signature, timestamp } = await createUploadSignature({ spaceId });
            const uploadResult = await uploadToCloudinary(file, signature, timestamp);

            await createImage.mutateAsync({
              spaceId,
              filename: file.name,
              publicId: uploadResult.public_id,
              url: uploadResult.secure_url,
              resolution: `${uploadResult.width}`,
              format: uploadResult.format,
              alt: file.name,
            });

            processedFiles++;
            setUploadState((prev) => ({
              ...prev,
              progress: (processedFiles / totalFiles) * 100,
            }));

            toast.success(`Successfully uploaded ${file.name}`);
          } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
            toast.error(`Failed to upload ${file.name}. Please try again.`);
          }
        }

        // Handle video uploads
        for (const file of videoFiles) {
          try {
            const { uploadUrl, uploadId } = await createUploadUrl({ spaceId });

            await createVideo.mutateAsync({
              spaceId,
              filename: file.name,
              identifier: uploadId,
              bytes: file.size,
              alt: file.name,
            });

            const uploadResult = await uploadToMux(file, uploadUrl);
            if (!uploadResult.success) {
              throw new Error('Failed to upload to MUX');
            }

            processedFiles++;
            setUploadState((prev) => ({
              ...prev,
              progress: (processedFiles / totalFiles) * 100,
            }));

            toast.success(
              `${file.name} uploaded and processing. You'll be notified when it's ready.`
            );
          } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
            toast.error(`Failed to upload ${file.name}. Please try again.`);
          }
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload media. Please try again later.');
      } finally {
        setUploadState({ isUploading: false, progress: 0 });
      }
    },
    [spaceId, createVideo, createImage, acceptedTypes]
  );

  return {
    uploadState,
    handleUpload,
  };
}
