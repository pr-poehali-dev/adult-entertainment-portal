import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';
import { MassageBookingModal, MassageBooking } from '../MassageBookingModal';

interface MassageProvidersPageProps {
  setCurrentPage: (page: Page) => void;
}

interface MassageProvider {
  id: number;
  name: string;
  age: number;
  avatar: string;
  rating: number;
  verified: boolean;
  vipStatus: string;
  photos: string[];
  about: string;
  location: string;
  specializations: string[];
  experience: string;
}

export const MassageProvidersPage = ({ setCurrentPage }: MassageProvidersPageProps) => {
  const [selectedProvider, setSelectedProvider] = useState<MassageProvider | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const massageProviders: MassageProvider[] = [
    {
      id: 1,
      name: 'Анастасия Петрова',
      age: 28,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anastasia',
      rating: 4.9,
      verified: true,
      vipStatus: 'vip',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/a543fce0-3f60-413a-986e-b7ff2dc53e69.jpg',
      ],
      about: 'Сертифицированный массажист с 7-летним опытом. Специализируюсь на расслабляющих и лечебных техниках.',
      location: 'Москва',
      specializations: ['Классический массаж', 'Тайский массаж', 'Ароматерапия'],
      experience: '7 лет',
    },
    {
      id: 2,
      name: 'Мария Сидорова',
      age: 32,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria2',
      rating: 4.8,
      verified: true,
      vipStatus: 'vip',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/7b022cb5-ced6-46dc-9446-88606525899f.jpg',
      ],
      about: 'Профессиональный массажист. Работаю с профессиональными спортсменами и частными клиентами.',
      location: 'Санкт-Петербург',
      specializations: ['Спортивный массаж', 'Горячие камни', 'Классический массаж'],
      experience: '10 лет',
    },
    {
      id: 3,
      name: 'Елена Иванова',
      age: 26,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena2',
      rating: 4.7,
      verified: true,
      vipStatus: 'none',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
      ],
      about: 'Специалист по расслабляющим техникам массажа. Индивидуальный подход к каждому клиенту.',
      location: 'Москва',
      specializations: ['Расслабляющий массаж', 'Ароматерапия', 'Классический массаж'],
      experience: '5 лет',
    },
    {
      id: 4,
      name: 'Виктория Смирнова',
      age: 30,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria',
      rating: 5.0,
      verified: true,
      vipStatus: 'vip',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/5f482fab-004b-42fa-9846-4ad8240e01ef.jpg',
      ],
      about: 'Мастер экзотических техник массажа. Прошла обучение в Таиланде и на Бали.',
      location: 'Москва',
      specializations: ['Тайский массаж', 'Балийский массаж', 'Горячие камни'],
      experience: '8 лет',
    },
  ];

  const handleSelectProvider = (provider: MassageProvider) => {
    setSelectedProvider(provider);
    setShowBookingModal(true);
  };

  const handleBookingConfirm = (booking: MassageBooking) => {
    console.log('Бронирование массажа:', { provider: selectedProvider, booking });
    setShowBookingModal(false);
    alert(`Бронирование подтверждено!\n\nИсполнитель: ${selectedProvider?.name}\nПрограмма: ${booking.program}\nДата: ${booking.date}\nВремя: ${booking.time}\nПредоплата: ${Math.round(booking.price * 0.3)} ₽`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-wide mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('home')}
            className="mb-4 text-primary hover:text-primary/80"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <h1 className="text-5xl font-bold mb-4">
            <span className="gold-shimmer">Массаж</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Выберите специалиста и запишитесь на сеанс массажа
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {massageProviders.map((provider) => (
            <Card
              key={provider.id}
              className="hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={provider.photos[0]}
                  alt={provider.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {provider.verified && (
                    <Badge className="bg-green-500 shadow-lg">
                      <Icon name="CheckCircle2" size={14} className="mr-1" />
                      Проверен
                    </Badge>
                  )}
                  {provider.vipStatus === 'vip' && (
                    <Badge className="bg-primary shadow-lg">
                      <Icon name="Crown" size={14} className="mr-1" />
                      VIP
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-xl drop-shadow-lg">{provider.name}</h3>
                      <p className="text-white/90 text-sm">
                        {provider.age} лет • {provider.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500 px-2.5 py-1 rounded-lg shadow-lg">
                      <Icon name="Star" size={16} className="text-white fill-white" />
                      <span className="text-white font-bold">{provider.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardHeader className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {provider.about}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Award" size={16} className="text-primary" />
                  <span className="font-medium">Опыт: {provider.experience}</span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Icon name="Sparkles" size={14} className="text-primary" />
                    Специализации:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {provider.specializations.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  onClick={() => handleSelectProvider(provider)}
                >
                  <Icon name="Calendar" size={18} />
                  Записаться на сеанс
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {showBookingModal && selectedProvider && (
        <MassageBookingModal
          service={{ 
            id: selectedProvider.id, 
            title: `Массаж от ${selectedProvider.name}`,
            seller: selectedProvider.name,
          } as any}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedProvider(null);
          }}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
};
