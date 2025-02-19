'use client';

import DetailsInput from '@/components/ui/details-input';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TagInput } from '@/components/ui/tag-input';
import { Textarea } from '@/components/ui/textarea';
import type { ProjectWithContent } from '@/db/schema/types';
import { useSpaceImages, useSpaceVideos } from '@/hooks/use-space-media';
import { useVideoRealtimeUpdates } from '@/hooks/use-video-realtime-updates';
import { createProject } from '@/lib/actions/create/create-project';
import { updateProject } from '@/lib/actions/update/update-project';
import { type CreateProjectSchema, createProjectSchema } from '@/lib/schemas/project';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { StickyBar } from '../layout/sticky-bar';
import { MediaManager } from '../media/media-manager';
import { MediaThumbnail } from '../media/media-thumbnail';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

interface ProjectFormProps {
  spaceId: string;
  project?: ProjectWithContent;
  contentId?: string;
}

export function ProjectForm({ spaceId, project, contentId }: ProjectFormProps) {
  const router = useRouter();
  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: project?.content.title || '',
      cover: project?.content.coverImage
        ? {
            type: 'image',
            imageId: project.content.coverImage.id,
            videoId: null,
          }
        : project?.content.coverVideo
          ? {
              type: 'video',
              imageId: null,
              videoId: project.content.coverVideo.id,
            }
          : {
              type: 'none',
              imageId: null,
              videoId: null,
            },
      description: project?.content.description || '',
      year: project?.year || new Date().getFullYear(),
      tags: project?.content.tags || [],
      details: (project?.details as Record<string, unknown>) || {},
      images: project?.images?.map((img) => img.id) || [],
      videos: project?.videos?.map((vid) => vid.id) || [],
      status: project?.content.status || 'draft',
    },
  });

  const availableImages = useSpaceImages(spaceId);
  const availableVideos = useSpaceVideos(spaceId);

  // Enable real-time updates for videos
  useVideoRealtimeUpdates(spaceId);

  async function onSubmit(values: CreateProjectSchema) {
    if (project && contentId) {
      // Update existing project
      const result = await updateProject(spaceId, project.id, contentId, values);

      if (!result.success) {
        toast.error(result.error || 'Something went wrong');
        return;
      }

      toast.success('Project updated successfully');
    } else {
      // Create new project
      const result = await createProject(spaceId, values);

      if (!result.success) {
        toast.error(result.error || 'Something went wrong');
        return;
      }

      toast.success('Project created successfully');
    }

    router.push(`/dashboard/${spaceId}/projects`);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 1. Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter project title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. Cover Section */}
        <FormField
          control={form.control}
          name="cover.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <label htmlFor="none">None</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="image" id="image" />
                    <label htmlFor="image">Image</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="video" id="video" />
                    <label htmlFor="video">Video</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('cover.type') === 'image' && (
          <FormField
            control={form.control}
            name="cover.imageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <MediaManager
                      type="image"
                      items={availableImages}
                      selectedIds={field.value ? [field.value] : []}
                      onSelect={(id) => {
                        // If clicking the same image, deselect it
                        if (id === field.value) {
                          field.onChange(null);
                        } else {
                          field.onChange(id);
                        }
                        form.setValue('cover.videoId', null);
                      }}
                      triggerLabel={field.value ? 'Change Cover Image' : 'Select Cover Image'}
                      spaceId={spaceId}
                      maxSelection={1}
                      mode="all"
                    />
                    {field.value && (
                      <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-lg border">
                        {(() => {
                          // Look in available images first, then fall back to project data
                          const availableImage = availableImages.find(
                            (img) => img.id === field.value
                          );
                          const projectImage = project?.content.coverImage;
                          // Use whichever image we found
                          const image = availableImage || projectImage;

                          if (!image?.url) return null;
                          return (
                            <Image
                              src={image.url}
                              alt={image.alt || 'Cover preview'}
                              className="object-cover"
                              fill
                              sizes="(max-width: 768px) 100vw, 768px"
                              priority
                            />
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch('cover.type') === 'video' && (
          <FormField
            control={form.control}
            name="cover.videoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Video</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <MediaManager
                      type="video"
                      items={availableVideos}
                      selectedIds={field.value ? [field.value] : []}
                      onSelect={(id) => {
                        // If clicking the same video, deselect it
                        if (id === field.value) {
                          field.onChange(null);
                        } else {
                          field.onChange(id);
                        }
                        form.setValue('cover.imageId', null);
                      }}
                      triggerLabel={field.value ? 'Change Cover Video' : 'Select Cover Video'}
                      spaceId={spaceId}
                      maxSelection={1}
                      mode="all"
                    />
                    {field.value && (
                      <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-lg border bg-muted">
                        {(() => {
                          // Look in available videos first, then fall back to project data
                          const availableVideo = availableVideos.find(
                            (vid) => vid.id === field.value
                          );
                          const projectVideo = project?.content.coverVideo;
                          // Use whichever video we found
                          const video = availableVideo || projectVideo;

                          if (!video?.playbackId) return null;
                          return (
                            <Image
                              src={`https://image.mux.com/${video.playbackId}/thumbnail.jpg?time=0`}
                              alt={video.alt || 'Video thumbnail'}
                              className="object-cover"
                              fill
                              sizes="(max-width: 768px) 100vw, 768px"
                              priority
                            />
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* 3. Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter project description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 4. Year */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 5. Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInput
                  placeholder="Enter tags..."
                  tags={field.value || []}
                  setTags={(tags) => field.onChange(tags)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 6. Details */}
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details</FormLabel>
              <FormControl>
                <DetailsInput
                  details={field.value as Record<string, string>}
                  setDetails={(details) => field.onChange(details)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 7. Additional Project Images */}
        <div>
          <FormLabel>Project Images</FormLabel>
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <MediaManager
                        type="image"
                        items={availableImages}
                        selectedIds={field.value || []}
                        onSelect={(id) => {
                          const newImages = field.value || [];
                          if (newImages.includes(id)) {
                            field.onChange(newImages.filter((imageId) => imageId !== id));
                          } else {
                            field.onChange([...newImages, id]);
                          }
                        }}
                        triggerLabel="Add Image"
                        spaceId={spaceId}
                        maxSelection={8}
                      />
                    </div>
                    {field.value && field.value.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {field.value.map((imageId) => {
                          // Try to find the image in project data first
                          const projectImage = project?.images?.find((img) => img.id === imageId);
                          // If not in project data, look in available images
                          const availableImage = availableImages.find((img) => img.id === imageId);
                          // Use whichever image we found
                          const image = projectImage || availableImage;

                          if (!image) return null;

                          return (
                            <MediaThumbnail
                              key={imageId}
                              media={image}
                              onRemove={() =>
                                field.onChange(field.value?.filter((id) => id !== imageId))
                              }
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 8. Additional Project Videos */}
        <div>
          <FormLabel>Project Videos</FormLabel>
          <FormField
            control={form.control}
            name="videos"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <MediaManager
                        type="video"
                        items={availableVideos}
                        selectedIds={field.value || []}
                        onSelect={(id) => {
                          const newVideos = field.value || [];
                          if (newVideos.includes(id)) {
                            field.onChange(newVideos.filter((videoId) => videoId !== id));
                          } else {
                            field.onChange([...newVideos, id]);
                          }
                        }}
                        triggerLabel="Add Video"
                        spaceId={spaceId}
                        maxSelection={8}
                      />
                    </div>
                    {field.value && field.value.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {field.value.map((videoId) => {
                          // Try to find the video in project data first
                          const projectVideo = project?.videos?.find((vid) => vid.id === videoId);
                          // If not in project data, look in available videos
                          const availableVideo = availableVideos.find((vid) => vid.id === videoId);
                          // Use whichever video we found
                          const video = projectVideo || availableVideo;

                          if (!video) return null;

                          return (
                            <MediaThumbnail
                              key={videoId}
                              media={video}
                              onRemove={() =>
                                field.onChange(field.value?.filter((id) => id !== videoId))
                              }
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 9. Submission Buttons */}
        <StickyBar position="bottom">
          <div className="flex justify-between gap-4">
            <span className="text-sm text-muted-foreground">
              Last updated:{' '}
              {project?.updatedAt
                ? project.updatedAt.toISOString().split('T')[0].split('-').reverse().join('-')
                : ''}
            </span>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  form.setValue('status', 'draft');
                  await form.handleSubmit(onSubmit)();
                }}
              >
                {project ? 'Save as Draft' : 'Create as Draft'}
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  form.setValue('status', 'published');
                  await form.handleSubmit(onSubmit)();
                }}
              >
                {project ? 'Save & Publish' : 'Create & Publish'}
              </Button>
            </div>
          </div>
        </StickyBar>
      </form>
    </Form>
  );
}
