import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { StripteaseAd } from './stripteaseData';

interface StripteaseBookingModalProps {
  ad: StripteaseAd;
  open: boolean;
  onClose: () => void;
}

const weekDays = [
  { key: 'mon', label: 'Пн' },
  { key: 'tue', label: 'Вт' },
  { key: 'wed', label: 'Ср' },
  { key: 'thu', label: 'Чт' },
  { key: 'fri', label: 'Пт' },
  { key: 'sat', label: 'Сб' },
  { key: 'sun', label: 'Вс' },
];

export const StripteaseBookingModal = ({ ad, open, onClose }: StripteaseBookingModalProps) => {
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
    
    // Симуляция ожидания подтверждения от исполнителя (3 секунды)
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

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Icon name="FileText" size={20} />
                  О себе
                </h3>
                <p className="text-muted-foreground">{ad.about}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Icon name="Sparkles" size={20} />
                  Специализации
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ad.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Icon name="Briefcase" size={20} />
                  Опыт работы
                </h3>
                <p className="text-muted-foreground">{ad.experience} профессионального опыта</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Icon name="Calendar" size={20} />
                  Доступность по дням недели
                </h3>
                <div className="flex gap-2">
                  {weekDays.map(day => (
                    <div
                      key={day.key}
                      className={`flex-1 text-center py-2 rounded-lg ${
                        ad.availability[day.key]
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {day.label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {ad.portfolio.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Icon name="Images" size={20} />
                    Портфолио
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {ad.portfolio.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`Портфолио ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

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

            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Дата выступления *</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="time">Время начала *</Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="duration">Продолжительность (часов) *</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDuration(Math.max(1, duration - 1))}
                  >
                    <Icon name="Minus" size={18} />
                  </Button>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="8"
                    className="text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDuration(Math.min(8, duration + 1))}
                  >
                    <Icon name="Plus" size={18} />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Контактный телефон *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="comment">Комментарий к заказу</Label>
                <Textarea
                  id="comment"
                  placeholder="Укажите адрес, особые пожелания, формат мероприятия..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {bookingStatus === 'form' && (
              <>
                <Card className="bg-muted">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Цена за час:</span>
                      <span className="font-semibold">{ad.pricePerHour.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Количество часов:</span>
                      <span className="font-semibold">{duration}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold">Итого:</span>
                      <span className="text-2xl font-bold text-primary">
                        {getTotalPrice().toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Icon name="Info" size={18} className="text-amber-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
                        Ожидание подтверждения
                      </p>
                      <p className="text-muted-foreground">
                        После отправки запроса исполнитель должен подтвердить бронирование. 
                        После подтверждения станет доступна оплата.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {bookingStatus === 'waiting' && (
              <div className="space-y-4 py-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <Icon name="Clock" size={24} className="absolute inset-0 m-auto text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ожидаем подтверждения</h3>
                    <p className="text-muted-foreground text-sm">
                      {ad.name} получил(а) ваш запрос. 
                      <br />
                      Обычно ответ приходит в течение 5-10 минут.
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
                      <span className="text-muted-foreground">Дата и время:</span>
                      <span>{selectedDate} в {selectedTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Стоимость:</span>
                      <span className="font-semibold">{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleCancelBooking}
                  variant="outline"
                  className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Icon name="X" size={20} className="mr-2" />
                  Отменить бронирование
                </Button>
              </div>
            )}

            {bookingStatus === 'confirmed' && (
              <>
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={18} className="text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-700 dark:text-green-400 mb-1">
                        Бронирование подтверждено!
                      </p>
                      <p className="text-muted-foreground">
                        {ad.name} подтвердил(а) ваше бронирование. Теперь вы можете оплатить выступление.
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Исполнитель:</span>
                      <span className="font-semibold">{ad.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Дата:</span>
                      <span className="font-semibold">{selectedDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Время:</span>
                      <span className="font-semibold">{selectedTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Длительность:</span>
                      <span className="font-semibold">{duration} час(а)</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-lg font-semibold">К оплате:</span>
                      <span className="text-2xl font-bold text-primary">{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <Icon name="Shield" size={16} className="text-primary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Безопасная оплата</p>
                      <p className="text-muted-foreground text-xs">
                        Средства защищены до момента выполнения услуги
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="RefreshCw" size={16} className="text-primary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Возврат средств</p>
                      <p className="text-muted-foreground text-xs">
                        Бесплатная отмена за 24 часа до начала
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {bookingStatus === 'form' && (
              <Button
                onClick={handleBooking}
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Icon name="Send" size={20} className="mr-2" />
                Забронировать
              </Button>
            )}

            {bookingStatus === 'confirmed' && (
              <Button
                onClick={handlePayment}
                className="w-full h-12 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Icon name="Wallet" size={20} className="mr-2" />
                Оплатить {getTotalPrice().toLocaleString('ru-RU')} ₽
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};