import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Currency } from '@/types';

interface CreatePartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (party: PartyFormData) => void;
}

export interface PartyFormData {
  title: string;
  description: string;
  city: string;
  date: string;
  time: string;
  theme: string;
  maxTickets: number;
  ticketPrices: {
    female: number;
    couple: number;
    male: number;
  };
  currency: Currency;
  coverImage: string;
  rules: string[];
  dresscode: string;
  ageRestriction: string;
}

const CreatePartyModal = ({ isOpen, onClose, onSubmit }: CreatePartyModalProps) => {
  const [formData, setFormData] = useState<PartyFormData>({
    title: '',
    description: '',
    city: '',
    date: '',
    time: '',
    theme: '',
    maxTickets: 20,
    ticketPrices: {
      female: 0,
      couple: 0,
      male: 0,
    },
    currency: 'RUB',
    coverImage: '',
    rules: [''],
    dresscode: '',
    ageRestriction: '18+',
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.city || !formData.date || !formData.time) {
      return;
    }
    onSubmit(formData);
  };

  const addRule = () => {
    setFormData({ ...formData, rules: [...formData.rules, ''] });
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({ ...formData, rules: newRules });
  };

  const removeRule = (index: number) => {
    setFormData({ ...formData, rules: formData.rules.filter((_, i) => i !== index) });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="PartyPopper" size={24} />
            Создать приватную вечеринку
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Название вечеринки *</Label>
            <Input
              id="title"
              placeholder="Например: Закрытая вечеринка для избранных"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="theme">Тема вечеринки *</Label>
            <Input
              id="theme"
              placeholder="Например: Маскарад, Белая вечеринка, 90-е"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Расскажите о вечеринке, атмосфере, что будет..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Город *</Label>
              <Input
                id="city"
                placeholder="Москва"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="ageRestriction">Возрастное ограничение</Label>
              <Select
                value={formData.ageRestriction}
                onValueChange={(value) => setFormData({ ...formData, ageRestriction: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18+">18+</SelectItem>
                  <SelectItem value="21+">21+</SelectItem>
                  <SelectItem value="25+">25+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Дата *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="time">Время *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="maxTickets">Максимальное количество билетов</Label>
            <Input
              id="maxTickets"
              type="number"
              min="5"
              max="100"
              value={formData.maxTickets}
              onChange={(e) => setFormData({ ...formData, maxTickets: parseInt(e.target.value) || 20 })}
            />
          </div>

          <div>
            <Label className="mb-2 block">Стоимость входа</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="priceFemale" className="text-xs text-muted-foreground">
                  Девушка
                </Label>
                <Input
                  id="priceFemale"
                  type="number"
                  min="0"
                  placeholder="5000"
                  value={formData.ticketPrices.female || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ticketPrices: { ...formData.ticketPrices, female: parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="priceCouple" className="text-xs text-muted-foreground">
                  Пара
                </Label>
                <Input
                  id="priceCouple"
                  type="number"
                  min="0"
                  placeholder="15000"
                  value={formData.ticketPrices.couple || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ticketPrices: { ...formData.ticketPrices, couple: parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="priceMale" className="text-xs text-muted-foreground">
                  Мужчина
                </Label>
                <Input
                  id="priceMale"
                  type="number"
                  min="0"
                  placeholder="10000"
                  value={formData.ticketPrices.male || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ticketPrices: { ...formData.ticketPrices, male: parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>
            </div>
            <Select
              value={formData.currency}
              onValueChange={(value: Currency) => setFormData({ ...formData, currency: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RUB">₽ Рубль</SelectItem>
                <SelectItem value="USD">$ Доллар</SelectItem>
                <SelectItem value="EUR">€ Евро</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dresscode">Дресс-код</Label>
            <Input
              id="dresscode"
              placeholder="Например: Строгий деловой, Коктейльный"
              value={formData.dresscode}
              onChange={(e) => setFormData({ ...formData, dresscode: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="coverImage">Обложка (URL изображения)</Label>
            <Input
              id="coverImage"
              placeholder="https://example.com/image.jpg"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Правила вечеринки</Label>
              <Button type="button" variant="outline" size="sm" onClick={addRule}>
                <Icon name="Plus" size={16} className="mr-1" />
                Добавить
              </Button>
            </div>
            <div className="space-y-2">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Правило ${index + 1}`}
                    value={rule}
                    onChange={(e) => updateRule(index, e.target.value)}
                  />
                  {formData.rules.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRule(index)}>
                      <Icon name="X" size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>
            <Icon name="Check" size={16} className="mr-2" />
            Создать вечеринку
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePartyModal;
