import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';

interface EscortEventsPageProps {
  setCurrentPage: (page: Page) => void;
}

interface EscortProvider {
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
  languages: string[];
  specializations: string[];
  price: number;
  currency: string;
}

export const EscortEventsPage = ({ setCurrentPage }: EscortEventsPageProps) => {
  const escortProviders: EscortProvider[] = [
    {
      id: 1,
      name: 'Анастасия Романова',
      age: 26,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anastasia2',
      rating: 4.9,
      verified: true,
      vipStatus: 'vip',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
      ],
      about: 'Профессиональное сопровождение на деловых встречах и светских мероприятиях. Элегантная, образованная, свободно владею английским.',
      location: 'Москва',
      languages: ['Русский', 'English', 'Français'],
      specializations: ['Деловые встречи', 'Светские мероприятия', 'Корпоративы'],
      price: 25000,
      currency: 'RUB',
    },
    {
      id: 2,
      name: 'Виктория Соколова',
      age: 28,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria2',
      rating: 4.8,
      verified: true,
      vipStatus: 'vip',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/7b022cb5-ced6-46dc-9446-88606525899f.jpg',
      ],
      about: 'Опыт сопровождения на бизнес-ужинах, банкетах и частных вечеринках. Умею поддержать любую беседу.',
      location: 'Москва',
      languages: ['Русский', 'English'],
      specializations: ['Банкеты', 'Вечеринки', 'Бизнес-ужины'],
      price: 22000,
      currency: 'RUB',
    },
    {
      id: 3,
      name: 'Мария Волкова',
      age: 24,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria3',
      rating: 4.7,
      verified: true,
      vipStatus: 'none',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/5f482fab-004b-42fa-9846-4ad8240e01ef.jpg',
      ],
      about: 'Сопровождение на светских мероприятиях и корпоративных событиях. Приятная в общении, стильная.',
      location: 'Санкт-Петербург',
      languages: ['Русский'],
      specializations: ['Корпоративы', 'Светские мероприятия', 'Презентации'],
      price: 18000,
      currency: 'RUB',
    },
    {
      id: 4,
      name: 'Елена Петрова',
      age: 27,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena3',
      rating: 5.0,
      verified: true,
      vipStatus: 'vip',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/de33f0a1-c479-48f5-94cb-1cf8c7ea86a4.jpg',
      ],
      about: 'VIP эскорт-сопровождение на любых мероприятиях. Опыт работы с высокопоставленными клиентами.',
      location: 'Москва',
      languages: ['Русский', 'English', 'Deutsch'],
      specializations: ['Деловые встречи', 'Светские рауты', 'Закрытые мероприятия'],
      price: 30000,
      currency: 'RUB',
    },
  ];

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
            <span className="gold-shimmer">Эскорт на мероприятиях</span>
          </h1>
          <div className="text-muted-foreground text-lg space-y-2">
            <p>Профессиональное сопровождение на:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Деловых встречах и переговорах</li>
              <li>Светских мероприятиях и презентациях</li>
              <li>Вечеринках, банкетах и корпоративах</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {escortProviders.map((provider) => (
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
                      Проверена
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

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Icon name="Globe" size={14} className="text-primary" />
                    Языки:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {provider.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Icon name="Briefcase" size={14} className="text-primary" />
                    Специализация:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {provider.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">От</span>
                  <span className="text-xl font-bold text-primary">
                    {provider.price.toLocaleString()} {provider.currency === 'RUB' ? '₽' : '$'}
                  </span>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  onClick={() => alert(`Бронирование сопровождения: ${provider.name}\nСтоимость: от ${provider.price.toLocaleString()} ₽`)}
                >
                  <Icon name="Calendar" size={18} />
                  Заказать сопровождение
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
