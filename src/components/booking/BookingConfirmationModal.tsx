import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/types';
import Icon from '@/components/ui/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  userRole: 'buyer' | 'seller';
  onConfirm: () => void;
  onReject: () => void;
}

export const BookingConfirmationModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  userRole,
  onConfirm,
  onReject
}: BookingConfirmationModalProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!booking || !booking.expiresAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(booking.expiresAt!).getTime();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      setTimeLeft(diff);

      if (diff === 0) {
        onClose();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [booking, onClose]);

  if (!booking) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Clock" size={24} className="text-primary" />
            {userRole === 'seller' ? 'Новое бронирование' : 'Ожидание подтверждения'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-yellow-500 bg-yellow-500/10">
            <AlertDescription className="flex items-center gap-2">
              <Icon name="Timer" size={18} className="text-yellow-600" />
              <div>
                <span className="font-semibold text-yellow-600">
                  Осталось времени: {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
                <p className="text-xs text-yellow-600 mt-1">
                  {userRole === 'seller' 
                    ? 'Подтвердите или отклоните запрос до истечения времени'
                    : 'Продавец должен ответить в течение 15 минут'
                  }
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Услуга:</span>
              <span className="font-semibold">{booking.serviceName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {userRole === 'seller' ? 'Клиент:' : 'Продавец:'}
              </span>
              <span className="font-semibold">
                {userRole === 'seller' ? booking.buyerName : booking.sellerName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Дата и время:</span>
              <span className="font-semibold">
                {new Date(booking.date).toLocaleDateString()} в {booking.time}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Длительность:</span>
              <span className="font-semibold">{booking.duration} ч</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Стоимость:</span>
              <span className="text-2xl font-bold text-primary">
                {booking.totalPrice.toLocaleString()} {booking.currency}
              </span>
            </div>
          </div>

          {userRole === 'seller' && (
            <Alert className="border-blue-500 bg-blue-500/10">
              <AlertDescription>
                <div className="flex items-start gap-2 text-sm text-blue-600">
                  <Icon name="Info" size={16} className="mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">После подтверждения:</p>
                    <p className="text-xs">
                      Средства клиента будут заморожены на эскроу-счёте до завершения встречи
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {userRole === 'seller' ? (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onReject}
                className="flex-1 border-red-500 text-red-600 hover:bg-red-500/10"
              >
                <Icon name="X" size={18} />
                Отклонить
              </Button>
              <Button 
                onClick={onConfirm}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                <Icon name="Check" size={18} />
                Подтвердить
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={onClose} className="w-full">
              Закрыть
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
