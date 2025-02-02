'use server'

import { createImage } from "../actions/create/create-image";
import { createVideo } from "../actions/create/create-video";
import { uploadToCloudinary } from "./images/upload-to-cloudinary";
import { checkUploadStatus } from "./videos/check-status";
import { createUploadUrl } from "./videos/create-upload-url";
import { uploadToMux } from "./videos/upload-to-mux";

export async function uploadMedia(
  files: File[],
  spaceId: string,
) {

    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    const videoFiles = files.filter((file) => file.type.startsWith('video/'));

    if (imageFiles.length > 0) {
      for (const file of imageFiles) {

        console.log(file)
      }

    if (videoFiles.length > 0) {
      for (const file of videoFiles) {

        console.log(file)

        // create upload url
        const { uploadUrl, uploadId } = await createUploadUrl({
            spaceId,
          });

        // upload to mux
        const muxResponse = await uploadToMux(file, uploadUrl);

        console.log(muxResponse)

        if (muxResponse.ok) {
          const { status, assetId, playbackId } = await checkUploadStatus(uploadId);
          
          if (!assetId || !playbackId) {
            throw new Error('Failed to retrieve assetId or playbackId');
          }
            await createVideo(spaceId, file.name, assetId, playbackId, file.name, file.name);
        }

      }
    }

  }
}
 