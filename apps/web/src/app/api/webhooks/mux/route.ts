import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { videos } from '@/db/schema/videos';
import { headers } from 'next/headers';

export interface WebhookEvent {
  type: string;
  data: {
    id: string;
    status: string;
    playback_ids?: Array<{ id: string }>;
  };
}

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const signature = (await headersList).get('mux-signature');

    if (!signature) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const event: WebhookEvent = await request.json();

    if (event.type === 'video.asset.ready') {
      const asset = event.data.id;
      const playbackId = event.data.playback_ids?.[0]?.id;

      if (!playbackId) {
        return new NextResponse('No playback ID', { status: 400 });
      }

      await db
        .update(videos)
        .set({
          assetId: asset,
          playbackId,
          status: 'ready',
          duration,
          aspectRatio,
        })
        .where(eq(videos.identifier, event.data.upload_id));
    }

    if (event.type === 'video.asset.errored') {
      await db
        .update(videos)
        .set({
          status: 'failed',
        })
        .where(eq(videos.identifier, event.data.upload_id));
    }

    return new NextResponse('OK');
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse(error instanceof Error ? error.message : 'Internal server error', {
      status: 500,
    });
  }
}

export const runtime = 'edge';
