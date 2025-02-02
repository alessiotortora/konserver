import { createHmac } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { videos } from '@/db/schema/videos';

interface MuxAssetReadyEvent {
  type: 'video.asset.ready';
  data: {
    id: string;
    playback_ids: Array<{ id: string }>;
    duration: number;
    aspect_ratio: string;
    upload_id: string;
  };
}

interface MuxAssetErrorEvent {
  type: 'video.asset.errored';
  data: {
    id: string;
    upload_id: string;
  };
}

type MuxWebhookEvent = MuxAssetReadyEvent | MuxAssetErrorEvent;

function verifyMuxSignature(rawBody: string, signature: string, secret: string): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(rawBody);
  const hash = hmac.digest('hex');
  return hash === signature;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const muxSignature = request.headers.get('mux-signature');

    if (!muxSignature) {
      return new NextResponse('No signature', { status: 400 });
    }

    if (!process.env.MUX_WEBHOOK_SECRET) {
      throw new Error('MUX_WEBHOOK_SECRET is not configured');
    }

    // Verify the webhook signature
    const isValid = verifyMuxSignature(rawBody, muxSignature, process.env.MUX_WEBHOOK_SECRET);

    if (!isValid) {
      return new NextResponse('Invalid signature', { status: 400 });
    }

    // Parse the event
    const event = JSON.parse(rawBody) as MuxWebhookEvent;

    if (event.type === 'video.asset.ready') {
      const asset = event.data.id;
      const playbackId = event.data.playback_ids?.[0]?.id;
      const duration = event.data.duration;
      const aspectRatio = event.data.aspect_ratio;

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
