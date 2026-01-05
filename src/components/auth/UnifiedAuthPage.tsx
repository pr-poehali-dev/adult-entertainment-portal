import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Page, UserRole } from '@/types';
import { telegramAuthApi } from '@/lib/api';

interface UnifiedAuthPageProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
}

type RegistrationMethod = 'email' | 'phone' | 'telegram';

export const UnifiedAuthPage = ({ setUserRole, setCurrentPage }: UnifiedAuthPageProps) => {
  const { toast } = useToast();
  const { login, register } = useAuth();
  const telegramWidgetRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [regUserType, setRegUserType] = useState<'buyer' | 'seller'>('buyer');
  const [regUsername, setRegUsername] = useState('');
  const [regMethod, setRegMethod] = useState<RegistrationMethod>('email');
  const [regContact, setRegContact] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regGender, setRegGender] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regBusinessType, setRegBusinessType] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const role: UserRole = userData.role === 'seller' ? 'seller' : 'buyer';
      setUserRole(role);
      setCurrentPage('home');
      
      toast({
        title: "Успешный вход",
        description: `Добро пожаловать!`,
      });
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Проверьте данные",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regUsername || !regContact || !regPassword) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }
    
    if (regUserType === 'buyer') {
      if (!regGender || !regAge) {
        toast({
          title: "Ошибка",
          description: "Заполните гендер и возраст",
          variant: "destructive",
        });
        return;
      }
      
      const ageNum = parseInt(regAge);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        toast({
          title: "Ошибка",
          description: "Возраст должен быть от 18 до 100 лет",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (!agreedToTerms) {
      toast({
        title: "Ошибка",
        description: "Необходимо принять пользовательское соглашение",
        variant: "destructive",
      });
      return;
    }
    
    if (regPassword.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен быть минимум 6 символов",
        variant: "destructive",
      });
      return;
    }
    
    setRegLoading(true);
    try {
      await register(
        regContact,
        regPassword,
        regUsername,
        regUserType,
        regUserType === 'seller' ? regBusinessType : undefined
      );
      
      setUserRole(regUserType);
      setCurrentPage('home');
      
      toast({
        title: "Регистрация завершена!",
        description: `Добро пожаловать, ${regUsername}!`,
      });
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Попробуйте позже",
        variant: "destructive",
      });
    } finally {
      setRegLoading(false);
    }
  };

  const getContactLabel = (): string => {
    switch (regMethod) {
      case 'email': return 'Email';
      case 'phone': return 'Номер телефона';
      case 'telegram': return 'Telegram логин';
    }
  };

  const getContactPlaceholder = (): string => {
    switch (regMethod) {
      case 'email': return 'your@email.com';
      case 'phone': return '+7 (999) 123-45-67';
      case 'telegram': return 'username';
    }
  };

  const handleTelegramAuth = async (user: any) => {
    setLoginLoading(true);
    try {
      const response = await telegramAuthApi.authenticate(user);
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      const role: UserRole = response.user.role === 'seller' ? 'seller' : 'buyer';
      setUserRole(role);
      setCurrentPage('home');
      
      toast({
        title: response.new_user ? "Добро пожаловать!" : "Вход выполнен!",
        description: response.new_user 
          ? `Аккаунт создан автоматически через Telegram` 
          : `Добро пожаловать, ${response.user.username}`,
      });
    } catch (error) {
      toast({
        title: "Ошибка авторизации",
        description: error instanceof Error ? error.message : "Не удалось войти через Telegram",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    if (telegramWidgetRef.current && activeTab === 'login' && !(window as any).TelegramLoginWidget) {
      const botUsername = 'lovender_bot'; // Замените на username вашего бота
      
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      script.setAttribute('data-telegram-login', botUsername);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '8');
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-userpic', 'false');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      
      (window as any).onTelegramAuth = handleTelegramAuth;
      (window as any).TelegramLoginWidget = true;
      
      telegramWidgetRef.current.appendChild(script);
    }

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 animate-scale-in">
        <CardHeader>
          <CardTitle className="text-3xl text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            LOVE IS
          </CardTitle>
          <CardDescription className="text-center text-base">
            Портал знакомств
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={loginLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Пароль</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={loginLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <Icon name={showLoginPassword ? 'EyeOff' : 'Eye'} size={20} />
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <span className="flex items-center gap-2">
                      <Icon name="Loader2" size={20} className="animate-spin" />
                      Входим...
                    </span>
                  ) : (
                    'Войти'
                  )}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">или</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div ref={telegramWidgetRef} />
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg mb-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Для тестирования создайте новый аккаунт</p>
                  <p className="text-xs text-muted-foreground">Пароль минимум 6 символов</p>
                </div>

                <div className="space-y-2">
                  <Label>Тип аккаунта</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={regUserType === 'buyer' ? 'default' : 'outline'}
                      onClick={() => setRegUserType('buyer')}
                      className="w-full"
                    >
                      Покупатель
                    </Button>
                    <Button
                      type="button"
                      variant={regUserType === 'seller' ? 'default' : 'outline'}
                      onClick={() => setRegUserType('seller')}
                      className="w-full"
                    >
                      Продавец
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-nickname">Никнейм</Label>
                  <Input
                    id="reg-nickname"
                    placeholder="Придумайте никнейм"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    disabled={regLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Способ регистрации</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={regMethod === 'email' ? 'default' : 'outline'}
                      onClick={() => { setRegMethod('email'); setRegContact(''); }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Icon name="Mail" size={14} />
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={regMethod === 'phone' ? 'default' : 'outline'}
                      onClick={() => { setRegMethod('phone'); setRegContact(''); }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Icon name="Phone" size={14} />
                      Телефон
                    </Button>
                    <Button
                      type="button"
                      variant={regMethod === 'telegram' ? 'default' : 'outline'}
                      onClick={() => { setRegMethod('telegram'); setRegContact(''); }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Icon name="MessageCircle" size={14} />
                      TG
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-contact">{getContactLabel()}</Label>
                  <Input
                    id="reg-contact"
                    type={regMethod === 'email' ? 'email' : regMethod === 'phone' ? 'tel' : 'text'}
                    placeholder={getContactPlaceholder()}
                    value={regContact}
                    onChange={(e) => setRegContact(e.target.value)}
                    disabled={regLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">Пароль</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      disabled={regLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <Icon name={showRegPassword ? 'EyeOff' : 'Eye'} size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Минимум 6 символов</p>
                </div>

                {regUserType === 'buyer' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="reg-gender">Гендер</Label>
                      <Select value={regGender} onValueChange={setRegGender}>
                        <SelectTrigger id="reg-gender">
                          <SelectValue placeholder="Выберите гендер" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Мужской</SelectItem>
                          <SelectItem value="female">Женский</SelectItem>
                          <SelectItem value="other">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-age">Возраст</Label>
                      <Input
                        id="reg-age"
                        type="number"
                        placeholder="18"
                        min="18"
                        max="100"
                        value={regAge}
                        onChange={(e) => setRegAge(e.target.value)}
                        disabled={regLoading}
                      />
                    </div>
                  </>
                )}

                {regUserType === 'seller' && (
                  <div className="space-y-2">
                    <Label htmlFor="reg-business">Категория услуг</Label>
                    <Select value={regBusinessType} onValueChange={setRegBusinessType}>
                      <SelectTrigger id="reg-business">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="premium">Премиум</SelectItem>
                        <SelectItem value="business">Бизнес</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    Я принимаю пользовательское соглашение и политику конфиденциальности
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  disabled={regLoading}
                >
                  {regLoading ? (
                    <span className="flex items-center gap-2">
                      <Icon name="Loader2" size={20} className="animate-spin" />
                      Регистрируем...
                    </span>
                  ) : (
                    'Зарегистрироваться'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};