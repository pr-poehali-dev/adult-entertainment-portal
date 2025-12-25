import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface PhotoRejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  photoUrl: string;
  userName: string;
}

const QUICK_REASONS = [
  'Неприемлемый контент',
  'Нарушение правил платформы',
  'Низкое качество фото',
  'Не соответствует категории',
  'Чужая фотография',
  'Содержит текст/рекламу'
];

export const PhotoRejectDialog = ({
  isOpen,
  onClose,
  onConfirm,
  photoUrl,
  userName
}: PhotoRejectDialogProps) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert('Укажите причину отклонения');
      return;
    }
    onConfirm(reason);
    setReason('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} className="text-red-500" />
            Отклонить фотографию
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Icon name="User" size={16} />
            <span className="font-medium">{userName}</span>
          </div>

          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={photoUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Быстрый выбор причины:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_REASONS.map((quickReason) => (
                <Button
                  key={quickReason}
                  variant="outline"
                  size="sm"
                  onClick={() => setReason(quickReason)}
                  className={reason === quickReason ? 'border-primary bg-primary/10' : ''}
                >
                  {quickReason}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Причина отклонения <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Укажите подробную причину отклонения фотографии..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">{reason.length}/500</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="flex-1 gap-2"
            >
              <Icon name="X" size={18} />
              Отклонить фото
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
