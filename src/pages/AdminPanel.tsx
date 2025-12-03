import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const ADMIN_CREDENTIALS = {
  login: 'admin',
  password: 'admin123'
};

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
  type: 'deposit' | 'withdrawal' | 'payment' | 'commission';
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
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

  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminSession');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginForm.login === ADMIN_CREDENTIALS.login && loginForm.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminSession', 'true');
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в админ-панель",
      });
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный логин или пароль",
        variant: "destructive",
      });
    }
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
              <Icon name="Shield" size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl">Админ-панель</CardTitle>
            <CardDescription>Введите учетные данные для входа</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">Логин</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="admin"
                  value={loginForm.login}
                  onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всего пользователей</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  <p className="text-xs text-green-600 mt-1">Активных: {stats.activeUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Общий доход</p>
                  <p className="text-3xl font-bold">{(stats.totalRevenue / 1000).toFixed(0)}К ₽</p>
                  <p className="text-xs text-green-600 mt-1">+12% за месяц</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={24} className="text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">На модерации</p>
                  <p className="text-3xl font-bold">{stats.moderationQueue}</p>
                  <p className="text-xs text-orange-600 mt-1">Требует внимания</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Icon name="AlertCircle" size={24} className="text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Транзакции</p>
                  <p className="text-3xl font-bold">{stats.totalTransactions}</p>
                  <p className="text-xs text-purple-600 mt-1">За весь период</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} className="text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
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
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
                <CardDescription>Список всех зарегистрированных пользователей</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant={user.role === 'seller' ? 'default' : user.role === 'buyer' ? 'secondary' : 'outline'}>
                            {user.role === 'seller' ? 'Продавец' : user.role === 'buyer' ? 'Покупатель' : 'Знакомства'}
                          </Badge>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Регистрация: {user.registeredAt}</span>
                          <span>Баланс: {user.balance} ₽</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Icon name="Eye" size={16} className="mr-2" />
                          Просмотр
                        </Button>
                        {user.status === 'active' ? (
                          <Button variant="destructive" size="sm" onClick={() => blockUser(user.id)}>
                            <Icon name="Ban" size={16} className="mr-2" />
                            Блокировать
                          </Button>
                        ) : (
                          <Button variant="default" size="sm">
                            <Icon name="Check" size={16} className="mr-2" />
                            Разблокировать
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Модерация услуг</CardTitle>
                <CardDescription>Список услуг требующих проверки</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{service.title}</h3>
                          <Badge variant={
                            service.status === 'active' ? 'default' : 
                            service.status === 'moderation' ? 'secondary' : 
                            'destructive'
                          }>
                            {service.status === 'active' ? 'Активна' : 
                             service.status === 'moderation' ? 'На модерации' : 
                             'Заблокирована'}
                          </Badge>
                          {service.reports > 0 && (
                            <Badge variant="destructive">{service.reports} жалоб</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Продавец: {service.seller}</p>
                        <p className="text-sm font-semibold mt-2">{service.price} ₽</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Icon name="Eye" size={16} className="mr-2" />
                          Просмотр
                        </Button>
                        {service.status === 'moderation' && (
                          <Button variant="default" size="sm" onClick={() => approveService(service.id)}>
                            <Icon name="Check" size={16} className="mr-2" />
                            Одобрить
                          </Button>
                        )}
                        <Button variant="destructive" size="sm">
                          <Icon name="X" size={16} className="mr-2" />
                          Отклонить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>История транзакций</CardTitle>
                <CardDescription>Все финансовые операции платформы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{tx.user}</h3>
                          <Badge variant={
                            tx.type === 'deposit' ? 'default' :
                            tx.type === 'withdrawal' ? 'secondary' :
                            tx.type === 'payment' ? 'outline' :
                            'destructive'
                          }>
                            {tx.type === 'deposit' ? 'Пополнение' :
                             tx.type === 'withdrawal' ? 'Вывод' :
                             tx.type === 'payment' ? 'Оплата' :
                             'Комиссия'}
                          </Badge>
                          <Badge variant={
                            tx.status === 'completed' ? 'default' :
                            tx.status === 'pending' ? 'secondary' :
                            'destructive'
                          }>
                            {tx.status === 'completed' ? 'Завершена' :
                             tx.status === 'pending' ? 'В обработке' :
                             'Ошибка'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{tx.date}</span>
                          <span className="font-semibold text-foreground">{tx.amount} {tx.currency}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Icon name="FileText" size={16} className="mr-2" />
                        Детали
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
