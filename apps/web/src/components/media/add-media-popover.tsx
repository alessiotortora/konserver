'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { createUploadSignature } from '@/lib/media/images/create-upload-signature';
import { uploadToCloudinary } from '@/lib/media/images/upload-to-cloudinary';
import { createUploadUrl } from '@/lib/media/videos/create-upload-url';
import { uploadToMux } from '@/lib/media/videos/upload-to-mux';
import { trpc } from '@/trpc/client';
import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { MediaUploader } from './media-uploader';

interface AddMediaPopoverProps {
  spaceId: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ACCEPTED_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  'video/*': ['.mp4', '.webm', '.ogg'],
};

export function AddMediaPopover({ spaceId }: AddMediaPopoverProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
  });

  const utils = trpc.useUtils();
  const createVideo = trpc.video.create.useMutation({
    onSuccess: () => {
      console.log('onSuccess');
      utils.video.getVideos.invalidate({ spaceId });
    },
  });

  const createImage = trpc.image.create.useMutation({
    onSuccess: () => {
      utils.image.getImages.invalidate({ spaceId });
    },
  });

  const handleUpload = useCallback(
    async (files: File[]) => {
      setUploadState({ isUploading: true, progress: 0 });

      const imageFiles = files.filter((file) => file.type.startsWith('image/'));
      const videoFiles = files.filter((file) => file.type.startsWith('video/'));
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
            // Step 1: Create upload URL from MUX
            const { uploadUrl, uploadId } = await createUploadUrl({ spaceId });

            // Step 2: Create initial video record with processing status
            await createVideo.mutateAsync({
              spaceId,
              filename: file.name,
              identifier: uploadId,
              bytes: file.size,
              alt: file.name,
            });

            // Step 3: Upload to MUX
            const result = await uploadToMux(file, uploadUrl);
            if (!result.success) {
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
    [spaceId, createVideo, createImage]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={uploadState.isUploading}
          aria-label={uploadState.isUploading ? 'Uploading media' : 'Add media'}
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {uploadState.isUploading ? `Uploading ${Math.round(uploadState.progress)}%` : 'Add Media'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4" align="end">
        <div className="space-y-4">
          <h3 className="font-medium leading-none">Upload Media</h3>
          <p className="text-sm text-muted-foreground">
            Upload images and videos to your media library. Maximum file size: 500MB.
          </p>
          <MediaUploader
            onUpload={handleUpload}
            disabled={uploadState.isUploading}
            maxSize={MAX_FILE_SIZE}
            accept={ACCEPTED_TYPES}
          />
          {uploadState.isUploading && (
            <div
              className="w-full bg-secondary rounded-full h-2.5"
              role="progressbar"
              aria-valuenow={Math.round(uploadState.progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={0}
            >
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadState.progress}%` }}
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
