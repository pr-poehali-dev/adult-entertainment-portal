import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export interface PhotoModerationItem {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  photoUrl: string;
  photoType: 'avatar' | 'profile' | 'catalog';
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  aiAnalysis?: {
    isApproved: boolean;
    reason: string;
    confidence: number;
    detectedContent: string[];
  };
}

interface PhotoModerationCardProps {
  item: PhotoModerationItem;
  onApprove: (item: PhotoModerationItem) => void;
  onReject: (item: PhotoModerationItem) => void;
  onAICheck: (item: PhotoModerationItem) => void;
  onUndo?: (item: PhotoModerationItem) => void;
  isProcessing?: boolean;
}

export const PhotoModerationCard = ({
  item,
  onApprove,
  onReject,
  onAICheck,
  onUndo,
  isProcessing = false
}: PhotoModerationCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getPhotoTypeBadge = (type: string) => {
    switch (type) {
      case 'avatar':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
          <Icon name="User" size={12} className="mr-1" />
          Аватар
        </Badge>;
      case 'profile':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
          <Icon name="Image" size={12} className="mr-1" />
          Фото профиля
        </Badge>;
      case 'catalog':
        return <Badge variant="outline" className="bg-pink-500/10 text-pink-500">
          <Icon name="Grid" size={12} className="mr-1" />
          Каталог
        </Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500">На модерации</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Одобрено</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Отклонено</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="Loader2" size={32} className="animate-spin text-muted-foreground" />
          </div>
        )}
        <img
          src={item.photoUrl}
          alt="Модерация"
          className={`w-full h-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {getPhotoTypeBadge(item.photoType)}
          {getStatusBadge(item.status)}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={item.userAvatar}
            alt={item.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{item.userName}</p>
            <p className="text-xs text-muted-foreground">
              Загружено: {new Date(item.uploadedAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {item.aiAnalysis && (
          <div className={`p-3 rounded-lg border ${
            item.aiAnalysis.isApproved 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-start gap-2 mb-2">
              <Icon 
                name={item.aiAnalysis.isApproved ? 'CheckCircle' : 'AlertTriangle'} 
                size={16} 
                className={item.aiAnalysis.isApproved ? 'text-green-500' : 'text-red-500'} 
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  AI-анализ: {item.aiAnalysis.isApproved ? 'Рекомендует одобрить' : 'Требует проверки'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Уверенность: {item.aiAnalysis.confidence}%
                </p>
              </div>
            </div>
            
            {item.aiAnalysis.detectedContent.length > 0 && (
              <div className="mt-2 text-xs">
                <p className="font-medium mb-1">Обнаружено:</p>
                <div className="flex flex-wrap gap-1">
                  {item.aiAnalysis.detectedContent.map((content, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {content}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {item.aiAnalysis.reason && (
              <p className="text-xs mt-2 text-muted-foreground">
                <strong>Причина:</strong> {item.aiAnalysis.reason}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          {item.status === 'pending' && (
            <>
              <Button
                onClick={() => onAICheck(item)}
                variant="outline"
                className="w-full gap-2"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Анализ...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={16} />
                    AI-проверка
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => onApprove(item)}
                  variant="default"
                  className="bg-green-500 hover:bg-green-600 gap-2"
                >
                  <Icon name="Check" size={16} />
                  Одобрить
                </Button>
                <Button
                  onClick={() => onReject(item)}
                  variant="destructive"
                  className="gap-2"
                >
                  <Icon name="X" size={16} />
                  Отклонить
                </Button>
              </div>
            </>
          )}

          {item.status !== 'pending' && onUndo && (
            <Button
              onClick={() => onUndo(item)}
              variant="outline"
              className="w-full gap-2"
            >
              <Icon name="RotateCcw" size={16} />
              Отменить решение
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
