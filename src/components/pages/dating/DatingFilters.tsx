import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DatingFiltersProps {
  filters: {
    gender: string;
    ageFrom: string;
    ageTo: string;
    city: string;
    lookingFor: string;
    onlineOnly: boolean;
  };
  setFilters: (filters: any) => void;
  cities: string[];
  filteredCount: number;
}

export const DatingFilters = ({ filters, setFilters, cities, filteredCount }: DatingFiltersProps) => {
  return (
    <Card className="mb-8 border-2 border-pink-200 dark:border-pink-900">
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Пол</label>
            <Select value={filters.gender} onValueChange={(value) => setFilters({...filters, gender: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="female">Женский</SelectItem>
                <SelectItem value="male">Мужской</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Возраст от</label>
            <Input
              type="number"
              placeholder="18"
              value={filters.ageFrom}
              onChange={(e) => setFilters({...filters, ageFrom: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Возраст до</label>
            <Input
              type="number"
              placeholder="50"
              value={filters.ageTo}
              onChange={(e) => setFilters({...filters, ageTo: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Город</label>
            <Select value={filters.city} onValueChange={(value) => setFilters({...filters, city: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Все города" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все города</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Цель знакомства</label>
            <Select value={filters.lookingFor} onValueChange={(value) => setFilters({...filters, lookingFor: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Любая" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любая</SelectItem>
                <SelectItem value="Серьезные отношения">Серьезные отношения</SelectItem>
                <SelectItem value="Знакомство">Знакомство</SelectItem>
                <SelectItem value="Дружба">Дружба</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant={filters.onlineOnly ? "default" : "outline"}
              onClick={() => setFilters({...filters, onlineOnly: !filters.onlineOnly})}
              className="w-full"
            >
              <Icon name="Wifi" size={16} className="mr-2" />
              Только онлайн
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Найдено анкет: <span className="font-bold">{filteredCount}</span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({
              gender: 'all',
              ageFrom: '',
              ageTo: '',
              city: 'all',
              lookingFor: 'all',
              onlineOnly: false
            })}
          >
            Сбросить фильтры
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
