import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Page, Profile, CatalogItem, UserRole, WorkSchedule, VIPPlan } from '@/types';
import { VerificationModal } from '@/components/VerificationModal';
import { WorkScheduleManager } from '@/components/WorkScheduleManager';
import { TipModal } from '@/components/TipModal';
import { VIPStatus } from '@/components/vip/VIPStatus';
import { VIPBadge } from '@/components/vip/VIPBadge';
import { VIPUpgradeModal } from '@/components/vip/VIPUpgradeModal';
import { WalletCard } from '@/components/wallet/WalletCard';
import { DepositModal } from '@/components/wallet/DepositModal';
import { WithdrawModal } from '@/components/wallet/WithdrawModal';
import { Wallet, Currency } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface UserPagesProps {
  setCurrentPage: (page: Page) => void;
  setUserRole: (role: UserRole) => void;
  profile: Profile;
  catalogItems: CatalogItem[];
  favorites: number[];
  toggleFavorite: (id: number) => void;
  setSelectedServiceId: (id: number | null) => void;
  onProfileUpdate?: (updatedProfile: Partial<Profile>) => void;
}

export const RegisterPage = ({ setUserRole, setCurrentPage }: { setUserRole: (role: UserRole) => void; setCurrentPage: (page: Page) => void }) => (
  <div className="container mx-auto px-4 py-16 max-w-2xl animate-fade-in">
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-4xl text-center text-primary">Регистрация</CardTitle>
        <CardDescription className="text-center text-lg">Выберите тип аккаунта для продолжения</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buyer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buyer">Покупатель</TabsTrigger>
            <TabsTrigger value="seller">Продавец</TabsTrigger>
          </TabsList>
          <TabsContent value="buyer" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="buyer-name">Имя</Label>
              <Input id="buyer-name" placeholder="Введите ваше имя" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyer-email">Email</Label>
              <Input id="buyer-email" type="email" placeholder="your@email.com" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyer-password">Пароль</Label>
              <Input id="buyer-password" type="password" placeholder="••••••••" className="bg-background border-border" />
            </div>
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
              onClick={() => {
                setUserRole('buyer');
                setCurrentPage('home');
              }}
            >
              Зарегистрироваться как покупатель
            </Button>
          </TabsContent>
          <TabsContent value="seller" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="seller-name">Имя</Label>
              <Input id="seller-name" placeholder="Введите ваше имя" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seller-email">Email</Label>
              <Input id="seller-email" type="email" placeholder="your@email.com" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seller-password">Пароль</Label>
              <Input id="seller-password" type="password" placeholder="••••••••" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seller-category">Категория услуг</Label>
              <Select>
                <SelectTrigger id="seller-category" className="bg-background border-border">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="premium">Премиум</SelectItem>
                  <SelectItem value="business">Бизнес</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
              onClick={() => {
                setUserRole('seller');
                setCurrentPage('home');
              }}
            >
              Зарегистрироваться как продавец
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
);

