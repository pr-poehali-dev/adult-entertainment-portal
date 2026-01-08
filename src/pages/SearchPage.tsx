import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';

interface SearchPageProps {
  setCurrentPage: (page: string) => void;
}

export const SearchPage = ({ setCurrentPage }: SearchPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = [
    { id: 'age', label: 'Возраст', icon: 'Calendar' },
    { id: 'location', label: 'Город', icon: 'MapPin' },
    { id: 'price', label: 'Цена', icon: 'DollarSign' },
    { id: 'rating', label: 'Рейтинг', icon: 'Star' },
    { id: 'verified', label: 'Верифицирован', icon: 'CheckCircle' },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Поиск</h1>
          <p className="text-muted-foreground text-lg">
            Найдите то, что ищете с помощью умного поиска
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Поиск по имени, городу, услуге..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-2xl"
            />
            <Icon 
              name="Search" 
              size={24} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Фильтры</h3>
          <div className="flex flex-wrap gap-3">
            {filters.map(filter => (
              <Button
                key={filter.id}
                variant={selectedFilters.includes(filter.id) ? 'default' : 'outline'}
                onClick={() => toggleFilter(filter.id)}
                className="rounded-full"
              >
                <Icon name={filter.icon as any} size={16} className="mr-2" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Результаты поиска</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Icon name="User" size={64} className="text-muted-foreground" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-lg mb-1">Имя пользователя</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="MapPin" size={14} />
                        Москва
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                      <Icon name="Star" size={14} className="text-yellow-500" />
                      <span className="text-sm font-semibold">4.8</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Краткое описание услуг и особенностей...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">от 5000 ₽</span>
                    <Button size="sm">Подробнее</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg">
              Загрузить еще
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
