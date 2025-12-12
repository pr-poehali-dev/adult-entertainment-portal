import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { StripteaseAd } from './stripteaseData';

interface StripteaseBookingStatusProps {
  bookingStatus: 'form' | 'waiting' | 'confirmed';
  ad: StripteaseAd;
  duration: number;
  selectedDate: string;
  selectedTime: string;
  getTotalPrice: () => number;
  handleCancelBooking: () => void;
  handleBooking: () => void;
  handlePayment: () => void;
}

export const StripteaseBookingStatus = ({
  bookingStatus,
  ad,
  duration,
  selectedDate,
  selectedTime,
  getTotalPrice,
  handleCancelBooking,
  handleBooking,
  handlePayment,
}: StripteaseBookingStatusProps) => {
  return (
    <>
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
    </>
  );
};
