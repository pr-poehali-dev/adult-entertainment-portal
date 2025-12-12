import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';
import { RealMeetingBookingModal } from './RealMeetingBookingModal';

interface Provider {
  id: number;
  name: string;
  age: number;
  avatar: string;
  photos: string[];
  rating: number;
  verified: boolean;
  vipStatus: 'vip' | 'none';
  about: string;
  location: string;
  pricePerHour: number;
  languages: string[];
}

interface RealMeetingPageProps {
  setCurrentPage: (page: Page) => void;
  subcategoryId?: string;
  bookings?: any[];
  setBookings?: (bookings: any[]) => void;
}

export const RealMeetingPage = ({ setCurrentPage, subcategoryId, bookings, setBookings }: RealMeetingPageProps) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [meetingType, setMeetingType] = useState<'outcall' | 'apartment' | null>(null);

  const mockProviders: Provider[] = [
    {
      id: 1,
      name: 'Анастасия',
      age: 24,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anastasia',
      photos: ['https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg'],
      rating: 4.9,
      verified: true,
      vipStatus: 'vip',
      about: 'Очаровательная и элегантная девушка для приятного времяпровождения',
      location: 'Москва, центр',
      pricePerHour: 8000,
      languages: ['Русский', 'English'],
    },
    {
      id: 2,
      name: 'Виктория',
      age: 26,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria',
      photos: ['https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/7b022cb5-ced6-46dc-9446-88606525899f.jpg'],
      rating: 4.8,
      verified: true,
      vipStatus: 'vip',
      about: 'Приятная компания для встреч в любой обстановке',
      location: 'Москва, Арбат',
      pricePerHour: 10000,
      languages: ['Русский', 'English', 'Français'],
    },
    {
      id: 3,
      name: 'Екатерина',
      age: 23,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ekaterina',
      photos: ['https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/5f482fab-004b-42fa-9846-4ad8240e01ef.jpg'],
      rating: 4.7,
      verified: false,
      vipStatus: 'none',
      about: 'Нежная и открытая девушка для приятных встреч',
      location: 'Санкт-Петербург',
      pricePerHour: 6000,
      languages: ['Русский'],
    },
  ];

  const handleOpenBooking = (provider: Provider, type: 'outcall' | 'apartment') => {
    setSelectedProvider(provider);
    setMeetingType(type);
    setShowBookingModal(true);
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
            <Icon name="MapPin" size={36} className="text-primary" />
            Реальная встреча
          </h1>
          <p className="text-muted-foreground text-lg">
            Выберите формат встречи: выезд к вам или встреча в апартаментах
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProviders.map((provider) => (
            <Card
              key={provider.id}
              className="hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={provider.photos[0]}
                  alt={provider.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
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
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-white font-bold text-xl">{provider.name}</h3>
                      <p className="text-white/80 text-sm">{provider.age} лет • {provider.location}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/90 px-2 py-1 rounded">
                      <Icon name="Star" size={14} className="text-white" />
                      <span className="text-white font-semibold text-sm">{provider.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{provider.about}</p>
                
                <div className="flex flex-wrap gap-1">
                  {provider.languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">От</p>
                    <p className="text-xl font-bold text-primary">
                      {provider.pricePerHour.toLocaleString('ru-RU')} ₽
                    </p>
                    <p className="text-xs text-muted-foreground">за час</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button 
                    onClick={() => handleOpenBooking(provider, 'outcall')}
                    className="w-full"
                    variant="outline"
                  >
                    <Icon name="Car" size={16} className="mr-2" />
                    Выезд
                  </Button>
                  <Button 
                    onClick={() => handleOpenBooking(provider, 'apartment')}
                    className="w-full"
                  >
                    <Icon name="Home" size={16} className="mr-2" />
                    Апартаменты
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedProvider && meetingType && (
          <RealMeetingBookingModal
            provider={selectedProvider}
            meetingType={meetingType}
            open={showBookingModal}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedProvider(null);
              setMeetingType(null);
            }}
            bookings={bookings}
            setBookings={setBookings}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};
