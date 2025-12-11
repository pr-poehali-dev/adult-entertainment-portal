import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { StripteaseAdCard } from './StripteaseAdCard';
import { StripteaseBookingModal } from './StripteaseBookingModal';
import { stripteaseAds, StripteaseAd } from './stripteaseData';

interface StripteasePageProps {
  setCurrentPage: (page: Page) => void;
}

export const StripteasePage = ({ setCurrentPage }: StripteasePageProps) => {
  const [selectedAd, setSelectedAd] = useState<StripteaseAd | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high'>('rating');

  const filteredAds = stripteaseAds
    .filter(ad => filterGender === 'all' || ad.gender === filterGender)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_low') return a.pricePerHour - b.pricePerHour;
      if (sortBy === 'price_high') return b.pricePerHour - a.pricePerHour;
      return 0;
    });

  const handleBooking = (ad: StripteaseAd) => {
    setSelectedAd(ad);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/20 dark:via-purple-950/10 to-background">
      <div className="max-w-wide mx-auto px-4 py-8">
        <PageBreadcrumb currentPage="service" setCurrentPage={setCurrentPage} />

        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Sparkles" size={48} className="text-purple-600 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Стриптиз
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Профессиональные танцоры и танцовщицы для вашего мероприятия
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon name="Filter" size={20} />
                Фильтры
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterGender === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterGender('all')}
                >
                  Все
                </Button>
                <Button
                  variant={filterGender === 'female' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterGender('female')}
                >
                  <Icon name="User" size={16} className="mr-1" />
                  Девушки
                </Button>
                <Button
                  variant={filterGender === 'male' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterGender('male')}
                >
                  <Icon name="User" size={16} className="mr-1" />
                  Мужчины
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon name="ArrowUpDown" size={20} />
                Сортировка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={sortBy === 'rating' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('rating')}
                >
                  <Icon name="Star" size={16} className="mr-1" />
                  По рейтингу
                </Button>
                <Button
                  variant={sortBy === 'price_low' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('price_low')}
                >
                  <Icon name="ArrowDown" size={16} className="mr-1" />
                  Дешевле
                </Button>
                <Button
                  variant={sortBy === 'price_high' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('price_high')}
                >
                  <Icon name="ArrowUp" size={16} className="mr-1" />
                  Дороже
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Icon name="Users" size={18} className="mr-2" />
            Найдено: {filteredAds.length} {filteredAds.length === 1 ? 'исполнитель' : 'исполнителей'}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map(ad => (
            <StripteaseAdCard
              key={ad.id}
              ad={ad}
              onBook={() => handleBooking(ad)}
            />
          ))}
        </div>

        {filteredAds.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Icon name="SearchX" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">
                По выбранным фильтрам ничего не найдено
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedAd && (
        <StripteaseBookingModal
          ad={selectedAd}
          open={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedAd(null);
          }}
        />
      )}
    </div>
  );
};
