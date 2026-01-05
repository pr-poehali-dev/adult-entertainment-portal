import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { businessServiceCategories } from '@/data/businessServiceCategories';
import { Badge } from '@/components/ui/badge';

export const BusinessServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Temporary stub
  const activeServices: any[] = [];

  const filteredServices = activeServices.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory;
    const matchesSearch = service.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="Briefcase" size={28} />
              Бизнес услуги
            </CardTitle>
            <CardDescription className="text-white/80">
              Объявления от проверенных бизнес-аккаунтов
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всего услуг</p>
                  <p className="text-3xl font-bold">{activeServices.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
                  <Icon name="Package" size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Категорий</p>
                  <p className="text-3xl font-bold">{businessServiceCategories.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
                  <Icon name="Grid3x3" size={24} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Найдено</p>
                  <p className="text-3xl font-bold">{filteredServices.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center">
                  <Icon name="Search" size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Поиск по услугам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {businessServiceCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <Icon name={category.icon as any} size={16} />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Пока нет доступных услуг</p>
                {selectedCategory !== 'all' && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory('all')}
                    className="mt-4"
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredServices.map((service) => {
              const category = businessServiceCategories.find(c => c.id === service.categoryId);
              const minPrice = Math.min(...service.programs.map(p => p.price));
              const maxPrice = Math.max(...service.programs.map(p => p.price));

              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {category && (
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Icon name={category.icon as any} size={24} className="text-white" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg">{service.categoryName}</CardTitle>
                          <CardDescription>
                            {service.programs.length} {service.programs.length === 1 ? 'программа' : service.programs.length < 5 ? 'программы' : 'программ'}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                        Активно
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">Цена</span>
                        <span className="font-bold text-pink-600">
                          {minPrice === maxPrice ? (
                            `${minPrice} ${service.programs[0].currency}`
                          ) : (
                            `${minPrice} - ${maxPrice} ${service.programs[0].currency}`
                          )}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {service.programs.map(program => (
                          <div key={program.id} className="p-2 bg-muted/50 rounded text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{program.name}</span>
                              <span className="text-pink-600 font-semibold">
                                {program.price} {program.currency}
                              </span>
                            </div>
                            {program.description && (
                              <p className="text-xs text-muted-foreground mt-1">{program.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                      <Icon name="MessageCircle" size={16} className="mr-2" />
                      Написать сообщение
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};