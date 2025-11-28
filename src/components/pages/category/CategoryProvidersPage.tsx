import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ServiceProvider, Page, DinnerSchedule } from '@/types';
import { getCategoryName } from '@/data/serviceCategories';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { AbroadProvidersPage } from './AbroadProvidersPage';

interface CategoryProvidersPageProps {
  categoryId: string;
  setCurrentPage: (page: Page) => void;
}

const dayNames: Record<string, string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье',
};

export const CategoryProvidersPage = ({ categoryId, setCurrentPage }: CategoryProvidersPageProps) => {
  if (categoryId === 'abroad') {
    return <AbroadProvidersPage setCurrentPage={setCurrentPage} />;
  }

  const { language } = useLanguage();
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  const mockProviders: ServiceProvider[] = [
    {
      id: 1,
      name: 'Анна Романова',
      age: 24,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      rating: 4.9,
      verified: true,
      vipStatus: 'vip',
      categoryId: 'dinner',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/5f482fab-004b-42fa-9846-4ad8240e01ef.jpg',
      ],
      about: 'Обожаю вечерние прогулки и изысканную кухню. Свободно владею английским и французским.',
      languages: ['Русский', 'English', 'Français'],
      price: 15000,
      currency: 'RUB',
      location: 'Москва',
      dinnerSchedules: [
        {
          dayOfWeek: 'friday',
          time: '19:00',
          restaurant: 'White Rabbit',
          location: 'Смоленская площадь, 3',
          price: 15000,
          currency: 'RUB',
          description: 'Ресторан с панорамным видом на Москву',
        },
        {
          dayOfWeek: 'saturday',
          time: '20:00',
          restaurant: 'Turandot',
          location: 'Тверской бульвар, 26',
          price: 18000,
          currency: 'RUB',
          description: 'Роскошный интерьер в стиле китайского дворца',
        },
      ],
    },
    {
      id: 2,
      name: 'Мария Соколова',
      age: 26,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      rating: 4.8,
      verified: true,
      vipStatus: 'vip',
      categoryId: 'dinner',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/7b022cb5-ced6-46dc-9446-88606525899f.jpg',
      ],
      about: 'Ценю хорошую компанию и интеллектуальные беседы за ужином.',
      languages: ['Русский', 'English'],
      price: 12000,
      currency: 'RUB',
      location: 'Санкт-Петербург',
      dinnerSchedules: [
        {
          dayOfWeek: 'thursday',
          time: '19:30',
          restaurant: 'Cococo',
          location: 'Вознесенский пр., 6',
          price: 12000,
          currency: 'RUB',
          description: 'Современная русская кухня',
        },
      ],
    },
    {
      id: 3,
      name: 'Елена Волкова',
      age: 23,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      rating: 4.7,
      verified: false,
      vipStatus: 'none',
      categoryId: 'dinner',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
      ],
      about: 'Люблю уютные вечера в хороших ресторанах.',
      languages: ['Русский'],
      price: 10000,
      currency: 'RUB',
      location: 'Москва',
      dinnerSchedules: [
        {
          dayOfWeek: 'wednesday',
          time: '18:30',
          restaurant: 'Café Pushkin',
          location: 'Тверской бульвар, 26А',
          price: 10000,
          currency: 'RUB',
        },
        {
          dayOfWeek: 'sunday',
          time: '19:00',
          restaurant: 'Sixty',
          location: 'Пресненская наб., 12',
          price: 11000,
          currency: 'RUB',
        },
      ],
    },
  ];

  const handleInvite = (provider: ServiceProvider, schedule: DinnerSchedule) => {
    toast({
      title: 'Приглашение отправлено!',
      description: `${provider.name} получит ваше приглашение на ${dayNames[schedule.dayOfWeek]} в ${schedule.time}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('home')}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
          <h1 className="text-4xl font-bold mb-2">
            {getCategoryName(categoryId, language)}
          </h1>
          <p className="text-muted-foreground text-lg">
            Выберите анкету и пригласите на ужин
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProviders.map((provider) => (
            <Card
              key={provider.id}
              className="hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden">
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
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
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

              <CardHeader>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{provider.about}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {provider.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Calendar" size={16} className="text-primary" />
                    Расписание ужинов
                  </h4>
                  {provider.dinnerSchedules && provider.dinnerSchedules.length > 0 ? (
                    <div className="space-y-2">
                      {provider.dinnerSchedules.map((schedule, idx) => (
                        <div
                          key={idx}
                          className="bg-muted/50 rounded-lg p-3 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon name="Clock" size={14} className="text-primary" />
                                <span className="font-medium text-sm">
                                  {dayNames[schedule.dayOfWeek]} в {schedule.time}
                                </span>
                              </div>
                              <div className="flex items-start gap-2 mb-1">
                                <Icon name="UtensilsCrossed" size={14} className="text-primary mt-0.5" />
                                <div className="text-xs">
                                  <p className="font-medium">{schedule.restaurant}</p>
                                  <p className="text-muted-foreground">{schedule.location}</p>
                                </div>
                              </div>
                              {schedule.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {schedule.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm font-bold text-primary">
                              {schedule.price.toLocaleString('ru-RU')} {schedule.currency === 'RUB' ? '₽' : schedule.currency}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleInvite(provider, schedule)}
                              className="bg-gradient-to-r from-primary to-primary/90"
                            >
                              <Icon name="Send" size={14} className="mr-1" />
                              Пригласить
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Расписание не указано</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};