export const ProfilePage = ({ profile, onProfileUpdate }: { profile: Profile; onProfileUpdate?: (updatedProfile: Partial<Profile>) => void }) => {
  const { toast } = useToast();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isVerified, setIsVerified] = useState(profile.verified);
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule>({ type: '24/7' });
  const [isActive, setIsActive] = useState(true);
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  
  const [wallet, setWallet] = useState<Wallet>({
    balances: [
      { currency: 'RUB', amount: 50000, symbol: '₽' },
      { currency: 'USD', amount: 1200, symbol: '$' },
      { currency: 'EUR', amount: 800, symbol: '€' },
      { currency: 'BTC', amount: 0.05, symbol: 'BTC' },
      { currency: 'ETH', amount: 2.5, symbol: 'ETH' },
      { currency: 'USDT', amount: 5000, symbol: 'USDT' },
    ]
  });

  const handleVIPPurchase = (plan: VIPPlan) => {
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + plan.duration);
    
    const vipUpdate = {
      vipStatus: 'vip' as const,
      vipExpiry: newExpiry.toISOString(),
    };
    
    if (onProfileUpdate) {
      onProfileUpdate(vipUpdate);
    }
    
    toast({
      title: "VIP статус активирован!",
      description: `Ваш VIP статус действует до ${newExpiry.toLocaleDateString()}`,
    });
  };

  const handleDeposit = (currency: Currency, amount: number) => {
    setWallet(prev => ({
      balances: prev.balances.map(b => 
        b.currency === currency 
          ? { ...b, amount: b.amount + amount }
          : b
      )
    }));
  };

  const handleWithdraw = (currency: Currency, amount: number, address: string) => {
    setWallet(prev => ({
      balances: prev.balances.map(b => 
        b.currency === currency 
          ? { ...b, amount: b.amount - amount }
          : b
      )
    }));
  };

  const openDepositModal = (currency: Currency) => {
    setSelectedCurrency(currency);
    setShowDepositModal(true);
  };

  const openWithdrawModal = (currency: Currency) => {
    setSelectedCurrency(currency);
    setShowWithdrawModal(true);
  };

  const mockBookings = [
    {
      id: 1,
      serviceName: 'VIP сопровождение',
      sellerName: 'Анастасия',
      date: '2024-12-15',
      time: '19:00',
      status: 'completed',
      price: 25000,
    },
    {
      id: 2,
      serviceName: 'Бизнес-встреча',
      sellerName: 'Виктория',
      date: '2024-12-10',
      time: '14:00',
      status: 'completed',
      price: 30000,
    },
  ];

  return (
  <div className="container mx-auto px-4 py-8 animate-fade-in">
    <h1 className="text-5xl font-bold mb-8 text-primary">Профиль</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 bg-card border-border">
        <CardHeader>
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                {profile.name[0]}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl text-center mb-2 flex items-center gap-2 justify-center">
              {profile.name}
              {profile.vipStatus === 'vip' && <VIPBadge size="sm" showText={false} />}
            </CardTitle>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Star" size={20} className="text-primary fill-primary" />
              <span className="text-xl font-semibold">{profile.rating}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              {isVerified ? (
                <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-amber-500 shadow-lg">
                  <Icon name="ShieldCheck" size={16} className="mr-1" />
                  Верифицирован
                </Badge>
              ) : (
                <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
                  <Icon name="Shield" size={16} className="mr-1" />
                  Не верифицирован
                </Badge>
              )}
              {profile.vipStatus === 'vip' && <VIPBadge size="md" />}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isVerified && (
              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-500/20">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon name="Star" size={20} className="text-amber-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Пройдите верификацию</p>
                      <p className="text-muted-foreground text-xs">
                        Получите приоритет в поиске и больше доверия клиентов
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                    onClick={() => setShowVerificationModal(true)}
                  >
                    <Icon name="ShieldCheck" className="mr-2" size={18} />
                    Верифицировать профиль
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {profile.vipStatus === 'none' ? (
              <Button 
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-bold"
                onClick={() => setShowVIPModal(true)}
              >
                <Icon name="Crown" className="mr-2 fill-current" size={18} />
                Улучшить до VIP
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-500/10"
                onClick={() => setShowVIPModal(true)}
              >
                <Icon name="Crown" className="mr-2 fill-current" size={18} />
                Продлить VIP
              </Button>
            )}
            
            <Button variant="outline" className="w-full border-border">
              <Icon name="Settings" className="mr-2" size={18} />
              Настройки
            </Button>
            <Button variant="outline" className="w-full border-border text-red-500 hover:text-red-600">
              <Icon name="LogOut" className="mr-2" size={18} />
              Выход
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <VIPStatus status={profile.vipStatus} expiry={profile.vipExpiry} />
        
        <WalletCard 
          wallet={wallet}
          onDeposit={openDepositModal}
          onWithdraw={openWithdrawModal}
        />
        
        {profile.role === 'seller' && (
          <WorkScheduleManager
            workSchedule={workSchedule}
            isActive={isActive}
            onScheduleChange={setWorkSchedule}
            onActiveChange={setIsActive}
          />
        )}
        
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-3xl">Мои бронирования</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.role === 'buyer' && mockBookings.length > 0 ? (
              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <Card key={booking.id} className="bg-muted/30 border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{booking.serviceName}</h4>
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                              Завершено
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Icon name="User" size={14} />
                              {booking.sellerName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              {new Date(booking.date).toLocaleDateString('ru-RU')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Clock" size={14} />
                              {booking.time}
                            </span>
                          </div>
                          <div className="text-base font-semibold text-primary">
                            {booking.price.toLocaleString('ru-RU')} ₽
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowTipModal(true);
                          }}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                        >
                          <Icon name="Heart" className="mr-2" size={16} />
                          Чаевые
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Calendar" size={64} className="mx-auto mb-4 opacity-50" />
                <p>У вас пока нет бронирований</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    <VerificationModal 
      isOpen={showVerificationModal}
      onClose={() => setShowVerificationModal(false)}
      onVerify={() => setIsVerified(true)}
    />
    {selectedBooking && (
      <TipModal
        isOpen={showTipModal}
        onClose={() => {
          setShowTipModal(false);
          setSelectedBooking(null);
        }}
        sellerName={selectedBooking.sellerName}
        serviceName={selectedBooking.serviceName}
        bookingId={selectedBooking.id}
      />
    )}
    <VIPUpgradeModal
      isOpen={showVIPModal}
      onClose={() => setShowVIPModal(false)}
      currentVipExpiry={profile.vipExpiry}
      onPurchase={handleVIPPurchase}
    />
    <DepositModal
      isOpen={showDepositModal}
      onClose={() => {
        setShowDepositModal(false);
        setSelectedCurrency(null);
      }}
      currency={selectedCurrency}
      onDeposit={handleDeposit}
    />
    <WithdrawModal
      isOpen={showWithdrawModal}
      onClose={() => {
        setShowWithdrawModal(false);
        setSelectedCurrency(null);
      }}
      currency={selectedCurrency}
      balance={selectedCurrency ? wallet.balances.find(b => b.currency === selectedCurrency) || null : null}
      onWithdraw={handleWithdraw}
    />
  </div>
  );
};

