import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Booking, WalletBalance, Currency } from '@/types';
import Icon from '@/components/ui/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface ActiveBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  userRole: 'buyer' | 'seller';
  userBalance: WalletBalance | null;
  onSellerReady: () => void;
  onBuyerReady: () => void;
  onExtend: (hours: number) => void;
}

export const ActiveBookingModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  userRole,
  userBalance,
  onSellerReady,
  onBuyerReady,
  onExtend
}: ActiveBookingModalProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!booking || booking.status !== 'in_progress' || !booking.remainingTime) return;

    setTimeLeft(booking.remainingTime);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          toast({
            title: "Время встречи истекло",
            description: "Оплаченное время завершено",
            variant: "destructive",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [booking, toast]);

  if (!booking) return null;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const totalSeconds = booking.duration * 3600;
  const progressPercent = (timeLeft / totalSeconds) * 100;

  const isVirtualSex = booking.serviceCategory === 'virtual';
  const extendOptions = isVirtualSex ? [10, 20, 30] : [1, 2, 3];
  const extendUnit = isVirtualSex ? 'мин' : 'ч';

  const handleExtend = (amount: number) => {
    let cost: number;
    if (isVirtualSex) {
      cost = (amount / 60) * booking.pricePerHour;
    } else {
      cost = amount * booking.pricePerHour;
    }
    
    if (userBalance && userBalance.amount < cost) {
      toast({
        title: "Недостаточно средств",
        description: `Для продления на ${amount} ${extendUnit} нужно ${cost.toFixed(2)} ${booking.currency}`,
        variant: "destructive",
      });
      return;
    }
    onExtend(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Clock" size={24} className="text-primary" />
            Активная встреча
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Статус */}
          <div className="space-y-3">
            {booking.status === 'confirmed' && (
              <Alert className="border-blue-500 bg-blue-500/10">
                <AlertDescription className="text-sm text-blue-600">
                  <Icon name="Info" size={16} className="inline mr-2" />
                  Ожидаем готовности обеих сторон к встрече
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-center gap-8 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                  booking.status === 'seller_ready' || booking.status === 'in_progress' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-muted-foreground/20 text-muted-foreground'
                }`}>
                  <Icon name="UserCheck" size={32} />
                </div>
                <div className="text-sm font-semibold">Продавец</div>
                <div className="text-xs text-muted-foreground">
                  {booking.status === 'seller_ready' || booking.status === 'in_progress' ? 'Готова' : 'Ожидание'}
                </div>
              </div>

              <Icon name="ArrowRight" size={24} className="text-muted-foreground" />

              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                  booking.status === 'in_progress' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-muted-foreground/20 text-muted-foreground'
                }`}>
                  <Icon name="UserCheck" size={32} />
                </div>
                <div className="text-sm font-semibold">Покупатель</div>
                <div className="text-xs text-muted-foreground">
                  {booking.status === 'in_progress' ? 'Готов' : 'Ожидание'}
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки готовности */}
          {booking.status === 'confirmed' && userRole === 'seller' && (
            <Button onClick={onSellerReady} className="w-full bg-green-500 hover:bg-green-600" size="lg">
              <Icon name="Check" size={20} />
              Готова
            </Button>
          )}

          {booking.status === 'seller_ready' && userRole === 'buyer' && (
            <Button onClick={onBuyerReady} className="w-full bg-green-500 hover:bg-green-600" size="lg">
              <Icon name="Check" size={20} />
              Готов
            </Button>
          )}

          {/* Таймер встречи */}
          {booking.status === 'in_progress' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Оставшееся время:</span>
                  <span className={`text-2xl font-bold ${timeLeft < 600 ? 'text-red-500' : 'text-primary'}`}>
                    {hours}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </div>

              {timeLeft < 600 && (
                <Alert className="border-yellow-500 bg-yellow-500/10">
                  <AlertDescription className="text-sm text-yellow-600">
                    <Icon name="AlertTriangle" size={16} className="inline mr-2" />
                    Осталось менее 10 минут. Рекомендуем продлить встречу.
                  </AlertDescription>
                </Alert>
              )}

              {/* Продление */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Продлить встречу:</span>
                  <span className="text-sm text-muted-foreground">
                    Баланс: {userBalance?.amount.toLocaleString()} {booking.currency}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {extendOptions.map(amount => {
                    let cost: number;
                    if (isVirtualSex) {
                      cost = (amount / 60) * booking.pricePerHour;
                    } else {
                      cost = amount * booking.pricePerHour;
                    }
                    const canAfford = userBalance && userBalance.amount >= cost;
                    return (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => handleExtend(amount)}
                        disabled={!canAfford}
                        className={`${
                          canAfford 
                            ? 'border-green-500 text-green-600 hover:bg-green-500/10' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold">+{amount} {extendUnit}</div>
                          <div className="text-xs">{cost.toFixed(2)} {booking.currency}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Детали */}
          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Услуга:</span>
              <span className="font-semibold">{booking.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Стоимость в час:</span>
              <span className="font-semibold">{booking.pricePerHour} {booking.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Оплачено:</span>
              <span className="font-semibold">{booking.totalPrice} {booking.currency}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};