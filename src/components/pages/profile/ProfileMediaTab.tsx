import { MediaUploadCard } from '@/components/media/MediaUploadCard';
import { Profile } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface ProfileMediaTabProps {
  profile: Profile;
  onProfileUpdate?: (updatedProfile: Partial<Profile>) => void;
}

export const ProfileMediaTab = ({ profile, onProfileUpdate }: ProfileMediaTabProps) => {
  const handleAudioUpload = (files: File[]) => {
    const audioUrl = URL.createObjectURL(files[0]);
    onProfileUpdate?.({ audioGreeting: audioUrl });
  };

  const handleAudioRemove = () => {
    onProfileUpdate?.({ audioGreeting: null });
  };

  const handleVideoUpload = (files: File[]) => {
    const videoUrl = URL.createObjectURL(files[0]);
    onProfileUpdate?.({ promoVideo: videoUrl });
  };

  const handleVideoRemove = () => {
    onProfileUpdate?.({ promoVideo: null });
  };

  const handlePhotosUpload = (files: File[]) => {
    const currentPhotos = profile.profilePhotos || [];
    const newPhotoUrls = files.map(file => URL.createObjectURL(file));
    const updatedPhotos = [...currentPhotos, ...newPhotoUrls].slice(0, 3);
    onProfileUpdate?.({ profilePhotos: updatedPhotos });
  };

  const handlePhotoRemove = (index?: number) => {
    if (index === undefined) return;
    const currentPhotos = profile.profilePhotos || [];
    const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
    onProfileUpdate?.({ profilePhotos: updatedPhotos });
  };

  if (profile.role !== 'seller') {
    return (
      <Alert className="border-yellow-500 bg-yellow-500/10">
        <AlertDescription className="text-sm text-yellow-600 flex items-center gap-2">
          <Icon name="AlertTriangle" size={16} />
          Медиа-контент доступен только для продавцов
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="border-primary bg-primary/10">
        <AlertDescription className="text-sm">
          <div className="flex items-start gap-2">
            <Icon name="Sparkles" size={16} className="text-primary mt-0.5" />
            <div className="text-primary">
              <strong className="block mb-1">Привлеките больше клиентов</strong>
              <p>
                Добавьте аудио приветствие, промо-видео и фото, чтобы показать себя с лучшей стороны. 
                Профили с медиа-контентом получают на 70% больше просмотров!
              </p>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <MediaUploadCard
        type="audio"
        currentMedia={profile.audioGreeting}
        onUpload={handleAudioUpload}
        onRemove={handleAudioRemove}
      />

      <MediaUploadCard
        type="video"
        currentMedia={profile.promoVideo}
        onUpload={handleVideoUpload}
        onRemove={handleVideoRemove}
      />

      <MediaUploadCard
        type="photos"
        currentMedia={profile.profilePhotos}
        onUpload={handlePhotosUpload}
        onRemove={handlePhotoRemove}
      />
    </div>
  );
};
