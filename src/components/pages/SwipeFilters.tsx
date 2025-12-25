import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

export interface SwipeFilters {
  ageRange: [number, number];
  city: string;
  interests: string[];
  verifiedOnly: boolean;
}

interface SwipeFiltersProps {
  filters: SwipeFilters;
  onApply: (filters: SwipeFilters) => void;
  onClose: () => void;
}

const CITIES = [
  'Все города',
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Новосибирск',
  'Екатеринбург',
  'Нижний Новгород',
  'Краснодар',
];

const INTERESTS = [
  'Путешествия',
  'Спорт',
  'Музыка',
  'Кино',
  'Книги',
  'Искусство',
  'Технологии',
  'Фотография',
  'Йога',
  'Кофе',
  'Природа',
  'Танцы',
];

export default function SwipeFiltersModal({ filters, onApply, onClose }: SwipeFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SwipeFilters>(filters);

  const handleAgeChange = (value: number[]) => {
    setLocalFilters({ ...localFilters, ageRange: [value[0], value[1]] });
  };

  const toggleInterest = (interest: string) => {
    if (localFilters.interests.includes(interest)) {
      setLocalFilters({
        ...localFilters,
        interests: localFilters.interests.filter(i => i !== interest),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        interests: [...localFilters.interests, interest],
      });
    }
  };

  const handleReset = () => {
    setLocalFilters({
      ageRange: [18, 50],
      city: 'Все города',
      interests: [],
      verifiedOnly: false,
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <Card className="w-full md:w-[500px] md:max-h-[80vh] overflow-y-auto rounded-t-3xl md:rounded-2xl p-6 space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Фильтры поиска</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={24} />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Возраст</label>
              <span className="text-sm text-muted-foreground">
                {localFilters.ageRange[0]} - {localFilters.ageRange[1]} лет
              </span>
            </div>
            <Slider
              min={18}
              max={50}
              step={1}
              value={localFilters.ageRange}
              onValueChange={handleAgeChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Город</label>
            <div className="flex flex-wrap gap-2">
              {CITIES.map(city => (
                <Badge
                  key={city}
                  variant={localFilters.city === city ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-2"
                  onClick={() => setLocalFilters({ ...localFilters, city })}
                >
                  {city}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Интересы</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => (
                <Badge
                  key={interest}
                  variant={localFilters.interests.includes(interest) ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-2"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Icon name="ShieldCheck" size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Только верифицированные</p>
                <p className="text-xs text-muted-foreground">Показывать профили с проверкой</p>
              </div>
            </div>
            <button
              onClick={() =>
                setLocalFilters({ ...localFilters, verifiedOnly: !localFilters.verifiedOnly })
              }
              className={`relative w-12 h-6 rounded-full transition-colors ${
                localFilters.verifiedOnly ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  localFilters.verifiedOnly ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Сбросить
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Применить фильтры
          </Button>
        </div>
      </Card>
    </div>
  );
}
