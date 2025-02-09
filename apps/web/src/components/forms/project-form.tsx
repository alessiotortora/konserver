'use client';

import type { ProjectWithContent } from '@/db/schema/types';
import { useSpaceImages, useSpaceVideos } from '@/hooks/use-space-media';
import { createProject } from '@/lib/actions/create/create-project';
import { updateProject } from '@/lib/actions/update/update-project';
import { type CreateProjectSchema, createProjectSchema } from '@/lib/schemas/project';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { MediaSelector } from '../media/media-selector';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface ProjectFormProps {
  spaceId: string;
  project?: ProjectWithContent;
  contentId?: string;
}

export function ProjectForm({ spaceId, project, contentId }: ProjectFormProps) {
  const router = useRouter();
  const availableImages = useSpaceImages(spaceId);
  const availableVideos = useSpaceVideos(spaceId);

  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: project?.content.title || '',
      description: project?.content.description || '',
      year: project?.year || new Date().getFullYear(),
      tags: project?.content.tags || [],
      details: (project?.details as Record<string, unknown>) || {},
      status: project?.content.status || 'draft',
      coverImageId: project?.content.coverImage?.id || null,
      coverVideoId: project?.content.coverVideo?.id || null,
      images: project?.images?.map((img) => img.id) || [],
      videos: project?.videos?.map((vid) => vid.id) || [],
    },
  });

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="space-y-4">
          <div>
            <FormLabel>Cover Image</FormLabel>
            <FormField
              control={form.control}
              name="coverImageId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MediaSelector
                      type="image"
                      items={availableImages}
                      selectedId={field.value || undefined}
                      onSelect={field.onChange}
                      triggerLabel={field.value ? 'Change Cover Image' : 'Select Cover Image'}
                      spaceId={spaceId}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Cover Video</FormLabel>
            <FormField
              control={form.control}
              name="coverVideoId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MediaSelector
                      type="video"
                      items={availableVideos}
                      selectedId={field.value || undefined}
                      onSelect={field.onChange}
                      triggerLabel={field.value ? 'Change Cover Video' : 'Select Cover Video'}
                      spaceId={spaceId}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Project Images</FormLabel>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {field.value?.map((imageId) => {
                        const image = availableImages.find((img) => img.id === imageId);
                        return (
                          image && (
                            <div
                              key={imageId}
                              className="relative h-20 w-20 overflow-hidden rounded-md border"
                            >
                              <Image
                                src={image.url}
                                alt={image.alt || ''}
                                className="object-cover"
                                fill
                                sizes="80px"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6"
                                onClick={() =>
                                  field.onChange(field.value?.filter((id) => id !== imageId))
                                }
                              >
                                ×
                              </Button>
                            </div>
                          )
                        );
                      })}
                      <MediaSelector
                        type="image"
                        items={availableImages.filter((img) => !field.value?.includes(img.id))}
                        onSelect={(id) => field.onChange([...(field.value || []), id])}
                        triggerLabel="Add Image"
                        spaceId={spaceId}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Project Videos</FormLabel>
            <FormField
              control={form.control}
              name="videos"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {field.value?.map((videoId) => {
                        const video = availableVideos.find((vid) => vid.id === videoId);
                        return (
                          video && (
                            <div
                              key={videoId}
                              className="relative aspect-video w-40 overflow-hidden rounded-md border bg-muted"
                            >
                              <div className="absolute inset-0 flex items-center justify-center p-2">
                                <span className="text-sm text-muted-foreground">
                                  {video.alt || video.playbackId}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6"
                                onClick={() =>
                                  field.onChange(field.value?.filter((id) => id !== videoId))
                                }
                              >
                                ×
                              </Button>
                            </div>
                          )
                        );
                      })}
                      <MediaSelector
                        type="video"
                        items={availableVideos.filter((vid) => !field.value?.includes(vid.id))}
                        onSelect={(id) => field.onChange([...(field.value || []), id])}
                        triggerLabel="Add Video"
                        spaceId={spaceId}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" variant="outline" onClick={() => form.setValue('status', 'draft')}>
            {project ? 'Save as Draft' : 'Create as Draft'}
          </Button>
          <Button type="submit" onClick={() => form.setValue('status', 'published')}>
            {project ? 'Save & Publish' : 'Create & Publish'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
