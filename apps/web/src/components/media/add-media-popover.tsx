'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { uploadMedia } from '@/lib/actions/client/upload-media';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { MediaUploader } from './media-uploader';

interface AddMediaPopoverProps {
  spaceId: string;
}

export function AddMediaPopover({ spaceId }: AddMediaPopoverProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);

    try {
      const uploadPromise = () =>
        new Promise<void>((resolve, reject) => {
          uploadMedia(files, spaceId, (filename, progress) => {
            // You can use this to update a progress UI if needed
            console.log(`${filename}: ${progress}%`);
          })
            .then((results) => {
              if (!results.success) {
                reject(new Error(results.error || 'Upload failed'));
                return;
              }
              resolve();
            })
            .catch(reject);
        });

      await toast.promise(uploadPromise(), {
        loading: 'Uploading media...',
        success: 'Media uploaded successfully',
        error: (error) => error.message || 'Failed to upload media',
      });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={isUploading}>
          <Plus className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Add Media'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4" align="end">
        <div className="space-y-4">
          <h3 className="font-medium leading-none">Upload Media</h3>
          <p className="text-sm text-muted-foreground">
            Upload images and videos to your media library.
          </p>
          <MediaUploader onUpload={handleUpload} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