export const SearchPage = () => (
  <div className="container mx-auto px-4 py-8 animate-fade-in">
    <h1 className="text-5xl font-bold mb-8 text-primary">Поиск</h1>
    <div className="max-w-2xl mx-auto">
      <Input 
        placeholder="Поиск услуг, категорий, исполнителей..." 
        className="text-lg py-6 bg-background border-border mb-8"
      />
      <div className="text-center text-muted-foreground">
        <Icon name="Search" size={64} className="mx-auto mb-4 opacity-50" />
        <p>Начните вводить запрос для поиска</p>
      </div>
    </div>
  </div>
);

export const FavoritesPage = ({ catalogItems, favorites, toggleFavorite, setSelectedServiceId, setCurrentPage }: UserPagesProps) => (
  <div className="container mx-auto px-4 py-8 animate-fade-in">
    <h1 className="text-5xl font-bold mb-8 text-primary">Избранное</h1>
    {favorites.length === 0 ? (
      <Card className="bg-card border-border p-12">
        <div className="text-center space-y-4">
          <Icon name="Heart" size={64} className="mx-auto text-muted-foreground" />
          <h3 className="text-2xl font-semibold">Избранное пусто</h3>
          <p className="text-muted-foreground">Добавьте услуги в избранное для быстрого доступа</p>
          <Button onClick={() => setCurrentPage('catalog')}>
            Перейти в каталог
          </Button>
        </div>
      </Card>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogItems.filter(item => favorites.includes(item.id)).map((item) => (
          <Card key={item.id} className="group hover:scale-105 transition-all duration-300 bg-card border-border">
            <CardHeader>
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                <Icon name="Image" size={64} className="text-muted-foreground" />
                <button 
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                >
                  <Icon 
                    name="Heart"
                    size={20} 
                    className="fill-red-500 text-red-500"
                  />
                </button>
              </div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <CardDescription>{item.seller}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{item.price}</span>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => { setSelectedServiceId(item.id); setCurrentPage('service'); }}
                >
                  Подробнее
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

export const RulesPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
    <h1 className="text-5xl font-bold mb-8 text-primary">Правила платформы</h1>
    <Card className="bg-card border-border">
      <CardContent className="prose prose-invert max-w-none pt-6 space-y-6">
        <section>
          <h2 className="text-3xl font-semibold text-primary mb-4">1. Общие положения</h2>
          <p className="text-foreground/80 leading-relaxed">
            Платформа Magic предоставляет услуги по организации встреч между взрослыми людьми. 
            Все пользователи должны быть совершеннолетними и соблюдать законодательство своей страны.
          </p>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-3xl font-semibold text-primary mb-4">2. Безопасность и конфиденциальность</h2>
          <ul className="space-y-2 text-foreground/80">
            <li>• Все данные пользователей защищены и хранятся конфиденциально</li>
            <li>• Запрещено разглашение личной информации третьим лицам</li>
            <li>• Платформа использует современные методы шифрования</li>
            <li>• Верификация профилей обязательна для продавцов</li>
          </ul>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-3xl font-semibold text-primary mb-4">3. Правила для продавцов</h2>
          <ul className="space-y-2 text-foreground/80">
            <li>• Честное описание услуг и актуальные фотографии</li>
            <li>• Соблюдение договоренностей с клиентами</li>
            <li>• Профессиональное поведение и уважение к клиентам</li>
            <li>• Своевременная оплата комиссии платформы</li>
          </ul>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-3xl font-semibold text-primary mb-4">4. Правила для покупателей</h2>
          <ul className="space-y-2 text-foreground/80">
            <li>• Уважительное отношение к исполнителям услуг</li>
            <li>• Своевременная оплата согласованных услуг</li>
            <li>• Соблюдение оговоренных условий встречи</li>
            <li>• Запрет на домогательства и неэтичное поведение</li>
          </ul>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-3xl font-semibold text-primary mb-4">5. Запрещенные действия</h2>
          <ul className="space-y-2 text-foreground/80">
            <li>• Мошенничество и обман</li>
            <li>• Насилие и угрозы</li>
            <li>• Распространение незаконного контента</li>
            <li>• Попытки обойти систему оплаты платформы</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  </div>
);