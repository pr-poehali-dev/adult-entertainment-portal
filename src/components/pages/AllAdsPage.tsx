import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { UserAd, Page, Profile } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AllAdsPageProps {
  setCurrentPage: (page: Page) => void;
  profile: Profile;
  userAds: UserAd[];
}

export const AllAdsPage = ({ setCurrentPage, profile, userAds }: AllAdsPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const categories = [
    'Эскорт',
    'Массаж',
    'Стриптиз',
    'Модели',
    'Другое'
  ];

  const filteredAds = userAds.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ad.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ad.category === selectedCategory;
    const matchesType = selectedType === 'all' || ad.type === selectedType;
    const isActive = ad.status === 'active';
    
    return matchesSearch && matchesCategory && matchesType && isActive;
  });

  const sortedAds = [...filteredAds].sort((a, b) => {
    if (a.isBoosted && !b.isBoosted) return -1;
    if (!a.isBoosted && b.isBoosted) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} дн. назад`;
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Все объявления
            </h1>
            <p className="text-muted-foreground mt-1">
              Объявления от пользователей платформы
            </p>
          </div>
          <Button onClick={() => setCurrentPage('my-ads')} variant="outline">
            <Icon name="User" size={20} className="mr-2" />
            Мои объявления
          </Button>
        </div>

        <Card className="border-2">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <div className="relative">
                  <Icon 
                    name="Search" 
                    size={20} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                  />
                  <Input
                    placeholder="Поиск объявлений..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Тип объявления" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="service_offer">Предложения услуг</SelectItem>
                  <SelectItem value="service_request">Поиск услуг</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {sortedAds.length === 0 ? (
            <Card className="border-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Icon name="Inbox" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Объявления не найдены</h3>
                <p className="text-muted-foreground text-center">
                  Попробуйте изменить параметры поиска
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedAds.map(ad => (
              <Card 
                key={ad.id} 
                className={`border-2 hover:shadow-lg transition-all cursor-pointer ${
                  ad.isBoosted ? 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-900/10' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={ad.authorAvatar}
                      alt={ad.authorName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{ad.title}</h3>
                            {ad.isBoosted && (
                              <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full flex items-center gap-1">
                                <Icon name="Zap" size={12} />
                                Продвинуто
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">{ad.authorName}</span>
                            <span>•</span>
                            <span>{formatDate(ad.createdAt)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Icon name="Eye" size={14} />
                              {ad.viewCount || 0}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {typeof ad.price === 'number' ? `${ad.price} ₽` : ad.price}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {ad.type === 'service_offer' ? 'Предлагаю' : 'Ищу'}
                          </div>
                        </div>
                      </div>

                      {ad.description && (
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {ad.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {ad.category}
                        </span>
                        {ad.location && (
                          <span className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-1">
                            <Icon name="MapPin" size={14} />
                            {ad.location}
                          </span>
                        )}
                        {ad.responses && ad.responses.length > 0 && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm flex items-center gap-1">
                            <Icon name="MessageCircle" size={14} />
                            {ad.responses.length} откликов
                          </span>
                        )}
                      </div>

                      {ad.authorId !== profile.id && (
                        <div className="mt-4 flex gap-2">
                          <Button size="sm">
                            <Icon name="MessageCircle" size={16} className="mr-2" />
                            Откликнуться
                          </Button>
                          <Button size="sm" variant="outline">
                            <Icon name="Eye" size={16} className="mr-2" />
                            Подробнее
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
