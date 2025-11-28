import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ServiceProvider, Page } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface VIPProvidersPageProps {
  setCurrentPage: (page: Page) => void;
}

export const VIPProvidersPage = ({ setCurrentPage }: VIPProvidersPageProps) => {
  const { toast } = useToast();

  const vipProviders: ServiceProvider[] = [
    {
      id: 101,
      name: 'Анастасия Королева',
      age: 26,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anastasia',
      rating: 5.0,
      verified: true,
      vipStatus: 'vip',
      categoryId: 'vip',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/7b022cb5-ced6-46dc-9446-88606525899f.jpg',
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
      ],
      about: 'Элитная модель международного уровня. Образование: МГУ (экономика), Сорбонна (искусствоведение). Опыт сопровождения на высших уровнях бизнеса и политики. Абсолютная конфиденциальность гарантирована.',
      languages: ['Русский', 'English', 'Français', 'Italiano', 'Deutsch'],
      price: 150000,
      currency: 'RUB',
      location: 'Москва',
    },
    {
      id: 102,
      name: 'Виктория Diamond',
      age: 24,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria',
      rating: 5.0,
      verified: true,
      vipStatus: 'vip',
      categoryId: 'vip',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/5f482fab-004b-42fa-9846-4ad8240e01ef.jpg',
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/22300f84-1212-499e-a1f1-3125dd4a2728.jpg',
      ],
      about: 'Международная модель и светская львица. Регулярно появляюсь на обложках ведущих fashion-журналов. Идеальная спутница для светских мероприятий, бизнес-встреч и частных вечеров. Высочайший уровень сервиса.',
      languages: ['Русский', 'English', 'Français', '中文'],
      price: 200000,
      currency: 'RUB',
      location: 'Москва',
    },
    {
      id: 103,
      name: 'Елизавета Platinum',
      age: 28,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elizabeth',
      rating: 5.0,
      verified: true,
      vipStatus: 'vip',
      categoryId: 'vip',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/29d615d5-3841-4827-a359-06c794346bc3.jpg',
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/de33f0a1-c479-48f5-94cb-1cf8c7ea86a4.jpg',
      ],
      about: 'Выпускница Гарвардской школы бизнеса. Профессиональная пианистка. Эксперт в искусстве, винах и haute cuisine. Сопровождаю на международных конференциях, приватных мероприятиях и культурных событиях мирового уровня.',
      languages: ['Русский', 'English', 'Español', 'Português'],
      price: 180000,
      currency: 'RUB',
      location: 'Москва',
    },
    {
      id: 104,
      name: 'Мария Exclusive',
      age: 25,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      rating: 5.0,
      verified: true,
      vipStatus: 'vip',
      categoryId: 'vip',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/a543fce0-3f60-413a-986e-b7ff2dc53e69.jpg',
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/5015e3a9-67c6-4205-b351-57c7212283e3.jpg',
      ],
      about: 'Топ-модель с мировым именем. Постоянная участница Недель моды в Париже, Милане и Нью-Йорке. Утонченная, образованная, с безупречными манерами. Сопровождение на закрытых мероприятиях и private events.',
      languages: ['Русский', 'English', 'Italiano', 'العربية'],
      price: 120000,
      currency: 'RUB',
      location: 'Москва',
    },
    {
      id: 105,
      name: 'Александра Imperial',
      age: 27,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandra',
      rating: 5.0,
      verified: true,
      vipStatus: 'vip',
      categoryId: 'vip',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/7b022cb5-ced6-46dc-9446-88606525899f.jpg',
      ],
      about: 'Дипломат, искусствовед, коллекционер. Владею шестью языками. Идеальная спутница для международных деловых поездок, дипломатических приемов и культурных мероприятий. Абсолютная дискретность.',
      languages: ['Русский', 'English', 'Français', 'Deutsch', '日本語', '한국어'],
      price: 250000,
      currency: 'RUB',
      location: 'Москва',
    },
    {
      id: 106,
      name: 'София Prestige',
      age: 23,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
      rating: 5.0,
      verified: true,
      vipStatus: 'vip',
      categoryId: 'vip',
      photos: [
        'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
      ],
      about: 'Балерина Большого театра, модель и светская персона. Изысканные манеры, интеллект и природная грация. Сопровождение на премьерах, гала-ужинах и эксклюзивных мероприятиях высшего общества.',
      languages: ['Русский', 'English', 'Français'],
      price: 100000,
      currency: 'RUB',
      location: 'Москва',
    },
  ];

  const handleBooking = (provider: ServiceProvider) => {
    toast({
      title: 'Запрос отправлен',
      description: `${provider.name} получит ваш запрос. Менеджер свяжется с вами в течение 1 часа для обсуждения деталей.`,
      duration: 6000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('home')}
            className="mb-6"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>

          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Icon name="Crown" size={48} className="text-primary animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="gold-shimmer">VIP ELITE</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Эксклюзивный доступ к элитным спутницам премиум-класса
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle2" size={18} className="text-green-500" />
                <span>100% верифицированы</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={18} className="text-primary" />
                <span>Абсолютная конфиденциальность</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Star" size={18} className="text-yellow-500" />
                <span>Рейтинг 5.0</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/30 rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <Icon name="Info" size={24} className="text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold">VIP-категория</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  В эту категорию допускаются только проверенные спутницы высшего уровня с безупречной репутацией. 
                  Минимальная стоимость встречи — <span className="font-bold text-primary">100,000 ₽</span>. 
                  Гарантируется полная конфиденциальность, профессионализм и высочайший уровень сервиса.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {vipProviders.map((provider) => (
            <Card
              key={provider.id}
              className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-primary/50 bg-gradient-to-br from-card to-card/80"
            >
              <div className="relative h-96 overflow-hidden">
                <img
                  src={provider.photos[0]}
                  alt={provider.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="flex gap-2">
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      <Icon name="Crown" size={14} className="mr-1" />
                      VIP ELITE
                    </Badge>
                    <Badge className="bg-green-500/90 backdrop-blur-sm">
                      <Icon name="CheckCircle2" size={14} className="mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <Badge className="bg-yellow-500/90 backdrop-blur-sm font-bold">
                    <Icon name="Star" size={14} className="mr-1" />
                    {provider.rating}
                  </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-2xl mb-2 tracking-wide">
                    {provider.name}
                  </h3>
                  <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Icon name="User" size={16} />
                      <span>{provider.age} лет</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="MapPin" size={16} />
                      <span>{provider.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardHeader className="border-b border-border/50">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {provider.about}
                  </p>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                      <Icon name="Languages" size={14} />
                      Владение языками
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Стоимость встречи</span>
                      <Badge variant="outline" className="text-xs">
                        <Icon name="Clock" size={12} className="mr-1" />
                        за встречу
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        {provider.price.toLocaleString('ru-RU')}
                      </span>
                      <span className="text-xl text-muted-foreground">₽</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleBooking(provider)}
                    className="w-full h-12 bg-gradient-to-r from-primary via-primary/90 to-primary text-white hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 font-semibold text-base"
                  >
                    <Icon name="Send" size={18} className="mr-2" />
                    Отправить запрос
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Lock" size={12} />
                    <span>Полная конфиденциальность гарантирована</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center max-w-2xl mx-auto">
          <div className="bg-muted/30 rounded-2xl p-8 border border-border">
            <Icon name="Shield" size={48} className="mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-3">Безопасность и конфиденциальность</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Все VIP-спутницы проходят тщательную проверку и верификацию. Мы гарантируем абсолютную 
              конфиденциальность ваших данных и деталей встреч. Профессиональная поддержка 24/7. 
              Индивидуальный менеджер для каждого клиента.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};