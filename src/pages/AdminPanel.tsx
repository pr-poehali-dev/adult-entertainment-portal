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

  const [users] = useState<User[]>([
    { id: 1, name: 'Анна Смирнова', email: 'anna@mail.ru', role: 'seller', status: 'active', registeredAt: '2024-01-15', balance: 45000 },
    { id: 2, name: 'Иван Петров', email: 'ivan@mail.ru', role: 'buyer', status: 'active', registeredAt: '2024-02-20', balance: 12000 },
    { id: 3, name: 'Мария Иванова', email: 'maria@mail.ru', role: 'dating', status: 'blocked', registeredAt: '2024-03-10', balance: 0 },
  ]);

  const [services] = useState<Service[]>([
    { id: 1, title: 'Элитный массаж', seller: 'Анна Смирнова', price: 5000, status: 'active', reports: 0 },
    { id: 2, title: 'VIP сопровождение', seller: 'Виктория Смит', price: 15000, status: 'moderation', reports: 2 },
    { id: 3, title: 'Эротический массаж', seller: 'Елена Кузнецова', price: 3500, status: 'blocked', reports: 5 },
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
    toast({
      title: "Пользователь заблокирован",
      description: `Пользователь #${userId} был заблокирован`,
    });
  };

  const approveService = (serviceId: number) => {
    toast({
      title: "Услуга одобрена",
      description: `Услуга #${serviceId} прошла модерацию`,
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

        <Tabs defaultValue="balance" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="balance">
              <Icon name="Wallet" size={16} className="mr-2" />
              Баланс
            </TabsTrigger>
            <TabsTrigger value="users">
              <Icon name="Users" size={16} className="mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="services">
              <Icon name="Briefcase" size={16} className="mr-2" />
              Услуги
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <Icon name="CreditCard" size={16} className="mr-2" />
              Транзакции
            </TabsTrigger>
            <TabsTrigger value="security">
              <Icon name="Shield" size={16} className="mr-2" />
              Безопасность
            </TabsTrigger>
          </TabsList>

          <TabsContent value="balance" className="mt-6">
            <AdminBalanceTab
              platformBalances={platformBalances}
              balanceTransactions={balanceTransactions}
            />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AdminUsersTab users={users} blockUser={blockUser} />
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <AdminServicesTab services={services} approveService={approveService} />
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <AdminTransactionsTab transactions={transactions} />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Admin2FASettings
              is2FAEnabled={is2FAEnabled}
              on2FAToggle={handle2FAToggle}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;