'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UploadCloud, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { type FileRejection, useDropzone } from 'react-dropzone';

interface MediaFile extends File {
  preview?: string;
}

interface MediaUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
  className?: string;
}

export function MediaUploader({
  onUpload,
  maxFiles = 10,
  maxSize = 1024 * 1024 * 500, // 500MB
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'video/*': ['.mp4', '.webm', '.ogg'],
  },
  className,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(({ file, errors }) => {
          if (errors[0]?.code === 'file-too-large') {
            return `${file.name} is too large. Max size is ${Math.floor(maxSize / (1024 * 1024))}MB`;
          }
          return `${file.name}: ${errors[0]?.message}`;
        });
        setError(errors.join(', '));
        return;
      }

      setError(null);
      setFiles((prev) => [
        ...prev,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - files.length,
    maxSize,
    accept,
  });

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== name));
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      setError(null);
      await onUpload(files);
      setFiles([]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-muted-foreground/25 hover:border-primary'
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select files'}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.name} className="flex items-center justify-between p-2 border rounded">
                <div className="flex flex-col flex-1 mr-2">
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFiles([])} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
