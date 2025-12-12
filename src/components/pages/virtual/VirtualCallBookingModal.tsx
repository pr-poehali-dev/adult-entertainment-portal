import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Page } from '@/types';
import { VirtualPerformer } from './virtualData';

interface VirtualCallBookingModalProps {
  performer: VirtualPerformer;
  callType: 'audio' | 'video' | 'chat';
  open: boolean;
  onClose: () => void;
  bookings?: any[];
  setBookings?: (bookings: any[]) => void;
  setCurrentPage?: (page: Page) => void;
}

const callTypeNames = {
  audio: 'Аудиозвонок',
  video: 'Видеозвонок',
  chat: 'Онлайн переписка',
};

const callTypeIcons = {
  audio: 'Phone' as const,
  video: 'Video' as const,
  chat: 'MessageCircle' as const,
};

export const VirtualCallBookingModal = ({
  performer,
  callType,
  open,
  onClose,
  bookings,
  setBookings,
  setCurrentPage,
}: VirtualCallBookingModalProps) => {
  const { toast } = useToast();
  const [duration, setDuration] = useState(10);
  const [bookingStatus, setBookingStatus] = useState<'form' | 'waiting' | 'confirmed'>('form');
  const [waitingTimeoutId, setWaitingTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleRequestCall = () => {
    setBookingStatus('waiting');

    const timeoutId = setTimeout(() => {
      setBookingStatus('confirmed');
      toast({
        title: 'Исполнитель готов! ✓',
        description: `${performer.name} подтвердил(а) готовность. Теперь вы можете оплатить.`,
        duration: 5000,
      });
      setWaitingTimeoutId(null);
    }, 3000);

    setWaitingTimeoutId(timeoutId);
  };

  const handleCancelRequest = () => {
    if (waitingTimeoutId) {
      clearTimeout(waitingTimeoutId);
      setWaitingTimeoutId(null);
    }

    setBookingStatus('form');

    toast({
      title: 'Запрос отменён',
      description: 'Вы отменили запрос на звонок.',
      duration: 3000,
    });
  };

  const handlePayment = () => {
    const totalPrice = performer.pricePerMinute * duration;

    if (setBookings && bookings) {
      const newBooking = {
        id: Date.now(),
        serviceType: 'virtual' as const,
        performerName: performer.name,
        performerAvatar: performer.avatar,
        category: `Виртуальный секс: ${callTypeNames[callType]}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        duration: duration,
        price: totalPrice,
        currency: 'RUB' as const,
        status: 'paid' as const,
        createdAt: new Date().toISOString(),
        chatId: Date.now() + 1000,
        callType: callType,
      };

      setBookings([newBooking, ...bookings]);
    }

    toast({
      title: 'Оплата прошла успешно! 🎉',
      description: `Вы оплатили ${totalPrice.toLocaleString('ru-RU')} ₽. Ожидайте звонка.`,
      duration: 5000,
    });

    onClose();
  };

  const handleOpenChat = () => {
    if (setCurrentPage) {
      onClose();
      setCurrentPage('my-orders');
    }
  };

  const getTotalPrice = () => performer.pricePerMinute * duration;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <img
              src={performer.avatar}
              alt={performer.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                {performer.name}, {performer.age}
                {performer.online && (
                  <Badge className="bg-green-500">
                    <span className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
                    Онлайн
                  </Badge>
                )}
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="MapPin" size={14} />
                {performer.location}
                <span className="mx-1">•</span>
                <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                {performer.rating} ({performer.reviewsCount})
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name={callTypeIcons[callType]} size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Тип услуги</p>
                    <p className="text-xl font-bold">{callTypeNames[callType]}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Цена за минуту</p>
                  <p className="text-2xl font-bold text-primary">
                    {performer.pricePerMinute} ₽
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {bookingStatus === 'form' && (
            <>
              <div>
                <Label htmlFor="duration" className="text-base font-semibold mb-3 block">
                  Длительность звонка
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDuration(Math.max(performer.minDuration, duration - 5))}
                    className="h-12 w-12"
                  >
                    <Icon name="Minus" size={20} />
                  </Button>
                  <div className="flex-1 text-center">
                    <p className="text-4xl font-bold">{duration}</p>
                    <p className="text-sm text-muted-foreground">минут</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDuration(Math.min(performer.maxDuration, duration + 5))}
                    className="h-12 w-12"
                  >
                    <Icon name="Plus" size={20} />
                  </Button>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap justify-center">
                  {[10, 15, 20, 30, 45, 60].map((min) => (
                    <Button
                      key={min}
                      variant={duration === min ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDuration(min)}
                    >
                      {min} мин
                    </Button>
                  ))}
                </div>
              </div>

              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Цена за минуту:</span>
                    <span className="font-semibold">{performer.pricePerMinute} ₽</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Длительность:</span>
                    <span className="font-semibold">{duration} мин</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold">Итого:</span>
                    <span className="text-3xl font-bold text-primary">
                      {getTotalPrice().toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Icon name="Info" size={18} className="text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                      Как это работает?
                    </p>
                    <p className="text-muted-foreground">
                      1. Запросите звонок<br />
                      2. Исполнитель подтвердит готовность<br />
                      3. Оплатите услугу<br />
                      4. Получите звонок в течение 2-3 минут
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleRequestCall}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Icon name={callTypeIcons[callType]} size={22} className="mr-2" />
                Запросить звонок
              </Button>
            </>
          )}

          {bookingStatus === 'waiting' && (
            <div className="space-y-6 py-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <Icon name="Phone" size={32} className="absolute inset-0 m-auto text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ожидаем ответа исполнителя</h3>
                  <p className="text-muted-foreground">
                    {performer.name} получил(а) ваш запрос.
                    <br />
                    Обычно ответ приходит в течение 10-20 секунд.
                  </p>
                </div>
              </div>

              <Card className="bg-muted/30">
                <CardContent className="pt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Статус:</span>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                      <Icon name="Clock" size={12} className="mr-1" />
                      Ожидание
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Тип звонка:</span>
                    <span>{callTypeNames[callType]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Длительность:</span>
                    <span>{duration} минут</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Стоимость:</span>
                    <span className="font-semibold">{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleCancelRequest}
                variant="outline"
                className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Icon name="X" size={20} className="mr-2" />
                Отменить запрос
              </Button>
            </div>
          )}

          {bookingStatus === 'confirmed' && (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Icon name="CheckCircle" size={20} className="text-green-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-green-700 dark:text-green-400 mb-1">
                      Исполнитель готов!
                    </p>
                    <p className="text-muted-foreground">
                      {performer.name} подтвердил(а) готовность к звонку. Оплатите услугу, и мы соединим вас в течение 2-3 минут.
                    </p>
                  </div>
                </div>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Исполнитель:</span>
                    <span className="font-semibold">{performer.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Тип звонка:</span>
                    <span className="font-semibold">{callTypeNames[callType]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Длительность:</span>
                    <span className="font-semibold">{duration} минут</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-lg font-semibold">К оплате:</span>
                    <span className="text-2xl font-bold text-primary">
                      {getTotalPrice().toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <Icon name="Shield" size={16} className="text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Безопасная оплата</p>
                    <p className="text-muted-foreground text-xs">
                      Средства защищены до момента начала звонка
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Clock" size={16} className="text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Гарантия времени</p>
                    <p className="text-muted-foreground text-xs">
                      Вы получите полную длительность оплаченного звонка
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {handleOpenChat && (
                  <Button
                    onClick={handleOpenChat}
                    variant="outline"
                    className="w-full h-12 text-lg border-primary/30 hover:bg-primary/5"
                  >
                    <Icon name="MessageCircle" size={20} className="mr-2" />
                    Обсудить детали
                  </Button>
                )}
                <Button
                  onClick={handlePayment}
                  className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Icon name="Wallet" size={22} className="mr-2" />
                  Оплатить {getTotalPrice().toLocaleString('ru-RU')} ₽
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
