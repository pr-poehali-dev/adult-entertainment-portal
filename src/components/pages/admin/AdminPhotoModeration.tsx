import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Notification } from '@/types';
import { PhotoModerationCard, PhotoModerationItem } from './photo-moderation/PhotoModerationCard';
import { PhotoModerationStats } from './photo-moderation/PhotoModerationStats';
import { PhotoRejectDialog } from './photo-moderation/PhotoRejectDialog';
import { getPendingPhotoModeration } from '@/utils/photoModeration';

interface AdminPhotoModerationProps {
  onAddNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
}

const MOCK_PHOTOS: PhotoModerationItem[] = [
  {
    id: 1,
    userId: 1,
    userName: 'Анна Сергеева',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    photoType: 'avatar',
    uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Мария Иванова',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    photoType: 'profile',
    uploadedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  },
  {
    id: 3,
    userId: 3,
    userName: 'Елена Петрова',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    photoType: 'catalog',
    uploadedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'pending'
  }
];

export const AdminPhotoModeration = ({ onAddNotification }: AdminPhotoModerationProps) => {
  const [photos, setPhotos] = useState<PhotoModerationItem[]>([]);
  
  useEffect(() => {
    const loadPhotos = () => {
      const pendingPhotos = getPendingPhotoModeration();
      const combinedPhotos = [...MOCK_PHOTOS, ...pendingPhotos];
      setPhotos(combinedPhotos);
    };
    
    loadPhotos();
    
    const interval = setInterval(loadPhotos, 5000);
    
    return () => clearInterval(interval);
  }, []);
  const [activeTab, setActiveTab] = useState('pending');
  const [rejectDialog, setRejectDialog] = useState<{ isOpen: boolean; photo: PhotoModerationItem | null }>({
    isOpen: false,
    photo: null
  });
  const [processingPhotoId, setProcessingPhotoId] = useState<number | null>(null);
  const [photoStatuses, setPhotoStatuses] = useState<Record<number, 'pending' | 'approved' | 'rejected'>>({});

  const handleAIModeration = async (photo: PhotoModerationItem) => {
    setProcessingPhotoId(photo.id);

    try {
      const response = await fetch(photo.photoUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Image = (reader.result as string).split(',')[1];

        const apiResponse = await fetch('https://functions.poehali.dev/57477bf8-1a61-49bd-af8e-28c9e3e929e9', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Image,
            userName: photo.userName,
            photoType: photo.photoType
          })
        });

        const result = await apiResponse.json();

        setPhotos(prevPhotos =>
          prevPhotos.map(p =>
            p.id === photo.id
              ? {
                  ...p,
                  aiAnalysis: {
                    isApproved: result.approved,
                    reason: result.reason || '',
                    confidence: result.confidence || 0,
                    detectedContent: result.detectedContent || []
                  }
                }
              : p
          )
        );

        if (result.approved && result.confidence >= 90) {
          handleApprove(photo);
        }
      };
    } catch (error) {
      console.error('Ошибка AI-модерации:', error);
      alert('Ошибка при проверке фото. Попробуйте позже.');
    } finally {
      setProcessingPhotoId(null);
    }
  };

  const handleApprove = (photo: PhotoModerationItem) => {
    setPhotoStatuses(prev => ({ ...prev, [photo.id]: 'approved' }));
    setPhotos(prevPhotos =>
      prevPhotos.map(p => (p.id === photo.id ? { ...p, status: 'approved' as const } : p))
    );

    onAddNotification({
      type: 'photo_approved',
      title: 'Фото одобрено',
      text: 'Ваша фотография прошла модерацию и теперь видна другим пользователям',
      photoType: photo.photoType
    });
  };

  const handleReject = (photo: PhotoModerationItem) => {
    setRejectDialog({ isOpen: true, photo });
  };

  const confirmReject = (reason: string) => {
    if (!rejectDialog.photo) return;

    const photo = rejectDialog.photo;
    setPhotoStatuses(prev => ({ ...prev, [photo.id]: 'rejected' }));
    setPhotos(prevPhotos =>
      prevPhotos.map(p => (p.id === photo.id ? { ...p, status: 'rejected' as const } : p))
    );

    onAddNotification({
      type: 'photo_rejected',
      title: 'Фото отклонено',
      text: `Ваша фотография не прошла модерацию. Причина: ${reason}`,
      moderatorNote: reason,
      photoType: photo.photoType
    });

    setRejectDialog({ isOpen: false, photo: null });
  };

  const handleUndo = (photo: PhotoModerationItem) => {
    setPhotoStatuses(prev => ({ ...prev, [photo.id]: 'pending' }));
    setPhotos(prevPhotos =>
      prevPhotos.map(p => (p.id === photo.id ? { ...p, status: 'pending' as const } : p))
    );
  };

  const pendingPhotos = photos.filter(p => (photoStatuses[p.id] || p.status) === 'pending');
  const approvedPhotos = photos.filter(p => (photoStatuses[p.id] || p.status) === 'approved');
  const rejectedPhotos = photos.filter(p => (photoStatuses[p.id] || p.status) === 'rejected');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Icon name="Image" size={32} />
          Модерация фотографий
        </h2>
        <p className="text-muted-foreground">
          Проверка публичных изображений: аватары, фото профилей и каталога
        </p>
      </div>

      <PhotoModerationStats
        pendingCount={pendingPhotos.length}
        approvedCount={approvedPhotos.length}
        rejectedCount={rejectedPhotos.length}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            На модерации
            {pendingPhotos.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                {pendingPhotos.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Одобренные ({approvedPhotos.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Отклоненные ({rejectedPhotos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingPhotos.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="CheckCircle" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Нет фото на модерации</h3>
              <p className="text-muted-foreground">Все публичные фотографии проверены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pendingPhotos.map(photo => (
                <PhotoModerationCard
                  key={photo.id}
                  item={photo}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onAICheck={handleAIModeration}
                  isProcessing={processingPhotoId === photo.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {approvedPhotos.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Image" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Нет одобренных фотографий</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {approvedPhotos.map(photo => (
                <PhotoModerationCard
                  key={photo.id}
                  item={photo}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onAICheck={handleAIModeration}
                  onUndo={handleUndo}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {rejectedPhotos.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Image" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Нет отклоненных фотографий</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {rejectedPhotos.map(photo => (
                <PhotoModerationCard
                  key={photo.id}
                  item={photo}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onAICheck={handleAIModeration}
                  onUndo={handleUndo}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {rejectDialog.photo && (
        <PhotoRejectDialog
          isOpen={rejectDialog.isOpen}
          onClose={() => setRejectDialog({ isOpen: false, photo: null })}
          onConfirm={confirmReject}
          photoUrl={rejectDialog.photo.photoUrl}
          userName={rejectDialog.photo.userName}
        />
      )}
    </div>
  );
};