import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';

interface AboutPageProps {
  setCurrentPage: (page: string) => void;
}

export const AboutPage = ({ setCurrentPage }: AboutPageProps) => {
  const features = [
    {
      icon: 'Shield',
      title: 'Безопасность',
      description: 'Надежная защита данных и безопасные платежи',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: 'Users',
      title: 'Проверенные пользователи',
      description: 'Система верификации и рейтингов',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: 'Zap',
      title: 'Быстрый отклик',
      description: 'Мгновенные уведомления и связь',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: 'Lock',
      title: 'Конфиденциальность',
      description: 'Полная анонимность и защита личных данных',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Пользователей' },
    { value: '5,000+', label: 'Объявлений' },
    { value: '50+', label: 'Городов' },
    { value: '4.8', label: 'Средний рейтинг' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            О платформе
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Мы создали современную платформу для безопасных и комфортных встреч. 
            Наша миссия — объединять людей и предоставлять качественные услуги.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Наши преимущества</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`h-24 bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                  <Icon name={feature.icon as any} size={48} className="text-white" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="mb-16 overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6">Как это работает?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Регистрация</h4>
                    <p className="text-sm text-muted-foreground">
                      Создайте аккаунт за 2 минуты
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Выбор</h4>
                    <p className="text-sm text-muted-foreground">
                      Найдите подходящее объявление или услугу
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Связь</h4>
                    <p className="text-sm text-muted-foreground">
                      Свяжитесь с продавцом через платформу
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Встреча</h4>
                    <p className="text-sm text-muted-foreground">
                      Безопасная встреча и оплата через платформу
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-12">
              <Icon name="Smartphone" size={200} className="text-primary/30" />
            </div>
          </div>
        </Card>

        <div className="text-center">
          <Card className="p-12 bg-gradient-to-r from-primary/10 to-secondary/10">
            <h2 className="text-3xl font-bold mb-6">Готовы начать?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам пользователей, которые уже нашли то, что искали
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => setCurrentPage('register')} className="gap-2">
                <Icon name="UserPlus" size={18} />
                Зарегистрироваться
              </Button>
              <Button size="lg" variant="outline" onClick={() => setCurrentPage('online-search')}>
                Смотреть объявления
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
