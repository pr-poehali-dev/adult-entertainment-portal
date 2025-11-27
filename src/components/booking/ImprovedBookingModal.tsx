import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Currency, WalletBalance } from '@/types';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ImprovedBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: number;
  serviceName: string;
  serviceCategory: string;
  sellerId: number;
  sellerName: string;
  pricePerHour: number;
  userBalances: WalletBalance[];
  onCreateBooking: (data: {
    serviceId: number;
    serviceCategory: string;
    sellerId: number;
    date: string;
    time: string;
    duration: number;
    currency: Currency;
    note: string;
  }) => void;
}

export const ImprovedBookingModal = ({
  isOpen,
  onClose,
  serviceId,
  serviceName,
  serviceCategory,
  sellerId,
  sellerName,
  pricePerHour,
  userBalances,
  onCreateBooking,
}: ImprovedBookingModalProps) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('RUB');
  const [note, setNote] = useState('');
  const { toast } = useToast();

  const totalPrice = pricePerHour * duration;
  const selectedBalance = userBalances.find(b => b.currency === selectedCurrency);
  const hasEnoughBalance = selectedBalance && selectedBalance.amount >= totalPrice;

  const handleSubmit = () => {
    if (!date || !time) {
      toast({
        title: "Ошибка",
        description: "Заполните дату и время встречи",
        variant: "destructive",
      });
      return;
    }

    if (!hasEnoughBalance) {
      toast({
        title: "Недостаточно средств",
        description: `Пополните баланс ${selectedCurrency}`,
        variant: "destructive",
      });
      return;
    }

    onCreateBooking({
      serviceId,
      serviceCategory,
      sellerId,
      date,
      time,
      duration,
      currency: selectedCurrency,
      note,
    });

    onClose();
    toast({
      title: "Запрос отправлен",
      description: "Продавец должен ответить в течение 15 минут",
    });
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Calendar" size={24} className="text-primary" />
            Бронирование встречи
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Информация */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Услуга:</span>
              <span className="font-semibold">{serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Продавец:</span>
              <span className="font-semibold">{sellerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Цена в час:</span>
              <span className="font-semibold">{pricePerHour} {selectedCurrency}</span>
            </div>
          </div>

          {/* Дата и время */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Дата встречи</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="time">Время</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          {/* Длительность */}
          <div>
            <Label htmlFor="duration">Длительность (часов)</Label>
            <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(h => (
                  <SelectItem key={h} value={h.toString()}>{h} ч</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Валюта */}
          <div>
            <Label>Валюта оплаты</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {userBalances.map(balance => {
                const isSelected = selectedCurrency === balance.currency;
                const canAfford = balance.amount >= totalPrice;
                return (
                  <Button
                    key={balance.currency}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setSelectedCurrency(balance.currency)}
                    className={`flex flex-col h-auto py-3 ${!canAfford && 'opacity-50'}`}
                  >
                    <span className="font-bold">{balance.currency}</span>
                    <span className="text-xs">{balance.amount.toLocaleString()} {balance.symbol}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Комментарий */}
          <div>
            <Label htmlFor="note">Комментарий (необязательно)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Пожелания или особые требования..."
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Итого */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Итого к оплате:</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {totalPrice.toLocaleString()} {selectedCurrency}
                </div>
                {selectedBalance && (
                  <div className="text-sm text-muted-foreground">
                    Доступно: {selectedBalance.amount.toLocaleString()} {selectedBalance.symbol}
                  </div>
                )}
              </div>
            </div>

            {!hasEnoughBalance && (
              <Alert className="border-red-500 bg-red-500/10 mb-4">
                <AlertDescription className="text-red-600 text-sm">
                  <Icon name="AlertTriangle" size={16} className="inline mr-2" />
                  Недостаточно средств. Пополните баланс {selectedCurrency}.
                </AlertDescription>
              </Alert>
            )}

            <Alert className="border-blue-500 bg-blue-500/10">
              <AlertDescription className="text-sm text-blue-600">
                <Icon name="Info" size={16} className="inline mr-2" />
                <div className="inline-block">
                  <p className="font-semibold mb-1">Как работает бронирование:</p>
                  <ol className="text-xs space-y-1 ml-5 list-decimal">
                    <li>Продавец имеет 15 минут на подтверждение</li>
                    <li>После подтверждения средства замораживаются на эскроу</li>
                    <li>В назначенное время обе стороны нажимают "Готов(а)"</li>
                    <li>Начинается таймер встречи на оплаченное время</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!hasEnoughBalance}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Icon name="Check" size={18} />
              Отправить запрос
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};