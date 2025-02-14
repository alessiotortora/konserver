import type { Image } from '@/db/schema/types';
import type { Video } from '@/db/schema/videos';
import { trpc } from '@/trpc/client';

export function useSpaceImages(spaceId: string) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    trpc.image.getImages.useInfiniteQuery(
      {
        spaceId,
        limit: 20,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      }
    );

  const images = data?.pages.flatMap((page) => page.items) ?? [];

  // Return both the array for backward compatibility and the pagination data
  const imagesArray = images as Image[] & {
    hasNextPage: boolean;
    fetchNextPage: typeof fetchNextPage;
    isFetchingNextPage: boolean;
    isLoading: boolean;
  };
  Object.assign(imagesArray, { hasNextPage, fetchNextPage, isFetchingNextPage, isLoading });

  return imagesArray;
}

export function useSpaceVideos(spaceId: string) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    trpc.video.getVideos.useInfiniteQuery(
      {
        spaceId,
        limit: 20,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      }
    );

  const videos = data?.pages.flatMap((page) => page.items) ?? [];

  // Return both the array for backward compatibility and the pagination data
  const videosArray = videos as Video[] & {
    hasNextPage: boolean;
    fetchNextPage: typeof fetchNextPage;
    isFetchingNextPage: boolean;
    isLoading: boolean;
  };
  Object.assign(videosArray, { hasNextPage, fetchNextPage, isFetchingNextPage, isLoading });

  return videosArray;
}
