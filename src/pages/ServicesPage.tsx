import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ServicesPageProps {
  setCurrentPage: (page: string) => void;
}

export const ServicesPage = ({ setCurrentPage }: ServicesPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const serviceCategories = [
    {
      id: 'escort',
      name: 'Эскорт услуги',
      icon: 'Heart',
      color: 'from-pink-500 to-rose-500',
      description: 'Профессиональное сопровождение на мероприятия',
      count: 45,
    },
    {
      id: 'massage',
      name: 'Массаж и СПА',
      icon: 'Sparkles',
      color: 'from-purple-500 to-indigo-500',
      description: 'Расслабляющий и лечебный массаж',
      count: 32,
    },
    {
      id: 'entertainment',
      name: 'Развлечения',
      icon: 'Music',
      color: 'from-blue-500 to-cyan-500',
      description: 'Стриптиз, танцы, шоу-программы',
      count: 28,
    },
    {
      id: 'photo',
      name: 'Фото и видео',
      icon: 'Camera',
      color: 'from-green-500 to-emerald-500',
      description: 'Профессиональная фото и видеосъемка',
      count: 18,
    },
    {
      id: 'consulting',
      name: 'Консультации',
      icon: 'MessageCircle',
      color: 'from-orange-500 to-amber-500',
      description: 'Психологические консультации и коучинг',
      count: 15,
    },
    {
      id: 'other',
      name: 'Другие услуги',
      icon: 'MoreHorizontal',
      color: 'from-gray-500 to-slate-500',
      description: 'Прочие профессиональные услуги',
      count: 22,
    },
  ];

  const featuredServices = [
    {
      id: 1,
      title: 'VIP эскорт сопровождение',
      provider: 'Elite Agency',
      rating: 4.9,
      price: 15000,
      duration: '2 часа',
      verified: true,
      category: 'escort',
    },
    {
      id: 2,
      title: 'Релакс массаж',
      provider: 'Spa Center',
      rating: 4.8,
      price: 3500,
      duration: '1 час',
      verified: true,
      category: 'massage',
    },
    {
      id: 3,
      title: 'Приватный танец',
      provider: 'Dance Studio',
      rating: 4.7,
      price: 5000,
      duration: '30 минут',
      verified: false,
      category: 'entertainment',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Профессиональные услуги
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Качественные услуги от проверенных агентств и специалистов
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {serviceCategories.map(category => (
            <Card 
              key={category.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className={`h-32 bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <Icon name={category.icon as any} size={48} className="text-white" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>
                <Button variant="outline" className="w-full">
                  Смотреть услуги
                  <Icon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Рекомендуемые услуги</h2>
            <Button variant="ghost">
              Смотреть все
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map(service => (
              <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="h-56 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                  <Icon name="Briefcase" size={64} className="text-muted-foreground" />
                  {service.verified && (
                    <Badge className="absolute top-3 right-3 bg-blue-500 border-0">
                      <Icon name="CheckCircle" size={12} className="mr-1" />
                      Проверено
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg mb-2">{service.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{service.provider}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                      <Icon name="Star" size={14} className="text-yellow-500" />
                      <span className="text-sm font-semibold">{service.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      {service.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground block">от</span>
                      <span className="text-xl font-bold text-primary">{service.price.toLocaleString()} ₽</span>
                    </div>
                    <Button size="sm">Заказать</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Предоставляете услуги?</h3>
            <p className="text-muted-foreground mb-6">
              Зарегистрируйтесь как поставщик услуг и получите доступ к тысячам клиентов
            </p>
            <Button size="lg" className="gap-2">
              <Icon name="Plus" size={18} />
              Стать поставщиком
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
