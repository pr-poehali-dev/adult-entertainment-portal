import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { UserAd, Profile, Currency } from '@/types';

interface CreateAdModalProps {
  profile: Profile;
  onClose: () => void;
  onCreate: (ad: Omit<UserAd, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'authorRole' | 'createdAt' | 'responses'>) => void;
}

const CATEGORIES = [
  'Классика',
  'Массаж',
  'Фотосессия',
  'Свидание',
  'Эскорт',
  'Вечеринка',
  'Другое'
];

export const CreateAdModal = ({ profile, onClose, onCreate }: CreateAdModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [currency] = useState<Currency>('RUB');

  const isServiceOffer = profile.role === 'seller';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !category || !price) {
      alert('Заполните все обязательные поля');
      return;
    }

    if (!isServiceOffer && !lookingFor.trim()) {
      alert('Укажите какую девушку ищете');
      return;
    }

    const ad: Omit<UserAd, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'authorRole' | 'createdAt' | 'responses'> = {
      type: isServiceOffer ? 'service_offer' : 'service_request',
      category,
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      currency,
      duration: duration ? parseFloat(duration) : undefined,
      lookingFor: !isServiceOffer ? lookingFor.trim() : undefined,
      status: 'active'
    };

    onCreate(ad);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {isServiceOffer ? 'Новое предложение услуги' : 'Новый запрос услуги'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">
              Категория <span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Заголовок <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder={isServiceOffer 
                ? "Например: Профессиональный массаж с выездом"
                : "Например: Ищу девушку для свидания"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">{title.length}/100</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Описание <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder={isServiceOffer
                ? "Опишите вашу услугу подробно: что входит, условия, особенности..."
                : "Опишите что вы хотите: длительность встречи, место, пожелания..."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">{description.length}/1000</p>
          </div>

          {!isServiceOffer && (
            <div className="space-y-2">
              <Label htmlFor="lookingFor">
                Какую девушку ищете <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="lookingFor"
                placeholder="Например: Девушка 20-30 лет, стройная, с опытом массажа..."
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">{lookingFor.length}/500</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                {isServiceOffer ? 'Цена' : 'Готов заплатить'} <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="price"
                  type="number"
                  placeholder="5000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="100"
                />
                <div className="flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                  ₽
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">
                Длительность (часов)
              </Label>
              <Input
                id="duration"
                type="number"
                placeholder="2"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="0.5"
                step="0.5"
              />
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium">
                  {isServiceOffer ? 'Как это работает:' : 'Как работают запросы:'}
                </p>
                {isServiceOffer ? (
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Ваше объявление увидят мужчины</li>
                    <li>Они смогут забронировать услугу напрямую</li>
                    <li>Вы получите уведомление о бронировании</li>
                  </ul>
                ) : (
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Девушки увидят ваш запрос в каталоге</li>
                    <li>Они смогут откликнуться на него</li>
                    <li>Вы получите уведомления об откликах</li>
                    <li>Сможете просмотреть профили и выбрать девушку</li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              <Icon name="Check" size={18} />
              Опубликовать
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
