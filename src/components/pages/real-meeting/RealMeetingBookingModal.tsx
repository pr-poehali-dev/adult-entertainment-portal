import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Page, MeetingType, ProgramType } from '@/types';

interface Provider {
  id: number;
  name: string;
  avatar: string;
  pricePerHour: number;
}

interface RealMeetingBookingModalProps {
  provider: Provider;
  meetingType: MeetingType;
  open: boolean;
  onClose: () => void;
  bookings?: any[];
  setBookings?: (bookings: any[]) => void;
  setCurrentPage: (page: Page) => void;
}

const programPrices: Record<ProgramType, number> = {
  classic: 1,
  standard: 1.5,
  exclusive: 2,
};

const programNames: Record<ProgramType, string> = {
  classic: 'Классика',
  standard: 'Стандарт',
  exclusive: 'Эксклюзив',
};

export const RealMeetingBookingModal = ({
  provider,
  meetingType,
  open,
  onClose,
  bookings,
  setBookings,
  setCurrentPage,
}: RealMeetingBookingModalProps) => {
  const { toast } = useToast();
  const [bookingStatus, setBookingStatus] = useState<'form' | 'waiting' | 'confirmed'>('form');
  const [waitingTimeoutId, setWaitingTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [hours, setHours] = useState(1);
  const [program, setProgram] = useState<ProgramType>('classic');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (open) {
      setBookingStatus('form');
      setSelectedDate('');
      setSelectedTime('');
      setHours(1);
      setProgram('classic');
      setAddress('');
      setPhone('');
      if (waitingTimeoutId) {
        clearTimeout(waitingTimeoutId);
        setWaitingTimeoutId(null);
      }
    }
  }, [open]);

  const getTotalPrice = () => {
    return Math.round(provider.pricePerHour * hours * programPrices[program]);
  };

  const handleBooking = () => {
    if (meetingType === 'outcall') {
      if (!selectedDate || !selectedTime || !address || !phone) {
        toast({
          title: 'Заполните все поля',
          description: 'Для выезда требуется указать дату, время, адрес и телефон',
          variant: 'destructive',
        });
        return;
      }
    } else {
      if (!selectedDate || !selectedTime) {
        toast({
          title: 'Заполните все поля',
          description: 'Укажите дату и время встречи',
          variant: 'destructive',
        });
        return;
      }
    }

    setBookingStatus('waiting');
    toast({
      title: meetingType === 'outcall' ? 'Приглашение отправлено' : 'Запрос отправлен',
      description: `${provider.name} получит ваше ${meetingType === 'outcall' ? 'приглашение' : 'запрос'}`,
    });

    const timeoutId = setTimeout(() => {
      setBookingStatus('confirmed');
      toast({
        title: meetingType === 'outcall' ? 'Приглашение подтверждено! ✓' : 'Девушка готова вас принять! ✓',
        description: 'Теперь вы можете оплатить встречу',
      });
      setWaitingTimeoutId(null);
    }, 3000);
    setWaitingTimeoutId(timeoutId);
  };

  const handleCancelBooking = () => {
    if (waitingTimeoutId) {
      clearTimeout(waitingTimeoutId);
      setWaitingTimeoutId(null);
    }
    setBookingStatus('form');
    toast({
      title: 'Бронирование отменено',
    });
  };

  const handlePayment = () => {
    const totalPrice = getTotalPrice();

    if (setBookings && bookings) {
      const newOrder = {
        id: Date.now(),
        providerId: provider.id,
        providerName: provider.name,
        providerAvatar: provider.avatar,
        buyerId: 1,
        buyerName: 'Вы',
        meetingType: meetingType,
        program: program,
        date: selectedDate,
        time: selectedTime,
        hours: hours,
        address: meetingType === 'outcall' ? address : undefined,
        phone: meetingType === 'outcall' ? phone : undefined,
        price: totalPrice,
        currency: 'RUB' as const,
        status: 'paid' as const,
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        chatId: Date.now() + 1000,
      };
      setBookings([newOrder, ...bookings]);
    }

    toast({
      title: 'Оплата прошла успешно! 🎉',
      description: 'Встреча оплачена. Перейдите в "Мои заказы" чтобы обсудить детали',
    });
    onClose();
  };

  const handleOpenChat = () => {
    toast({
      title: 'Чат создан',
      description: 'Обсудите детали встречи с исполнителем',
    });
    setCurrentPage('my-orders');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="text-xl">{provider.name}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon name={meetingType === 'outcall' ? 'Car' : 'Home'} size={14} />
                {meetingType === 'outcall' ? 'Выезд к вам' : 'Встреча в апартаментах'}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {bookingStatus === 'form' && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Дата встречи</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label>Время</Label>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Количество часов</Label>
              <Select value={hours.toString()} onValueChange={(v) => setHours(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((h) => (
                    <SelectItem key={h} value={h.toString()}>
                      {h} {h === 1 ? 'час' : h < 5 ? 'часа' : 'часов'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Вид программы</Label>
              <Select value={program} onValueChange={(v) => setProgram(v as ProgramType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">
                    <div className="flex items-center justify-between w-full">
                      <span>Классика</span>
                      <span className="text-muted-foreground ml-4">×{programPrices.classic}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="standard">
                    <div className="flex items-center justify-between w-full">
                      <span>Стандарт</span>
                      <span className="text-muted-foreground ml-4">×{programPrices.standard}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="exclusive">
                    <div className="flex items-center justify-between w-full">
                      <span>Эксклюзив</span>
                      <span className="text-muted-foreground ml-4">×{programPrices.exclusive}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {meetingType === 'outcall' && (
              <>
                <div>
                  <Label>Адрес выезда</Label>
                  <Input
                    placeholder="Улица, дом, квартира"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Контактный телефон</Label>
                  <Input
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Стоимость:</span>
                <span>{provider.pricePerHour.toLocaleString('ru-RU')} ₽/час</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Программа:</span>
                <span>{programNames[program]} (×{programPrices[program]})</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Часы:</span>
                <span>×{hours}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Итого:</span>
                <span className="text-primary">{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <Button onClick={handleBooking} className="w-full" size="lg">
              {meetingType === 'outcall' ? 'Пригласить' : 'Хочу в гости'}
            </Button>
          </div>
        )}

        {bookingStatus === 'waiting' && (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <Icon
                  name="Clock"
                  size={32}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary"
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">
                  Ожидание подтверждения
                </h3>
                <p className="text-muted-foreground text-sm">
                  {provider.name} рассматривает ваш{' '}
                  {meetingType === 'outcall' ? 'запрос на выезд' : 'запрос на встречу'}
                </p>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата:</span>
                <span>{new Date(selectedDate).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Время:</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Длительность:</span>
                <span>{hours} {hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Программа:</span>
                <span>{programNames[program]}</span>
              </div>
            </div>

            <Button onClick={handleCancelBooking} variant="outline" className="w-full">
              <Icon name="X" size={18} className="mr-2" />
              Отменить бронирование
            </Button>
          </div>
        )}

        {bookingStatus === 'confirmed' && (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <Icon name="CheckCircle" size={40} className="text-green-500" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1 text-green-600">
                  {meetingType === 'outcall' ? 'Приглашение подтверждено!' : 'Девушка готова вас принять!'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  Оплатите встречу, чтобы завершить бронирование
                </p>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата:</span>
                <span>{new Date(selectedDate).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Время:</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Длительность:</span>
                <span>{hours} {hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Программа:</span>
                <span>{programNames[program]}</span>
              </div>
              {meetingType === 'outcall' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Адрес:</span>
                    <span className="text-right">{address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Телефон:</span>
                    <span>{phone}</span>
                  </div>
                </>
              )}
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>К оплате:</span>
                <span className="text-primary">{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={handlePayment} className="w-full" size="lg">
                <Icon name="CreditCard" size={18} className="mr-2" />
                Оплатить {getTotalPrice().toLocaleString('ru-RU')} ₽
              </Button>
              <Button onClick={handleOpenChat} variant="outline" className="w-full">
                <Icon name="MessageCircle" size={18} className="mr-2" />
                Обсудить встречу
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
