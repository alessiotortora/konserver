import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import type {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoUploadAssetCreatedWebhookEvent,
} from '@mux/mux-node/resources/webhooks';

import { db } from '@/db';
import { videoStatusEnum, videos } from '@/db/schema/videos';
import { muxClient } from '@/utils/mux/client';
import { headers } from 'next/headers';

/**
 * Type definition for all possible webhook events from Mux
 */
type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoUploadAssetCreatedWebhookEvent;

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

/**
 * Webhook handler for Mux video processing events
 * This is a server-side operation, so we use direct DB queries
 * After each status update, we invalidate both server and client caches
 * to ensure UI updates immediately
 */
export async function POST(request: Request) {
  if (!SIGNING_SECRET) {
    return new NextResponse('Missing signing secret', { status: 500 });
  }

  const headersList = await headers();
  const signature = headersList.get('mux-signature');

  if (!signature) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const event: WebhookEvent = await request.json();
  const body = JSON.stringify(event);
  muxClient.webhooks.verifySignature(body, { 'mux-signature': signature }, SIGNING_SECRET);

  try {
    switch (event.type) {
      case 'video.upload.asset_created': {
        // No need to do anything here, we'll handle everything in video.asset.created
        break;
      }
      case 'video.asset.created': {
        const asset = event.data;
        const playbackId = asset.playback_ids?.[0]?.id;

        if (!asset.upload_id) {
          return new NextResponse('Upload ID not found', { status: 400 });
        }

        // Update video record with asset details
        await db
          .update(videos)
          .set({
            assetId: asset.id,
            playbackId,
            status: videoStatusEnum.enumValues[0], // 'processing'
            duration: asset.duration,
            aspectRatio: `${asset.aspect_ratio}`,
          })
          .where(eq(videos.identifier, asset.upload_id));

     
        break;
      }
      case 'video.asset.ready': {
        const asset = event.data;

        // Update video with final details
        await db
          .update(videos)
          .set({
            status: videoStatusEnum.enumValues[1], // 'ready'
            duration: asset.duration,
            aspectRatio: `${asset.aspect_ratio}`,
          })
          .where(eq(videos.assetId, asset.id));

      
        break;
      }
      case 'video.asset.errored': {
        const asset = event.data;

        // Update video status to failed
        await db
          .update(videos)
          .set({
            status: videoStatusEnum.enumValues[2], // 'failed'
          })
          .where(eq(videos.assetId, asset.id));

    
        break;
      }
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
