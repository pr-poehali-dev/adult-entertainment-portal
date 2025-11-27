import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface BookingModalProps {
  showBookingModal: boolean;
  setShowBookingModal: (show: boolean) => void;
  bookingDate: string;
  setBookingDate: (date: string) => void;
  bookingTime: string;
  setBookingTime: (time: string) => void;
  bookingDuration: string;
  setBookingDuration: (duration: string) => void;
  bookingNote: string;
  setBookingNote: (note: string) => void;
  handleBookingSubmit: () => void;
  servicePrice?: number;
  serviceName?: string;
}

const BookingModal = ({
  showBookingModal,
  setShowBookingModal,
  bookingDate,
  setBookingDate,
  bookingTime,
  setBookingTime,
  bookingDuration,
  setBookingDuration,
  bookingNote,
  setBookingNote,
  handleBookingSubmit,
  servicePrice = 25000,
  serviceName = 'Услуга',
}: BookingModalProps) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [guests, setGuests] = useState<string>('1');
  
  if (!showBookingModal) return null;

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 23; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const duration = parseInt(bookingDuration) || 1;
  const totalPrice = servicePrice * duration;
  const prepayment = totalPrice * 0.3;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">Бронирование встречи</CardTitle>
              <CardDescription className="mt-2">{serviceName}</CardDescription>
            </div>
            <button 
              onClick={() => setShowBookingModal(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Icon name="Calendar" size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Выберите дату и время</h3>
                  <p className="text-sm text-muted-foreground">Минимальное бронирование: 1 час</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="booking-date" className="flex items-center gap-2">
                    <Icon name="CalendarDays" size={16} />
                    Дата встречи
                  </Label>
                  <Input 
                    id="booking-date"
                    type="date" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={(() => {
                      const today = new Date();
                      const year = today.getFullYear();
                      const month = String(today.getMonth() + 1).padStart(2, '0');
                      const day = String(today.getDate()).padStart(2, '0');
                      return `${year}-${month}-${day}`;
                    })()}
                    className="bg-background border-border text-lg py-6"
                  />
                </div>

                {bookingDate && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Icon name="Clock" size={16} />
                      Время начала
                    </Label>
                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-background rounded-lg border border-border">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedTimeSlot(slot);
                            setBookingTime(slot);
                          }}
                          className={`py-2 px-3 rounded-md text-sm transition-all ${
                            selectedTimeSlot === slot
                              ? 'bg-primary text-primary-foreground shadow-md scale-105'
                              : 'bg-muted hover:bg-muted/80 text-foreground'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-border">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="booking-duration" className="flex items-center gap-2 text-base">
                  <Icon name="Timer" size={16} />
                  Продолжительность встречи
                </Label>
                <Select value={bookingDuration} onValueChange={setBookingDuration}>
                  <SelectTrigger id="booking-duration" className="bg-background border-border text-lg py-6">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 час - {servicePrice.toLocaleString('ru-RU')} ₽</SelectItem>
                    <SelectItem value="2">2 часа - {(servicePrice * 2).toLocaleString('ru-RU')} ₽</SelectItem>
                    <SelectItem value="3">3 часа - {(servicePrice * 3).toLocaleString('ru-RU')} ₽</SelectItem>
                    <SelectItem value="4">4 часа - {(servicePrice * 4).toLocaleString('ru-RU')} ₽</SelectItem>
                    <SelectItem value="6">6 часов - {(servicePrice * 6).toLocaleString('ru-RU')} ₽</SelectItem>
                    <SelectItem value="8">Весь день (8 часов) - {(servicePrice * 8).toLocaleString('ru-RU')} ₽</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <Icon name="MapPin" size={16} />
                    Место встречи
                  </Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location" className="bg-background border-border">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Отель</SelectItem>
                      <SelectItem value="restaurant">Ресторан</SelectItem>
                      <SelectItem value="my-place">У меня</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests" className="flex items-center gap-2">
                    <Icon name="Users" size={16} />
                    Количество гостей
                  </Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger id="guests" className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 человек</SelectItem>
                      <SelectItem value="2">2 человека</SelectItem>
                      <SelectItem value="3">3 человека</SelectItem>
                      <SelectItem value="4">4+ человека</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="booking-note" className="flex items-center gap-2 text-base">
              <Icon name="MessageSquare" size={16} />
              Дополнительные пожелания
            </Label>
            <Textarea 
              id="booking-note"
              placeholder="Опишите ваши предпочтения, дресс-код, особые запросы..."
              value={bookingNote}
              onChange={(e) => setBookingNote(e.target.value)}
              className="bg-background border-border min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Icon name="Lock" size={12} />
              Вся информация конфиденциальна
            </p>
          </div>

          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Receipt" size={20} className="text-primary" />
                <h4 className="font-semibold text-lg">Детали оплаты</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Стоимость за час:</span>
                  <span className="font-semibold">{servicePrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Продолжительность:</span>
                  <Badge variant="outline" className="font-semibold">{duration} {duration === 1 ? 'час' : 'часа'}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg">
                  <span className="text-foreground/70">Сумма:</span>
                  <span className="font-bold">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70 flex items-center gap-1">
                    <Icon name="CreditCard" size={16} />
                    Предоплата (30%):
                  </span>
                  <span className="font-semibold text-primary">{prepayment.toLocaleString('ru-RU')} ₽</span>
                </div>
                <Separator className="bg-primary/20" />
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Итого к оплате:</span>
                  <span className="text-2xl font-bold text-primary">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              {bookingDate && bookingTime && (
                <div className="mt-4 p-3 bg-background/50 rounded-lg">
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Icon name="CalendarCheck" size={16} className="text-primary" />
                    Детали встречи:
                  </p>
                  <div className="text-sm space-y-1 text-foreground/80">
                    <p>📅 {new Date(bookingDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p>🕐 {bookingTime} - {(() => {
                      const [h, m] = bookingTime.split(':').map(Number);
                      const endHour = h + duration;
                      return `${endHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                    })()}</p>
                    <p>📍 {location === 'hotel' ? 'Отель' : location === 'restaurant' ? 'Ресторан' : location === 'my-place' ? 'У клиента' : location === 'other' ? 'Другое место' : 'Не указано'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <Icon name="Info" size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-blue-500">Важная информация:</p>
                  <ul className="space-y-1 text-foreground/70">
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle" size={14} className="text-blue-500 mt-0.5" />
                      Требуется предоплата 30% для подтверждения бронирования
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle" size={14} className="text-blue-500 mt-0.5" />
                      Бесплатная отмена за 24 часа до встречи с возвратом 100%
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle" size={14} className="text-blue-500 mt-0.5" />
                      Все данные защищены и конфиденциальны
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle" size={14} className="text-blue-500 mt-0.5" />
                      Подтверждение от исполнителя в течение 1-2 часов
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 border-border text-lg py-6"
              onClick={() => setShowBookingModal(false)}
            >
              Отменить
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 text-lg py-6 shadow-lg"
              onClick={handleBookingSubmit}
              disabled={!bookingDate || !bookingTime || !location}
            >
              <Icon name="CreditCard" className="mr-2" size={20} />
              Оплатить {prepayment.toLocaleString('ru-RU')} ₽
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingModal;