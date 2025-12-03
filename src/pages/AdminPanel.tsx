import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminBalanceTab } from '@/components/admin/AdminBalanceTab';
import { AdminUsersTab } from '@/components/admin/AdminUsersTab';
import { AdminServicesTab } from '@/components/admin/AdminServicesTab';
import { AdminTransactionsTab } from '@/components/admin/AdminTransactionsTab';
import { AdminSellersTab } from '@/components/admin/AdminSellersTab';
import { AdminClientsTab } from '@/components/admin/AdminClientsTab';
import { AdminAdsManagement } from '@/components/admin/AdminAdsManagement';
import { AdminMessaging } from '@/components/admin/AdminMessaging';
import { AdminPricingSettings } from '@/components/admin/AdminPricingSettings';
import { AdminPasswordRecovery } from '@/components/admin/AdminPasswordRecovery';
import { Admin2FAVerification } from '@/components/admin/Admin2FAVerification';
import { Admin2FASettings } from '@/components/admin/Admin2FASettings';
import { getAdminCredentials, validateAdminLogin, getAdminEmail } from '@/utils/adminAuth';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'dating';
  status: 'active' | 'blocked';
  registeredAt: string;
  balance: number;
}

interface Service {
  id: number;
  title: string;
  seller: string;
  price: number;
  status: 'active' | 'moderation' | 'blocked';
  reports: number;
}

interface Transaction {
  id: number;
  user: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'commission' | 'vip' | 'platform_fee';
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface PlatformBalance {
  currency: 'RUB' | 'USD' | 'TON' | 'USDT';
  balance: number;
  symbol: string;
  icon: string;
  color: string;
}

interface BalanceTransaction {
  id: number;
  type: 'vip_purchase' | 'commission' | 'withdrawal';
  amount: number;
  currency: string;
  user: string;
  date: string;
  description: string;
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [showRecovery, setShowRecovery] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Анна Смирнова', email: 'anna@mail.ru', role: 'seller', status: 'active', registeredAt: '2024-01-15', balance: 45000 },
    { id: 2, name: 'Иван Петров', email: 'ivan@mail.ru', role: 'buyer', status: 'active', registeredAt: '2024-02-20', balance: 12000 },
    { id: 3, name: 'Мария Иванова', email: 'maria@mail.ru', role: 'dating', status: 'blocked', registeredAt: '2024-03-10', balance: 0 },
  ]);

  const [sellers, setSellers] = useState([
    { id: 1, name: 'Анна Смирнова', email: 'anna@mail.ru', balance: 45000, commission: 12500, status: 'active' as const, registeredAt: '2024-01-15', totalEarnings: 85000 },
    { id: 2, name: 'Виктория Смит', email: 'victoria@mail.ru', balance: 32000, commission: 8900, status: 'active' as const, registeredAt: '2024-02-10', totalEarnings: 62000 },
    { id: 3, name: 'Елена Кузнецова', email: 'elena@mail.ru', balance: 15000, commission: 4200, status: 'blocked' as const, registeredAt: '2024-03-05', totalEarnings: 28000 },
    { id: 4, name: 'Ольга Петрова', email: 'olga@mail.ru', balance: 58000, commission: 18500, status: 'active' as const, registeredAt: '2024-01-20', totalEarnings: 125000 },
  ]);

  const [clients, setClients] = useState([
    { id: 1, name: 'Анна Смирнова', email: 'anna@mail.ru', phone: '+7 (999) 123-45-67', role: 'seller' as const, balance: 45000, status: 'active' as const, registeredAt: '2024-01-15', lastActivity: '2024-12-04', totalSpent: 85000 },
    { id: 2, name: 'Иван Петров', email: 'ivan@mail.ru', phone: '+7 (999) 234-56-78', role: 'buyer' as const, balance: 12000, status: 'active' as const, registeredAt: '2024-02-20', lastActivity: '2024-12-03', totalSpent: 32000 },
    { id: 3, name: 'Мария Иванова', email: 'maria@mail.ru', phone: '+7 (999) 345-67-89', role: 'dating' as const, balance: 0, status: 'blocked' as const, registeredAt: '2024-03-10', lastActivity: '2024-11-15', totalSpent: 15000 },
    { id: 4, name: 'Виктория Смит', email: 'victoria@mail.ru', phone: '+7 (999) 456-78-90', role: 'seller' as const, balance: 32000, status: 'active' as const, registeredAt: '2024-02-10', lastActivity: '2024-12-04', totalSpent: 62000 },
    { id: 5, name: 'Дмитрий Козлов', email: 'dmitry@mail.ru', phone: '+7 (999) 567-89-01', role: 'buyer' as const, balance: 8500, status: 'active' as const, registeredAt: '2024-04-05', lastActivity: '2024-12-02', totalSpent: 28000 },
    { id: 6, name: 'Елена Кузнецова', email: 'elena@mail.ru', phone: '+7 (999) 678-90-12', role: 'seller' as const, balance: 15000, status: 'blocked' as const, registeredAt: '2024-03-05', lastActivity: '2024-11-20', totalSpent: 45000 },
    { id: 7, name: 'Алексей Новиков', email: 'alexey@mail.ru', phone: '+7 (999) 789-01-23', role: 'buyer' as const, balance: 25000, status: 'active' as const, registeredAt: '2024-05-12', lastActivity: '2024-12-04', totalSpent: 75000 },
    { id: 8, name: 'Ольга Петрова', email: 'olga@mail.ru', phone: '+7 (999) 890-12-34', role: 'seller' as const, balance: 58000, status: 'active' as const, registeredAt: '2024-01-20', lastActivity: '2024-12-04', totalSpent: 125000 },
  ]);

  const [services] = useState<Service[]>([
    { id: 1, title: 'Элитный массаж', seller: 'Анна Смирнова', price: 5000, status: 'active', reports: 0 },
    { id: 2, title: 'VIP сопровождение', seller: 'Виктория Смит', price: 15000, status: 'moderation', reports: 2 },
    { id: 3, title: 'Эротический массаж', seller: 'Елена Кузнецова', price: 3500, status: 'blocked', reports: 5 },
  ]);

  const [ads, setAds] = useState([
    { id: 1, title: 'Элитный массаж', category: 'massage', price: 5000, seller: 'Анна Смирнова', status: 'active' as const, createdAt: '2024-11-28' },
    { id: 2, title: 'VIP сопровождение', category: 'escort', price: 15000, seller: 'Виктория Смит', status: 'moderation' as const, createdAt: '2024-11-27' },
    { id: 3, title: 'Романтическое свидание', category: 'dating', price: 3500, seller: 'Мария Иванова', status: 'active' as const, createdAt: '2024-11-26' },
    { id: 4, title: 'Фитнес тренировки', category: 'fitness', price: 2500, seller: 'Ольга Петрова', status: 'active' as const, createdAt: '2024-11-25' },
  ]);

  const [adminMessages, setAdminMessages] = useState<Array<{
    id: number;
    userId: number;
    userName: string;
    message: string;
    timestamp: string;
    isFromAdmin: boolean;
  }>>([
    { id: 1, userId: 2, userName: 'Иван Петров', message: 'Добро пожаловать на платформу!', timestamp: '2024-11-28T10:00:00', isFromAdmin: true },
    { id: 2, userId: 3, userName: 'Мария Иванова', message: 'Ваш аккаунт временно заблокирован', timestamp: '2024-11-27T15:30:00', isFromAdmin: true },
  ]);

  const [transactions] = useState<Transaction[]>([
    { id: 1, user: 'Иван Петров', type: 'deposit', amount: 10000, currency: 'RUB', date: '2024-11-28', status: 'completed' },
    { id: 2, user: 'Анна Смирнова', type: 'withdrawal', amount: 25000, currency: 'RUB', date: '2024-11-27', status: 'pending' },
    { id: 3, user: 'Мария Иванова', type: 'payment', amount: 5000, currency: 'RUB', date: '2024-11-26', status: 'completed' },
  ]);

  const [stats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 2450000,
    pendingVerifications: 23,
    activeServices: 456,
    moderationQueue: 12,
    blockedUsers: 34,
    totalTransactions: 5678,
  });

  const [prices, setPrices] = useState({
    vipWeek: 500,
    vipMonth: 1500,
    vipYear: 12000,
    profileBoost: 200,
    top3Week: 1000,
    top3Month: 3500,
    highlightAd: 300,
    premiumSupport: 2000,
    verificationBadge: 1000,
  });

  const [platformBalances] = useState<PlatformBalance[]>([
    { currency: 'RUB', balance: 2450000, symbol: '₽', icon: 'Banknote', color: 'blue' },
    { currency: 'USD', balance: 15420, symbol: '$', icon: 'DollarSign', color: 'green' },
    { currency: 'TON', balance: 8950, symbol: 'TON', icon: 'Coins', color: 'cyan' },
    { currency: 'USDT', balance: 12300, symbol: 'USDT', icon: 'Wallet', color: 'emerald' },
  ]);

  const [balanceTransactions] = useState<BalanceTransaction[]>([
    { id: 1, type: 'vip_purchase', amount: 5000, currency: 'RUB', user: 'Анна Смирнова', date: '2024-11-28 14:30', description: 'Оплата VIP-статуса на 30 дней' },
    { id: 2, type: 'commission', amount: 1500, currency: 'RUB', user: 'Иван Петров → Мария', date: '2024-11-28 12:15', description: 'Комиссия 15% за сделку' },
    { id: 3, type: 'vip_purchase', amount: 150, currency: 'USD', user: 'John Smith', date: '2024-11-27 18:45', description: 'VIP subscription renewal' },
    { id: 4, type: 'commission', amount: 45, currency: 'TON', user: 'Елена → Дмитрий', date: '2024-11-27 16:20', description: 'Комиссия 10% за бронирование' },
    { id: 5, type: 'withdrawal', amount: -50000, currency: 'RUB', user: 'Администратор', date: '2024-11-26 10:00', description: 'Вывод средств на банковский счет' },
    { id: 6, type: 'vip_purchase', amount: 3500, currency: 'RUB', user: 'Ольга Петрова', date: '2024-11-26 09:30', description: 'Оплата VIP-статуса на 14 дней' },
    { id: 7, type: 'commission', amount: 250, currency: 'USDT', user: 'Alice → Bob', date: '2024-11-25 20:15', description: 'Platform fee 5%' },
  ]);

  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminSession');
    const saved2FA = sessionStorage.getItem('admin2FA');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
    }
    if (saved2FA === 'true') {
      setIs2FAEnabled(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateAdminLogin(loginForm.login, loginForm.password)) {
      if (is2FAEnabled) {
        setShow2FA(true);
      } else {
        setIsAuthenticated(true);
        sessionStorage.setItem('adminSession', 'true');
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать в админ-панель",
        });
      }
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный логин или пароль",
        variant: "destructive",
      });
    }
  };

  const handle2FAVerify = (code: string) => {
    if (code.length === 6) {
      setIsAuthenticated(true);
      setShow2FA(false);
      sessionStorage.setItem('adminSession', 'true');
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в админ-панель",
      });
    } else {
      toast({
        title: "Ошибка 2FA",
        description: "Неверный код подтверждения",
        variant: "destructive",
      });
    }
  };

  const handle2FAToggle = (enabled: boolean) => {
    setIs2FAEnabled(enabled);
    sessionStorage.setItem('admin2FA', enabled ? 'true' : 'false');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminSession');
    navigate('/');
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из админ-панели",
    });
  };

  const blockUser = (userId: number) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' } : u
    ));
    toast({
      title: "Статус изменен",
      description: `Пользователь #${userId} был ${users.find(u => u.id === userId)?.status === 'active' ? 'заблокирован' : 'разблокирован'}`,
    });
  };

  const blockSeller = (sellerId: number) => {
    setSellers(prev => prev.map(s => 
      s.id === sellerId ? { ...s, status: s.status === 'blocked' ? 'active' : 'blocked' } : s
    ));
    const seller = sellers.find(s => s.id === sellerId);
    toast({
      title: "Статус изменен",
      description: `${seller?.name} ${seller?.status === 'active' ? 'заблокирован' : 'разблокирован'}`,
    });
  };

  const updateSellerBalance = (sellerId: number, newBalance: number) => {
    setSellers(prev => prev.map(s => 
      s.id === sellerId ? { ...s, balance: newBalance } : s
    ));
  };

  const blockClient = (clientId: number) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, status: c.status === 'blocked' ? 'active' : 'blocked' } : c
    ));
    const client = clients.find(c => c.id === clientId);
    toast({
      title: "Статус изменен",
      description: `${client?.name} ${client?.status === 'active' ? 'заблокирован' : 'разблокирован'}`,
    });
  };

  const updateClientBalance = (clientId: number, newBalance: number) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, balance: newBalance } : c
    ));
  };

  const approveService = (serviceId: number) => {
    toast({
      title: "Услуга одобрена",
      description: `Услуга #${serviceId} прошла модерацию`,
    });
  };

  const createAd = (ad: Omit<typeof ads[0], 'id'>) => {
    const newAd = {
      ...ad,
      id: ads.length > 0 ? Math.max(...ads.map(a => a.id)) + 1 : 1,
    };
    setAds(prev => [...prev, newAd]);
  };

  const deleteAd = (adId: number) => {
    setAds(prev => prev.filter(a => a.id !== adId));
  };

  const sendMessageToUser = (userId: number, message: string) => {
    const user = clients.find(c => c.id === userId);
    if (!user) return;

    const newMessage = {
      id: adminMessages.length > 0 ? Math.max(...adminMessages.map(m => m.id)) + 1 : 1,
      userId,
      userName: user.name,
      message,
      timestamp: new Date().toISOString(),
      isFromAdmin: true,
    };
    
    setAdminMessages(prev => [...prev, newMessage]);
  };

  const updatePrices = (newPrices: typeof prices) => {
    setPrices(newPrices);
    toast({
      title: "Цены обновлены",
      description: "Новые цены на услуги вступили в силу",
    });
  };

  if (showRecovery) {
    return (
      <AdminPasswordRecovery
        onBack={() => setShowRecovery(false)}
        recoveryEmail={getAdminEmail()}
      />
    );
  }

  if (show2FA) {
    return (
      <Admin2FAVerification
        onVerify={handle2FAVerify}
        onBack={() => setShow2FA(false)}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        onForgotPassword={() => setShowRecovery(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Админ-панель</h1>
              <p className="text-sm text-muted-foreground">Управление платформой</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="Home" size={18} className="mr-2" />
              На сайт
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AdminStats stats={stats} />

        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="clients">
              <Icon name="Users" size={16} className="mr-2" />
              Клиенты
            </TabsTrigger>
            <TabsTrigger value="ads">
              <Icon name="Package" size={16} className="mr-2" />
              Объявления
            </TabsTrigger>
            <TabsTrigger value="messaging">
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Сообщения
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <Icon name="DollarSign" size={16} className="mr-2" />
              Цены
            </TabsTrigger>
            <TabsTrigger value="moderation">
              <Icon name="FileCheck" size={16} className="mr-2" />
              Модерация
            </TabsTrigger>
            <TabsTrigger value="finances">
              <Icon name="Wallet" size={16} className="mr-2" />
              Финансы
            </TabsTrigger>
            <TabsTrigger value="sellers">
              <Icon name="Store" size={16} className="mr-2" />
              Продавцы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">База клиентов</h2>
              <AdminClientsTab 
                clients={clients} 
                onBlockClient={blockClient}
                onUpdateBalance={updateClientBalance}
              />
            </div>
          </TabsContent>

          <TabsContent value="ads" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Управление объявлениями</h2>
              <AdminAdsManagement 
                ads={ads}
                onCreateAd={createAd}
                onDeleteAd={deleteAd}
              />
            </div>
          </TabsContent>

          <TabsContent value="messaging" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Сообщения клиентам</h2>
              <AdminMessaging 
                users={clients}
                messages={adminMessages}
                onSendMessage={sendMessageToUser}
              />
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <div className="space-y-6">
              <AdminPricingSettings 
                prices={prices}
                onUpdatePrices={updatePrices}
              />
            </div>
          </TabsContent>

          <TabsContent value="balance" className="mt-6">
            <AdminBalanceTab
              platformBalances={platformBalances}
              balanceTransactions={balanceTransactions}
            />
          </TabsContent>

          <TabsContent value="moderation" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Модерация</h2>
              <Tabs defaultValue="profiles" className="w-full">
                <TabsList>
                  <TabsTrigger value="profiles">Анкеты</TabsTrigger>
                  <TabsTrigger value="ads">Объявления</TabsTrigger>
                </TabsList>
                <TabsContent value="profiles" className="mt-4">
                  <AdminUsersTab users={users} blockUser={blockUser} />
                </TabsContent>
                <TabsContent value="ads" className="mt-4">
                  <AdminServicesTab services={services} approveService={approveService} />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="finances" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Финансы</h2>
              <AdminBalanceTab 
                platformBalances={platformBalances} 
                balanceTransactions={balanceTransactions} 
              />
              <AdminTransactionsTab transactions={transactions} />
            </div>
          </TabsContent>

          <TabsContent value="sellers" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Продавцы</h2>
              <AdminSellersTab 
                sellers={sellers} 
                onBlockSeller={blockSeller}
                onUpdateBalance={updateSellerBalance}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;