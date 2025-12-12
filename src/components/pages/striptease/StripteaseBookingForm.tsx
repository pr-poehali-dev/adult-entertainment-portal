import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface StripteaseBookingFormProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  duration: number;
  setDuration: (duration: number) => void;
  phone: string;
  setPhone: (phone: string) => void;
  comment: string;
  setComment: (comment: string) => void;
}

export const StripteaseBookingForm = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  duration,
  setDuration,
  phone,
  setPhone,
  comment,
  setComment,
}: StripteaseBookingFormProps) => {
  return (
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
  );
};
