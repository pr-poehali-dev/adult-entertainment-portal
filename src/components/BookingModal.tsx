import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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
}: BookingModalProps) => {
  if (!showBookingModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl">Бронирование услуги</CardTitle>
            <button 
              onClick={() => setShowBookingModal(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
          <CardDescription>Заполните данные для подтверждения встречи</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-date">Дата встречи</Label>
              <Input 
                id="booking-date"
                type="date" 
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-time">Время встречи</Label>
              <Input 
                id="booking-time"
                type="time" 
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking-duration">Продолжительность</Label>
            <Select value={bookingDuration} onValueChange={setBookingDuration}>
              <SelectTrigger id="booking-duration" className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 час</SelectItem>
                <SelectItem value="2">2 часа</SelectItem>
                <SelectItem value="3">3 часа</SelectItem>
                <SelectItem value="4">4 часа</SelectItem>
                <SelectItem value="6">6 часов</SelectItem>
                <SelectItem value="8">Весь день (8 часов)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking-note">Дополнительные пожелания</Label>
            <Textarea 
              id="booking-note"
              placeholder="Опишите ваши пожелания и особые запросы..."
              value={bookingNote}
              onChange={(e) => setBookingNote(e.target.value)}
              className="bg-background border-border min-h-[100px]"
            />
          </div>

          <Separator />

          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold text-lg">Детали оплаты</h4>
            <div className="flex justify-between text-foreground/80">
              <span>Стоимость за час:</span>
              <span className="font-semibold">25 000 ₽</span>
            </div>
            <div className="flex justify-between text-foreground/80">
              <span>Продолжительность:</span>
              <span className="font-semibold">{bookingDuration} ч</span>
            </div>
            <div className="flex justify-between text-foreground/80">
              <span>Предоплата (30%):</span>
              <span className="font-semibold">{(25000 * parseInt(bookingDuration) * 0.3).toLocaleString('ru-RU')} ₽</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold text-primary">
              <span>Итого к оплате:</span>
              <span>{(25000 * parseInt(bookingDuration)).toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
            <div className="flex gap-3">
              <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm text-foreground/80">
                <p>• Для подтверждения требуется предоплата 30%</p>
                <p>• Бесплатная отмена за 24 часа до встречи</p>
                <p>• Все данные защищены и конфиденциальны</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1 border-border"
              onClick={() => setShowBookingModal(false)}
            >
              Отменить
            </Button>
            <Button 
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleBookingSubmit}
            >
              <Icon name="CreditCard" className="mr-2" size={20} />
              Перейти к оплате
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingModal;
