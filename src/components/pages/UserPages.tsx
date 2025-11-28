import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Page, Profile, CatalogItem, UserRole, WorkSchedule } from '@/types';
import { TipModal } from '@/components/TipModal';
import { VIPBadge } from '@/components/vip/VIPBadge';
import { HealthCertificateBadge } from '@/components/health/HealthCertificateBadge';
import { Wallet, Transaction } from '@/types';
import { ProfileWalletTab } from './profile/ProfileWalletTab';
import { ProfileSettingsTab } from './profile/ProfileSettingsTab';
import { ProfileBookingsTab } from './profile/ProfileBookingsTab';
import { ProfileMediaTab } from './profile/ProfileMediaTab';
import { FavoritesPage } from './favorites/FavoritesPage';
import { SearchPage } from './search/SearchPage';
import { RulesPage } from './rules/RulesPage';

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
  const [isVerified, setIsVerified] = useState(profile.verified);
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule>({ type: '24/7' });
  const [isActive, setIsActive] = useState(true);
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
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

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'deposit',
      amount: 50000,
      currency: 'RUB',
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      completedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      description: 'Пополнение счета RUB',
    },
    {
      id: 2,
      type: 'booking_payment',
      amount: 25000,
      currency: 'RUB',
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      description: 'Оплата встречи с Анастасия',
      relatedBookingId: 1,
      toUser: 'Анастасия',
    },
    {
      id: 3,
      type: 'booking_received',
      amount: 22500,
      currency: 'RUB',
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      description: 'Получение оплаты от Михаил',
      relatedBookingId: 2,
      fromUser: 'Михаил',
      fee: 2500,
    },
    {
      id: 4,
      type: 'withdraw',
      amount: 10000,
      currency: 'RUB',
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      description: 'Вывод средств на 1234 5678 9012 3456...',
    },
    {
      id: 5,
      type: 'vip_payment',
      amount: 999,
      currency: 'RUB',
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3600000).toISOString(),
      description: 'Оплата VIP статуса: 1 месяц',
    },
  ]);

  const handleShowTipModal = (booking: any) => {
    setSelectedBooking(booking);
    setShowTipModal(true);
  };

  const handleSendTip = (amount: number) => {
    console.log('Sending tip:', amount, 'to', selectedBooking?.sellerName);
  };

  const isVIP = profile.vipStatus === 'vip';
  const isVIPExpired = profile.vipExpiry ? new Date(profile.vipExpiry) < new Date() : true;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-3xl bg-primary/20 text-primary">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{profile.name}</h2>
                {isVIP && !isVIPExpired && <VIPBadge size="md" />}
                {profile.healthCertified && profile.healthCertificateExpiry && new Date(profile.healthCertificateExpiry) > new Date() && profile.role === 'seller' && (
                  <HealthCertificateBadge size="md" />
                )}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                {isVerified && (
                  <div className="flex items-center gap-1 text-primary">
                    <Icon name="CheckCircle" size={16} />
                    <span className="text-sm">Верифицирован</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={16} className="text-yellow-500" />
                  <span className="text-sm font-semibold">{profile.rating}</span>
                </div>
                {profile.role && (
                  <div className="flex items-center gap-1">
                    <Icon name={profile.role === 'seller' ? 'Briefcase' : 'ShoppingBag'} size={16} />
                    <span className="text-sm capitalize">{profile.role === 'seller' ? 'Продавец' : 'Покупатель'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="wallet" className="space-y-6">
        <TabsList className={`grid w-full ${profile.role === 'seller' ? 'grid-cols-5' : 'grid-cols-4'}`}>
          <TabsTrigger value="wallet">Кошелек</TabsTrigger>
          <TabsTrigger value="referral">Партнёрка</TabsTrigger>
          <TabsTrigger value="bookings">Бронирования</TabsTrigger>
          {profile.role === 'seller' && (
            <TabsTrigger value="media">Медиа</TabsTrigger>
          )}
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="wallet">
          <ProfileWalletTab
            wallet={wallet}
            setWallet={setWallet}
            transactions={transactions}
            setTransactions={setTransactions}
          />
        </TabsContent>

        <TabsContent value="referral">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Users" size={24} className="text-primary" />
                Партнёрская программа
              </CardTitle>
              <CardDescription>
                Приглашайте друзей и получайте до 10% с каждой их транзакции
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-1">47</div>
                    <p className="text-sm text-muted-foreground">Рефералов</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                    <div className="text-3xl font-bold text-green-500 mb-1">125,000 ₽</div>
                    <p className="text-sm text-muted-foreground">Заработано</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                    <div className="text-3xl font-bold text-blue-500 mb-1">10%</div>
                    <p className="text-sm text-muted-foreground">Макс. комиссия</p>
                  </div>
                </div>
                
                <div className="p-6 rounded-lg bg-muted/30 space-y-4">
                  <h4 className="font-semibold">Уровни комиссии</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-bold text-primary">1</span>
                        </div>
                        <div>
                          <p className="font-medium">1 линия</p>
                          <p className="text-sm text-muted-foreground">Прямые рефералы</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">10%</div>
                        <p className="text-xs text-muted-foreground">23 человека</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="font-bold text-blue-500">2</span>
                        </div>
                        <div>
                          <p className="font-medium">2 линия</p>
                          <p className="text-sm text-muted-foreground">Рефералы рефералов</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-500">5%</div>
                        <p className="text-xs text-muted-foreground">18 человек</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <span className="font-bold text-purple-500">3</span>
                        </div>
                        <div>
                          <p className="font-medium">3 линия</p>
                          <p className="text-sm text-muted-foreground">Третий уровень</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-500">1%</div>
                        <p className="text-xs text-muted-foreground">6 человек</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm font-medium mb-2">Ваша реферальная ссылка:</p>
                  <div className="flex gap-2">
                    <Input 
                      value="https://elite.app/ref/ELITE2024XYZ" 
                      readOnly 
                      className="flex-1 bg-card/80"
                    />
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText('https://elite.app/ref/ELITE2024XYZ');
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Icon name="Copy" size={16} className="mr-2" />
                      Копировать
                    </Button>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-primary/90"
                  onClick={() => window.location.href = '#referral'}
                >
                  <Icon name="ExternalLink" size={16} className="mr-2" />
                  Подробная статистика
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <ProfileBookingsTab onShowTipModal={handleShowTipModal} />
        </TabsContent>

        {profile.role === 'seller' && (
          <TabsContent value="media">
            <ProfileMediaTab profile={profile} onProfileUpdate={onProfileUpdate} />
          </TabsContent>
        )}

        <TabsContent value="settings">
          <ProfileSettingsTab
            profile={profile}
            isVerified={isVerified}
            setIsVerified={setIsVerified}
            workSchedule={workSchedule}
            setWorkSchedule={setWorkSchedule}
            isActive={isActive}
            setIsActive={setIsActive}
            onProfileUpdate={onProfileUpdate}
          />
        </TabsContent>
      </Tabs>

      <TipModal
        isOpen={showTipModal}
        onClose={() => setShowTipModal(false)}
        sellerName={selectedBooking?.sellerName || ''}
        onSendTip={handleSendTip}
      />
    </div>
  );
};

export { FavoritesPage, SearchPage, RulesPage };