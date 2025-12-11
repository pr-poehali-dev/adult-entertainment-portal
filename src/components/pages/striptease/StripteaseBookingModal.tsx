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

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !phone) {
      toast({
        title: 'Заполните все поля',
        description: 'Укажите дату, время и контактный телефон',
        variant: 'destructive',
      });
      return;
    }

    const totalPrice = ad.pricePerHour * duration;
    
    toast({
      title: 'Заявка отправлена! 🎉',
      description: `Исполнитель свяжется с вами по телефону ${phone}. Сумма: ${totalPrice.toLocaleString('ru-RU')} ₽`,
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

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex gap-3">
                <Icon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Условия бронирования
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    После отправки заявки исполнитель свяжется с вами для подтверждения деталей. 
                    Оплата производится исполнителю после завершения выступления.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleBooking}
              className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Icon name="Send" size={20} className="mr-2" />
              Отправить заявку
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
