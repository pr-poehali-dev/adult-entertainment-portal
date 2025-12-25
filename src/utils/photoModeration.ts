export interface PhotoModerationResult {
  success: boolean;
  approved?: boolean;
  confidence?: number;
  reason?: string;
  moderationId?: number;
}

export const submitPhotoForModeration = async (
  photoFile: File | string,
  userId: number,
  userName: string,
  userAvatar: string,
  photoType: 'avatar' | 'profile' | 'catalog'
): Promise<PhotoModerationResult> => {
  try {
    let base64Image: string;

    if (typeof photoFile === 'string') {
      if (photoFile.startsWith('data:')) {
        base64Image = photoFile.split(',')[1];
      } else {
        const response = await fetch(photoFile);
        const blob = await response.blob();
        const dataUrl = await blobToBase64(blob);
        base64Image = dataUrl.split(',')[1];
      }
    } else {
      const dataUrl = await fileToBase64(photoFile);
      base64Image = dataUrl.split(',')[1];
    }

    const moderationItem = {
      id: Date.now(),
      userId,
      userName,
      userAvatar,
      photoUrl: typeof photoFile === 'string' ? photoFile : URL.createObjectURL(photoFile),
      photoType,
      uploadedAt: new Date().toISOString(),
      status: 'pending' as const
    };

    const existingPhotos = localStorage.getItem('pending_photo_moderation');
    const photos = existingPhotos ? JSON.parse(existingPhotos) : [];
    photos.push(moderationItem);
    localStorage.setItem('pending_photo_moderation', JSON.stringify(photos));

    console.log('Фото отправлено на модерацию:', moderationItem);

    return {
      success: true,
      moderationId: moderationItem.id
    };
  } catch (error) {
    console.error('Ошибка при отправке фото на модерацию:', error);
    return {
      success: false
    };
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const getPendingPhotoModeration = () => {
  const existingPhotos = localStorage.getItem('pending_photo_moderation');
  return existingPhotos ? JSON.parse(existingPhotos) : [];
};

export const clearPendingPhotoModeration = () => {
  localStorage.removeItem('pending_photo_moderation');
};

export const removeFromPendingModeration = (moderationId: number) => {
  const photos = getPendingPhotoModeration();
  const filtered = photos.filter((p: any) => p.id !== moderationId);
  localStorage.setItem('pending_photo_moderation', JSON.stringify(filtered));
};
