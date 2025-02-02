'use server';

import { db } from "@/db";
import { videos, videoStatusEnum } from "@/db/schema";

export async function createVideo(spaceId: string, identifier: string, assetId: string, playbackId: string, alt: string, filename: string) {

    
    try {
        const [video] = await db.insert(videos).values({
            spaceId,
            filename,
            identifier,
            status: videoStatusEnum.enumValues[0],   
            assetId,
            playbackId,
            alt
        }).returning();

        return video;
    } catch (error) {
        console.error('Error creating video:', error)
        throw new Error('Failed to create video')
    }
    
}