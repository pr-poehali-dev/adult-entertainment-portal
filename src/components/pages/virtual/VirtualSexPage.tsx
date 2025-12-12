import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { VirtualPerformerCard } from './VirtualPerformerCard';
import { VirtualCallBookingModal } from './VirtualCallBookingModal';
import { virtualPerformers, VirtualPerformer } from './virtualData';

interface VirtualSexPageProps {
  setCurrentPage: (page: Page) => void;
  subcategoryId?: string;
  bookings?: any[];
  setBookings?: (bookings: any[]) => void;
}

export const VirtualSexPage = ({
  setCurrentPage,
  subcategoryId,
  bookings,
  setBookings,
}: VirtualSexPageProps) => {
  const [selectedPerformer, setSelectedPerformer] = useState<VirtualPerformer | null>(null);
  const [selectedCallType, setSelectedCallType] = useState<'audio' | 'video' | 'chat'>('video');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filterOnline, setFilterOnline] = useState<boolean | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high'>('rating');

  const filteredPerformers = virtualPerformers
    .filter((performer) => {
      if (filterOnline !== 'all' && performer.online !== filterOnline) return false;
      if (subcategoryId && !performer.services.includes(subcategoryId as any)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_low') return a.pricePerMinute - b.pricePerMinute;
      if (sortBy === 'price_high') return b.pricePerMinute - a.pricePerMinute;
      return 0;
    });

  const handleBooking = (performer: VirtualPerformer, callType: 'audio' | 'video' | 'chat') => {
    setSelectedPerformer(performer);
    setSelectedCallType(callType);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-wide mx-auto px-4 py-8">
        <PageBreadcrumb
          items={[
            { label: 'Главная', onClick: () => setCurrentPage('home') },
            { label: 'Виртуальный секс' },
          ]}
        />

        <div className="mb-8 mt-4">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Icon name="Smartphone" size={36} className="text-primary" />
            Виртуальный секс
          </h1>
          <p className="text-muted-foreground text-lg">
            Видео и аудио звонки с проверенными моделями. Оплата поминутно от 10 до 60 минут.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="Filter" size={20} />
                Фильтры
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Доступность</p>
                <div className="space-y-2">
                  <Button
                    variant={filterOnline === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterOnline('all')}
                    className="w-full justify-start"
                  >
                    <Icon name="Users" size={16} className="mr-2" />
                    Все
                  </Button>
                  <Button
                    variant={filterOnline === true ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterOnline(true)}
                    className="w-full justify-start"
                  >
                    <Icon name="Radio" size={16} className="mr-2 text-green-500" />
                    Онлайн
                  </Button>
                  <Button
                    variant={filterOnline === false ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterOnline(false)}
                    className="w-full justify-start"
                  >
                    <Icon name="RadioOff" size={16} className="mr-2" />
                    Оффлайн
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Сортировка</p>
                <div className="space-y-2">
                  <Button
                    variant={sortBy === 'rating' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('rating')}
                    className="w-full justify-start"
                  >
                    <Icon name="Star" size={16} className="mr-2" />
                    По рейтингу
                  </Button>
                  <Button
                    variant={sortBy === 'price_low' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('price_low')}
                    className="w-full justify-start"
                  >
                    <Icon name="ArrowDown" size={16} className="mr-2" />
                    Дешевле
                  </Button>
                  <Button
                    variant={sortBy === 'price_high' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('price_high')}
                    className="w-full justify-start"
                  >
                    <Icon name="ArrowUp" size={16} className="mr-2" />
                    Дороже
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Icon name="Users" size={18} className="mr-2" />
                Найдено: {filteredPerformers.length}
              </Badge>

              {filterOnline !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterOnline('all')}
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Сбросить фильтры
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPerformers.map((performer) => (
                <VirtualPerformerCard
                  key={performer.id}
                  performer={performer}
                  onBookAudio={() => handleBooking(performer, 'audio')}
                  onBookVideo={() => handleBooking(performer, 'video')}
                  onBookChat={() => handleBooking(performer, 'chat')}
                />
              ))}
            </div>

            {filteredPerformers.length === 0 && (
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
        </div>
      </div>

      {selectedPerformer && (
        <VirtualCallBookingModal
          performer={selectedPerformer}
          callType={selectedCallType}
          open={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedPerformer(null);
          }}
          bookings={bookings}
          setBookings={setBookings}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};
