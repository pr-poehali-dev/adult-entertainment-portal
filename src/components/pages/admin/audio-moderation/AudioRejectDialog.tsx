import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { UserAd } from '@/types';

interface AudioRejectDialogProps {
  open: boolean;
  selectedAd: UserAd | null;
  rejectReason: string;
  onRejectReasonChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AudioRejectDialog = ({
  open,
  selectedAd,
  rejectReason,
  onRejectReasonChange,
  onConfirm,
  onCancel,
}: AudioRejectDialogProps) => {
  const commonReasons = [
    'Нецензурная лексика',
    'Реклама сторонних ресурсов',
    'Не соответствует описанию объявления',
    'Низкое качество записи',
    'Нарушение правил платформы',
    'Упоминание запрещенных товаров/услуг'
  ];

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отклонить аудио-приветствие</DialogTitle>
          <DialogDescription>
            Объявление #{selectedAd?.id}: {selectedAd?.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Выберите причину или введите свою:
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {commonReasons.map((reason) => (
                <Button
                  key={reason}
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs h-auto py-2"
                  onClick={() => onRejectReasonChange(reason)}
                >
                  {reason}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Причина отклонения:
            </label>
            <Textarea
              placeholder="Укажите причину отклонения аудио..."
              value={rejectReason}
              onChange={(e) => onRejectReasonChange(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Эта причина будет отправлена автору объявления в уведомлении
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
            disabled={!rejectReason.trim()}
          >
            <Icon name="XCircle" size={16} className="mr-2" />
            Отклонить аудио
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
