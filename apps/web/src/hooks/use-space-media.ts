import { trpc } from '@/trpc/client';

export function useSpaceImages(spaceId: string) {
  const [images] = trpc.image.getImages.useSuspenseQuery(
    { spaceId },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  return images;
}

export function useSpaceVideos(spaceId: string) {
  const [videos] = trpc.video.getVideos.useSuspenseQuery(
    { spaceId },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  return videos;
}
