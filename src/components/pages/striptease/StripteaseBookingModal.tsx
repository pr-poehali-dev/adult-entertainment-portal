import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { StripteaseAd } from './stripteaseData';
import { StripteaseProfileTab } from './StripteaseProfileTab';
import { StripteaseBookingForm } from './StripteaseBookingForm';
import { StripteaseBookingStatus } from './StripteaseBookingStatus';

interface StripteaseBookingModalProps {
  ad: StripteaseAd;
  open: boolean;
  onClose: () => void;
  bookings?: any[];
  setBookings?: (bookings: any[]) => void;
}

export const StripteaseBookingModal = ({ ad, open, onClose, bookings, setBookings }: StripteaseBookingModalProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState<'booking' | 'profile'>('profile');
  const [bookingStatus, setBookingStatus] = useState<'form' | 'waiting' | 'confirmed'>('form');
  const [waitingTimeoutId, setWaitingTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !phone) {
      toast({
        title: 'Заполните все поля',
        description: 'Укажите дату, время и контактный телефон',
        variant: 'destructive',
      });
      return;
    }

    setBookingStatus('waiting');
    
    const timeoutId = setTimeout(() => {
      setBookingStatus('confirmed');
      toast({
        title: 'Бронирование подтверждено! ✓',
        description: 'Исполнитель подтвердил бронь. Теперь вы можете оплатить.',
        duration: 5000,
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
      description: 'Вы успешно отменили запрос на бронирование.',
      duration: 3000,
    });
  };

  const handlePayment = () => {
    const totalPrice = ad.pricePerHour * duration;
    
    if (setBookings && bookings) {
      const newBooking = {
        id: Date.now(),
        performerName: ad.name,
        performerAvatar: ad.avatar,
        category: 'Стриптиз',
        date: selectedDate,
        time: selectedTime,
        duration: duration,
        price: totalPrice,
        status: 'confirmed' as const,
        createdAt: new Date().toISOString(),
      };
      
      setBookings([newBooking, ...bookings]);
    }
    
    toast({
      title: 'Оплата прошла успешно! 🎉',
      description: `Вы оплатили ${totalPrice.toLocaleString('ru-RU')} ₽. Данные отправлены исполнителю.`,
      duration: 5000,
    });

    onClose();
  };

  const getTotalPrice = () => ad.pricePerHour * duration;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <img
              src={ad.avatar}
              alt={ad.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <DialogTitle className="text-2xl">{ad.name}, {ad.age}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Icon name="MapPin" size={14} />
                {ad.location}
                <span className="mx-2">•</span>
                <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                {ad.rating} ({ad.reviewsCount})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'profile' ? 'default' : 'outline'}
            onClick={() => setActiveTab('profile')}
            className="flex-1"
          >
            <Icon name="User" size={18} className="mr-2" />
            Профиль
          </Button>
          <Button
            variant={activeTab === 'booking' ? 'default' : 'outline'}
            onClick={() => setActiveTab('booking')}
            className="flex-1"
          >
            <Icon name="Calendar" size={18} className="mr-2" />
            Бронирование
          </Button>
        </div>

        {activeTab === 'profile' && <StripteaseProfileTab ad={ad} />}

        {activeTab === 'booking' && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Цена за час</p>
                    <p className="text-3xl font-bold text-primary">
                      {ad.pricePerHour.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <Icon name="Clock" size={48} className="text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <StripteaseBookingForm
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              duration={duration}
              setDuration={setDuration}
              phone={phone}
              setPhone={setPhone}
              comment={comment}
              setComment={setComment}
            />

            <StripteaseBookingStatus
              bookingStatus={bookingStatus}
              ad={ad}
              duration={duration}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              getTotalPrice={getTotalPrice}
              handleCancelBooking={handleCancelBooking}
              handleBooking={handleBooking}
              handlePayment={handlePayment}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
