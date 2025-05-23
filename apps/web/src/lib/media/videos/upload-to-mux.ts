interface MuxUploadResponse {
  success: boolean;
}

export async function uploadToMux(file: File, uploadUrl: string): Promise<MuxUploadResponse> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Failed to upload video to Mux');
  }

  return { success: true };
}
