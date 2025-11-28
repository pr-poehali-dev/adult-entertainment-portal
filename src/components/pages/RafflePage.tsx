import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { QuickRegistration } from './QuickRegistration';

interface RafflePageProps {
  setCurrentPage: (page: Page) => void;
}

interface Winner {
  id: number;
  name: string;
  date: string;
  prize: string;
  amount: number;
}

export const RafflePage = ({ setCurrentPage }: RafflePageProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isParticipating, setIsParticipating] = useState(false);
  const [showQuickReg, setShowQuickReg] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [userLogin, setUserLogin] = useState<string | null>(null);

  const winners: Winner[] = [
    { id: 1, name: 'Дмитрий К.', date: '22 ноября 2024', prize: 'iPhone 17 Pro Max (1TB)', amount: 150000 },
    { id: 2, name: 'Александр М.', date: '15 ноября 2024', prize: 'iPhone 17 (256GB)', amount: 120000 },
    { id: 3, name: 'Сергей П.', date: '8 ноября 2024', prize: 'iPhone 17 Plus (512GB)', amount: 135000 },
    { id: 4, name: 'Михаил В.', date: '1 ноября 2024', prize: 'iPhone 17 (256GB)', amount: 120000 },
    { id: 5, name: 'Артём Н.', date: '25 октября 2024', prize: 'iPhone 17 Pro (512GB)', amount: 140000 },
  ];

  const handleBuyTicket = () => {
    if (!userLogin) {
      toast({
        title: 'Нужна регистрация',
        description: 'Сначала зарегистрируйтесь, чтобы купить билет',
        variant: 'destructive',
      });
      return;
    }

    if (!isVip) {
      toast({
        title: 'Нужен VIP статус',
        description: 'Для участия в розыгрыше требуется VIP статус',
        variant: 'destructive',
      });
      return;
    }

    if (!email || !phone) {
      toast({
        title: 'Заполните все поля',
        description: 'Укажите email и телефон для покупки билета',
        variant: 'destructive',
      });
      return;
    }

    setIsParticipating(true);
    toast({
      title: `Билет куплен! 🎉`,
      description: `Вы купили 1 билет за 100 ₽. Розыгрыш в воскресенье в 12:00 МСК. Уведомление придёт на email.`,
      duration: 6000,
    });
  };

  const handleRegisterSuccess = (credentials: { login: string; password: string }) => {
    setUserLogin(credentials.login);
    setShowQuickReg(false);
    toast({
      title: 'Добро пожаловать! 👋',
      description: `Вы вошли как ${credentials.login}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setCurrentPage('home')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>

        <div className="text-center space-y-6 mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Smartphone" size={48} className="text-primary animate-bounce" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="gold-shimmer">Еженедельный розыгрыш</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Купите билет за 100 ₽ и выигрывайте новенький iPhone 17 каждое воскресенье
          </p>

          {userLogin && (
            <div className="flex items-center justify-center gap-3">
              <Badge variant="outline" className="px-4 py-2 text-base">
                <Icon name="User" size={16} className="mr-2" />
                {userLogin}
              </Badge>
              {isVip && (
                <Badge className="px-4 py-2 text-base bg-gradient-to-r from-yellow-500 to-amber-600">
                  <Icon name="Crown" size={16} className="mr-2" />
                  VIP
                </Badge>
              )}
            </div>
          )}
        </div>

        {showQuickReg && (
          <QuickRegistration
            onRegisterSuccess={handleRegisterSuccess}
            onCancel={() => setShowQuickReg(false)}
          />
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 border-none shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Icon name="Gift" size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Текущий розыгрыш</h2>
                  <p className="text-white/80">Неделя #24</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Дата розыгрыша</span>
                  <span className="text-white font-bold text-lg">Воскресенье, 12:00 МСК</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Приз</span>
                  <span className="text-white font-bold text-lg">iPhone 17 (256GB)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Стоимость билета</span>
                  <span className="text-white font-bold text-lg">100 ₽</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Билетов продано</span>
                  <span className="text-white font-bold text-lg">47 шт</span>
                </div>
                <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-3 border border-red-400/30">
                  <div className="flex items-center gap-2">
                    <Icon name="Zap" size={16} className="text-yellow-300 animate-pulse" />
                    <span className="text-white/90 text-sm font-semibold">
                      Меньше 100 участников — быстрый розыгрыш через 60 секунд!
                    </span>
                  </div>
                </div>
              </div>

              {!isParticipating ? (
                <div className="space-y-4">
                  {!userLogin ? (
                    <div className="bg-blue-500/20 backdrop-blur-sm border-2 border-blue-400/50 rounded-xl p-6 text-center">
                      <Icon name="UserPlus" size={48} className="text-white mx-auto mb-3" />
                      <p className="text-white font-bold text-lg mb-2">Сначала зарегистрируйтесь</p>
                      <p className="text-white/80 text-sm mb-4">
                        Это займёт всего 10 секунд
                      </p>
                      <Button
                        onClick={() => setShowQuickReg(true)}
                        className="bg-white text-primary hover:bg-white/90 font-bold"
                      >
                        <Icon name="Zap" size={20} className="mr-2" />
                        Быстрая регистрация
                      </Button>
                    </div>
                  ) : !isVip ? (
                    <div className="bg-amber-500/20 backdrop-blur-sm border-2 border-amber-400/50 rounded-xl p-6 text-center">
                      <Icon name="Crown" size={48} className="text-amber-400 mx-auto mb-3" />
                      <p className="text-white font-bold text-lg mb-2">Требуется VIP статус</p>
                      <p className="text-white/80 text-sm mb-4">
                        В розыгрыше участвуют только VIP-пользователи с купленным билетом
                      </p>
                      <Button
                        onClick={() => {
                          setIsVip(true);
                          toast({
                            title: 'VIP активирован! 👑',
                            description: 'Теперь вы можете покупать билеты',
                          });
                        }}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold"
                      >
                        <Icon name="Crown" size={20} className="mr-2" />
                        Получить VIP за 500 ₽
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-white text-sm mb-2 block">Email для уведомлений</label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm mb-2 block">Телефон</label>
                        <Input
                          type="tel"
                          placeholder="+7 (___) ___-__-__"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-12 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="bg-yellow-500/20 backdrop-blur-sm border-2 border-yellow-400/50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Icon name="Info" size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-white font-semibold text-sm mb-1">Правила</p>
                            <p className="text-white/90 text-xs">
                              Один аккаунт = один билет. Участвуют только VIP с купленным билетом.
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handleBuyTicket}
                        className="w-full h-14 bg-white text-primary hover:bg-white/90 font-bold text-lg"
                      >
                        <Icon name="Ticket" size={20} className="mr-2" />
                        Купить билет за 100 ₽
                      </Button>
                      <p className="text-white/70 text-xs text-center">
                        Нажимая кнопку, вы соглашаетесь с правилами розыгрыша
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-green-500/20 backdrop-blur-sm border-2 border-green-400/50 rounded-xl p-6 text-center">
                  <Icon name="CheckCircle2" size={48} className="text-green-400 mx-auto mb-3" />
                  <p className="text-white font-bold text-xl mb-2">Билет куплен!</p>
                  <p className="text-white/80 text-sm">
                    Вы купили 1 билет за 100 ₽. Розыгрыш в воскресенье в 12:00 МСК!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Icon name="Info" size={24} className="text-primary" />
                  Как это работает?
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Быстрая регистрация</h4>
                    <p className="text-sm text-muted-foreground">
                      Зарегистрируйтесь за 1 клик. Мы создадим логин и пароль автоматически
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Получите VIP статус</h4>
                    <p className="text-sm text-muted-foreground">
                      Только VIP-пользователи участвуют в розыгрыше. VIP за 500 ₽
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Купите билет</h4>
                    <p className="text-sm text-muted-foreground">
                      Один аккаунт = один билет за 100 ₽. Это гарантирует честный розыгрыш
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">4</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Розыгрыш</h4>
                    <p className="text-sm text-muted-foreground">
                      Если участников {"<"}100 — розыгрыш через 60 секунд. Иначе — в воскресенье в 12:00 МСК
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">5</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Победитель получает приз</h4>
                    <p className="text-sm text-muted-foreground">
                      Новенький iPhone 17 с доставкой в любой город России
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Icon name="Shield" size={24} className="text-primary" />
                  Гарантии честности
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle2" size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Прозрачность:</span> Розыгрыш проводится в прямом эфире
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle2" size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Один билет на аккаунт:</span> Равные шансы для всех
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle2" size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Только VIP:</span> Участвуют только VIP с купленным билетом
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle2" size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Быстрый розыгрыш:</span> {"<"}100 участников = розыгрыш через 60 секунд
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <Icon name="Crown" size={32} className="inline mr-2 text-primary" />
            Предыдущие победители
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winners.map((winner) => (
              <Card key={winner.id} className="hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{winner.name}</h3>
                      <p className="text-sm text-muted-foreground">{winner.date}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      <Icon name="Trophy" size={14} className="mr-1" />
                      Победитель
                    </Badge>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Приз:</p>
                    <p className="font-semibold mb-2">{winner.prize}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {winner.amount.toLocaleString('ru-RU')}
                      </span>
                      <span className="text-lg text-muted-foreground">₽</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-gradient-to-r from-muted/50 to-muted/30 border-2 border-border">
          <CardContent className="pt-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Icon name="Sparkles" size={48} className="mx-auto text-primary" />
              <h2 className="text-3xl font-bold">Увеличьте свои шансы!</h2>
              <p className="text-muted-foreground leading-relaxed">
                Приглашайте друзей по реферальной ссылке и получайте дополнительные билеты в розыгрыш. 
                За каждого приглашенного друга вы получаете +1 шанс на победу!
              </p>
              <Button
                onClick={() => setCurrentPage('referral')}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl"
              >
                <Icon name="Users" size={20} className="mr-2" />
                Пригласить друзей
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};