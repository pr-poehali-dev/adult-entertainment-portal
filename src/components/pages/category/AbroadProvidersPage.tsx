import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ServiceProvider, Page, TravelDestination } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { TravelInvitationDialog } from './TravelInvitationDialog';

interface AbroadProvidersPageProps {
  setCurrentPage: (page: Page) => void;
}

export const AbroadProvidersPage = ({ setCurrentPage }: AbroadProvidersPageProps) => {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<TravelDestination | null>(null);
  const [showInvitationDialog, setShowInvitationDialog] = useState(false);

  const mockProviders: ServiceProvider[] = [
    {
      id: 1,
      name: 'Алина Морская',
      age: 25,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
      rating: 4.9,
      verified: true,
      vipStatus: 'vip',
      categoryId: 'abroad',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/22300f84-1212-499e-a1f1-3125dd4a2728.jpg',
      ],
      about: 'Обожаю путешествия и новые впечатления. Свободно говорю на английском, французском и итальянском. Идеальная спутница для деловых поездок и отдыха.',
      languages: ['Русский', 'English', 'Français', 'Italiano'],
      price: 5000,
      currency: 'USD',
      location: 'Москва',
      travelDestinations: [
        {
          id: 1,
          resort: 'Мальдивы',
          country: 'Мальдивская Республика',
          startDate: '2024-12-15',
          endDate: '2024-12-25',
          pricePerDay: 5000,
          currency: 'USD',
          description: 'Роскошный отдых на белоснежных пляжах с кристально чистой водой',
          amenities: ['Дайвинг', 'Снорклинг', 'Спа', 'Йога'],
        },
        {
          id: 2,
          resort: 'Санторини',
          country: 'Греция',
          startDate: '2025-01-10',
          endDate: '2025-01-20',
          pricePerDay: 3500,
          currency: 'USD',
          description: 'Романтический отдых на греческом острове с захватывающими закатами',
          amenities: ['Экскурсии', 'Фотосессии', 'Винные туры'],
        },
      ],
    },
    {
      id: 2,
      name: 'Виктория Лазурная',
      age: 23,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria',
      rating: 4.8,
      verified: true,
      vipStatus: 'vip',
      categoryId: 'abroad',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/7b022cb5-ced6-46dc-9446-88606525899f.jpg',
      ],
      about: 'Элегантная и образованная спутница для путешествий по всему миру. Люблю искусство, архитектуру и гастрономию.',
      languages: ['Русский', 'English', 'Español'],
      price: 4000,
      currency: 'USD',
      location: 'Санкт-Петербург',
      travelDestinations: [
        {
          id: 3,
          resort: 'Дубай',
          country: 'ОАЭ',
          startDate: '2024-12-20',
          endDate: '2024-12-30',
          pricePerDay: 4000,
          currency: 'USD',
          description: 'Роскошь и комфорт в городе будущего',
          amenities: ['Шоппинг', 'Рестораны', 'Пляжный отдых', 'Экскурсии'],
        },
        {
          id: 4,
          resort: 'Париж',
          country: 'Франция',
          startDate: '2025-02-01',
          endDate: '2025-02-10',
          pricePerDay: 3000,
          currency: 'USD',
          description: 'Город любви и романтики, искусство и мода',
          amenities: ['Музеи', 'Рестораны', 'Шоппинг', 'Экскурсии'],
        },
      ],
    },
    {
      id: 3,
      name: 'Елена Солнечная',
      age: 27,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      rating: 4.7,
      verified: true,
      vipStatus: 'none',
      categoryId: 'abroad',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
      ],
      about: 'Активная и жизнерадостная. Обожаю приключения и новые знакомства.',
      languages: ['Русский', 'English'],
      price: 2500,
      currency: 'USD',
      location: 'Москва',
      travelDestinations: [
        {
          id: 5,
          resort: 'Бали',
          country: 'Индонезия',
          startDate: '2025-01-15',
          endDate: '2025-01-28',
          pricePerDay: 2500,
          currency: 'USD',
          description: 'Тропический рай с древними храмами и йога-ретритами',
          amenities: ['Серфинг', 'Йога', 'Экскурсии', 'Спа'],
        },
        {
          id: 6,
          resort: 'Барселона',
          country: 'Испания',
          startDate: '2025-03-01',
          endDate: '2025-03-12',
          pricePerDay: 2000,
          currency: 'USD',
          description: 'Архитектура Гауди, средиземноморская кухня и пляжи',
          amenities: ['Экскурсии', 'Пляж', 'Рестораны', 'Ночная жизнь'],
        },
      ],
    },
  ];

  const handleInvite = (provider: ServiceProvider, destination: TravelDestination) => {
    setSelectedProvider(provider);
    setSelectedDestination(destination);
    setShowInvitationDialog(true);
  };

  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-wide mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('home')}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Icon name="Plane" size={36} className="text-primary" />
            Заграница
          </h1>
          <p className="text-muted-foreground text-lg">
            Пригласите спутницу в путешествие мечты
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockProviders.map((provider) => (
            <Card
              key={provider.id}
              className="hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={provider.photos[0]}
                  alt={provider.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <div className="absolute top-3 right-3 flex gap-2">
                  {provider.verified && (
                    <Badge className="bg-green-500">
                      <Icon name="CheckCircle2" size={14} className="mr-1" />
                      Verified
                    </Badge>
                  )}
                  {provider.vipStatus === 'vip' && (
                    <Badge className="bg-primary">
                      <Icon name="Crown" size={14} className="mr-1" />
                      VIP
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-2xl mb-2">{provider.name}</h3>
                  <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Icon name="User" size={16} />
                      <span>{provider.age} лет</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="MapPin" size={16} />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/90 px-2 py-1 rounded">
                      <Icon name="Star" size={14} />
                      <span className="font-semibold">{provider.rating}</span>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm line-clamp-2">{provider.about}</p>
                </div>
              </div>

              <CardHeader className="border-b">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {provider.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        <Icon name="Languages" size={12} className="mr-1" />
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Icon name="Plane" size={20} className="text-primary" />
                  Доступные направления
                </h4>

                {provider.travelDestinations && provider.travelDestinations.length > 0 ? (
                  <div className="space-y-3">
                    {provider.travelDestinations.map((destination) => {
                      const days = calculateDays(destination.startDate, destination.endDate);
                      const totalPrice = days * destination.pricePerDay;

                      return (
                        <div
                          key={destination.id}
                          className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 space-y-3 border border-primary/20 hover:border-primary/40 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-bold text-lg mb-1 flex items-center gap-2">
                                <Icon name="MapPin" size={18} className="text-primary" />
                                {destination.resort}, {destination.country}
                              </h5>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center gap-2">
                                  <Icon name="Calendar" size={14} />
                                  <span>
                                    {new Date(destination.startDate).toLocaleDateString('ru-RU')} -{' '}
                                    {new Date(destination.endDate).toLocaleDateString('ru-RU')}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {destination.description && (
                            <p className="text-sm text-muted-foreground italic">
                              {destination.description}
                            </p>
                          )}

                          {destination.amenities && destination.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {destination.amenities.map((amenity) => (
                                <Badge key={amenity} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">
                                {destination.pricePerDay.toLocaleString('ru-RU')} USD/день
                              </div>
                              <div className="font-bold text-xl text-primary">
                                {totalPrice.toLocaleString('ru-RU')} USD
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Общая стоимость
                              </div>
                            </div>
                            <Button
                              onClick={() => handleInvite(provider, destination)}
                              className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg"
                            >
                              <Icon name="Send" size={16} className="mr-2" />
                              Пригласить
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Направления не указаны</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedProvider && selectedDestination && (
        <TravelInvitationDialog
          isOpen={showInvitationDialog}
          onClose={() => {
            setShowInvitationDialog(false);
            setSelectedProvider(null);
            setSelectedDestination(null);
          }}
          provider={selectedProvider}
          destination={selectedDestination}
        />
      )}
    </div>
  );
};