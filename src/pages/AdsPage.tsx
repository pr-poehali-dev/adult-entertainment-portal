import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AdsPageProps {
  setCurrentPage: (page: string) => void;
}

export const AdsPage = ({ setCurrentPage }: AdsPageProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'vip' | 'new'>('all');

  const categories = [
    { id: 'all', label: 'Все объявления', count: 156 },
    { id: 'escort', label: 'Эскорт', count: 45 },
    { id: 'massage', label: 'Массаж', count: 32 },
    { id: 'dating', label: 'Встречи', count: 28 },
    { id: 'other', label: 'Другое', count: 51 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Объявления</h1>
            <p className="text-muted-foreground text-lg">
              Актуальные предложения от проверенных пользователей
            </p>
          </div>
          <Button className="gap-2">
            <Icon name="Plus" size={18} />
            Создать объявление
          </Button>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
            className="rounded-full whitespace-nowrap"
          >
            Все
          </Button>
          <Button
            variant={activeTab === 'vip' ? 'default' : 'outline'}
            onClick={() => setActiveTab('vip')}
            className="rounded-full whitespace-nowrap gap-2"
          >
            <Icon name="Crown" size={16} />
            VIP
          </Button>
          <Button
            variant={activeTab === 'new' ? 'default' : 'outline'}
            onClick={() => setActiveTab('new')}
            className="rounded-full whitespace-nowrap gap-2"
          >
            <Icon name="Sparkles" size={16} />
            Новые
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Категории</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <span className="font-medium">{cat.label}</span>
                      <Badge variant="secondary">{cat.count}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Фильтры</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Цена, ₽</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="number" 
                        placeholder="От" 
                        className="px-3 py-2 rounded-lg border border-border bg-background"
                      />
                      <input 
                        type="number" 
                        placeholder="До" 
                        className="px-3 py-2 rounded-lg border border-border bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Город</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background">
                      <option>Все города</option>
                      <option>Москва</option>
                      <option>Санкт-Петербург</option>
                      <option>Казань</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="verified" className="rounded" />
                    <label htmlFor="verified" className="text-sm font-medium">
                      Только верифицированные
                    </label>
                  </div>
                  <Button className="w-full">Применить</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                <Card key={i} className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                  <div className="relative">
                    <div className="h-72 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Icon name="Image" size={64} className="text-muted-foreground" />
                    </div>
                    {i % 3 === 0 && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 border-0">
                        <Icon name="Crown" size={12} className="mr-1" />
                        VIP
                      </Badge>
                    )}
                    <button className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors">
                      <Icon name="Heart" size={18} className="text-white" />
                    </button>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg mb-1">Название объявления</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Icon name="MapPin" size={12} />
                          Москва
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full flex-shrink-0">
                        <Icon name="Star" size={12} className="text-yellow-500" />
                        <span className="text-xs font-semibold">4.9</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      Краткое описание услуги и особенностей предложения
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground block">от</span>
                        <span className="text-xl font-bold text-primary">5000 ₽</span>
                      </div>
                      <Button size="sm" className="group-hover:scale-105 transition-transform">
                        Смотреть
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Icon name="ChevronLeft" size={18} />
                </Button>
                <Button variant="default" size="icon">1</Button>
                <Button variant="outline" size="icon">2</Button>
                <Button variant="outline" size="icon">3</Button>
                <Button variant="outline" size="icon">
                  <Icon name="ChevronRight" size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
