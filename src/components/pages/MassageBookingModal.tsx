import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';
import { CatalogItem } from '@/types';

interface MassageBookingModalProps {
  service: CatalogItem;
  onClose: () => void;
  onConfirm: (booking: MassageBooking) => void;
}

export interface MassageBooking {
  date: string;
  time: string;
  program: string;
  price: number;
  duration: number;
}

const massagePrograms = [
  { id: 'classic', name: 'Классический массаж', duration: 60, price: 3000 },
  { id: 'relax', name: 'Расслабляющий массаж', duration: 90, price: 4500 },
  { id: 'sports', name: 'Спортивный массаж', duration: 60, price: 3500 },
  { id: 'thai', name: 'Тайский массаж', duration: 120, price: 6000 },
  { id: 'hot-stone', name: 'Массаж горячими камнями', duration: 90, price: 5000 },
  { id: 'aromatherapy', name: 'Ароматерапевтический массаж', duration: 75, price: 4000 },
];

export const MassageBookingModal = ({ service, onClose, onConfirm }: MassageBookingModalProps) => {
  const [step, setStep] = useState<'program' | 'datetime' | 'payment'>('program');
  const [selectedProgram, setSelectedProgram] = useState<typeof massagePrograms[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })
      });
    }
    return dates;
  };

  const generateAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 21; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 21) {
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return times;
  };

  const availableDates = generateAvailableDates();
  const availableTimes = generateAvailableTimes();

  const handleProgramSelect = (program: typeof massagePrograms[0]) => {
    setSelectedProgram(program);
    setStep('datetime');
  };

  const handleDateTimeConfirm = () => {
    if (selectedDate && selectedTime) {
      setStep('payment');
    }
  };

  const handlePaymentConfirm = () => {
    if (selectedProgram && selectedDate && selectedTime) {
      onConfirm({
        date: selectedDate,
        time: selectedTime,
        program: selectedProgram.name,
        price: selectedProgram.price,
        duration: selectedProgram.duration,
      });
    }
  };

  const prepaymentAmount = selectedProgram ? Math.round(selectedProgram.price * 0.3) : 0;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">
            {step === 'program' && 'Выберите программу массажа'}
            {step === 'datetime' && 'Выберите дату и время'}
            {step === 'payment' && 'Подтверждение и оплата'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={24} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Шаг 1: Выбор программы */}
          {step === 'program' && (
            <div className="space-y-4">
              {massagePrograms.map((program) => (
                <Card
                  key={program.id}
                  className="cursor-pointer hover:border-primary transition-all"
                  onClick={() => handleProgramSelect(program)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{program.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={16} />
                            {program.duration} мин
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Wallet" size={16} />
                            {program.price.toLocaleString()} ₽
                          </span>
                        </div>
                      </div>
                      <Icon name="ChevronRight" size={24} className="text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Шаг 2: Выбор даты и времени */}
          {step === 'datetime' && selectedProgram && (
            <div className="space-y-6">
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{selectedProgram.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProgram.duration} мин • {selectedProgram.price.toLocaleString()} ₽
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep('program')}>
                      Изменить
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label className="text-base mb-3 block">Выберите дату</Label>
                <div className="grid grid-cols-4 gap-2">
                  {availableDates.map((date) => (
                    <Button
                      key={date.value}
                      variant={selectedDate === date.value ? 'default' : 'outline'}
                      className="h-auto py-3 flex-col"
                      onClick={() => setSelectedDate(date.value)}
                    >
                      <span className="text-xs">{date.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base mb-3 block">Выберите время</Label>
                <div className="grid grid-cols-5 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                disabled={!selectedDate || !selectedTime}
                onClick={handleDateTimeConfirm}
              >
                Продолжить к оплате
              </Button>
            </div>
          )}

          {/* Шаг 3: Оплата */}
          {step === 'payment' && selectedProgram && (
            <div className="space-y-6">
              <Card className="bg-muted/30">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Программа:</span>
                    <span className="font-semibold">{selectedProgram.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Дата:</span>
                    <span className="font-semibold">
                      {new Date(selectedDate).toLocaleDateString('ru-RU', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Время:</span>
                    <span className="font-semibold">{selectedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Длительность:</span>
                    <span className="font-semibold">{selectedProgram.duration} минут</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Стоимость услуги:</span>
                      <span>{selectedProgram.price.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold text-lg">
                      <span>Предоплата (30%):</span>
                      <span className="text-primary">{prepaymentAmount.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Остаток после сеанса:</span>
                      <span>{(selectedProgram.price - prepaymentAmount).toLocaleString()} ₽</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <Icon name="Shield" size={18} className="text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Безопасная оплата</p>
                    <p className="text-muted-foreground">
                      Средства списываются только после подтверждения бронирования исполнителем
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="RefreshCw" size={18} className="text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Гибкая отмена</p>
                    <p className="text-muted-foreground">
                      Бесплатная отмена за 24 часа до начала сеанса
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full py-6 text-lg" onClick={handlePaymentConfirm}>
                  <Icon name="Wallet" className="mr-2" size={20} />
                  Оплатить {prepaymentAmount.toLocaleString()} ₽
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setStep('datetime')}>
                  Назад
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
