'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { MediaUploader } from './media-uploader';
import { uploadToCloudinary } from '@/lib/media/images/upload-to-cloudinary';
import { uploadMedia } from '@/lib/media/upload-media';
import { createUploadSignature } from '@/lib/media/images/create-upload-signature';

interface AddMediaPopoverProps {
  spaceId: string;
}

export function AddMediaPopover({ spaceId }: AddMediaPopoverProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);

    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    const videoFiles = files.filter((file) => file.type.startsWith('video/'));

    try {
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {

          const {signature, timestamp} = await createUploadSignature({ spaceId })

          console.log(signature, timestamp)

          const {public_id, secure_url, width, format, bytes, alt} = await uploadToCloudinary(file, signature, timestamp)
  
          console.log(public_id, secure_url, width, format, bytes, alt)
        }
      }
       
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

