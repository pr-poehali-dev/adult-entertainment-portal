import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Page, UserRole } from '@/types';
import { TelegramLoginButton } from '@/components/extensions/telegram-auth/TelegramLoginButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface LoginPageProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
  setIsAuthenticated: (value: boolean) => void;
}

const AUTH_URL = 'https://functions.poehali.dev/174bbb92-9c03-4c5c-811f-7e5ce4beb2e3';

export const LoginPage = ({ setUserRole, setCurrentPage, setIsAuthenticated }: LoginPageProps) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTelegramLogin = (userData: any) => {
    console.log('Telegram login:', userData);
    
    localStorage.clear();
    
    const userProfile = {
      name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
      nickname: userData.username || `user${userData.id}`,
      role: 'buyer',
      avatar: userData.photo_url || '',
      rating: 0,
      verified: false,
      vipStatus: 'none',
      vipExpiry: null,
      subscriptionType: 'free',
      subscriptionExpiry: null,
      profileCompleted: false,
      kycCompleted: false,
      contacts: {
        instagram: { value: '', forSale: false },
        telegram: { value: userData.username || '', forSale: false },
        phone: { value: '', forSale: false },
      }
    };
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Триггерим событие для обновления состояния в Index
    window.dispatchEvent(new Event('authChange'));
    
    setIsAuthenticated(true);
    setUserRole('buyer');
    
    // Перенаправляем на главную
    window.location.href = '/';
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Заполните все поля');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.clear();
        
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        const userProfile = {
          name: data.user.name || '',
          nickname: data.user.nickname || data.user.email?.split('@')[0] || '',
          role: data.user.role || 'buyer',
          avatar: data.user.avatar || '',
          rating: data.user.rating || 0,
          verified: data.user.verified || false,
          vipStatus: 'none',
          vipExpiry: null,
          subscriptionType: 'free',
          subscriptionExpiry: null,
          profileCompleted: data.user.profileCompleted || false,
          kycCompleted: data.user.kycCompleted || false,
          contacts: {
            instagram: { value: '', forSale: false },
            telegram: { value: '', forSale: false },
            phone: { value: '', forSale: false },
          }
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        // Триггерим событие для обновления состояния в Index
        window.dispatchEvent(new Event('authChange'));
        
        setIsAuthenticated(true);
        setUserRole(data.user.role as UserRole);
        
        // Перенаправляем на главную
        window.location.href = '/';
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!resetEmail) {
      setError('Введите email');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'forgot_password',
          email: resetEmail
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Ссылка для восстановления пароля отправлена на ' + resetEmail);
        setTimeout(() => {
          setShowForgotPassword(false);
          setShowEmailForm(false);
          setSuccessMessage('');
        }, 3000);
      } else {
        setError(data.error || 'Ошибка отправки');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(https://cdn.poehali.dev/files/love-is-sayt.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Полупрозрачный оверлей для читаемости */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-md relative z-10">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <Icon name="LogIn" size={32} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Вход</CardTitle>
            <CardDescription>
              Войдите в аккаунт для продолжения
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Telegram авторизация */}
            <div className="space-y-3">
              <TelegramLoginButton 
                onAuth={handleTelegramLogin}
                buttonSize="large"
                requestAccess="write"
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">или</span>
                </div>
              </div>
            </div>

            {/* Email вход */}
            {!showEmailForm ? (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowEmailForm(true)}
              >
                <Icon name="Mail" size={18} className="mr-2" />
                Войти через Email
              </Button>
            ) : (
              <div className="space-y-4">
                {!showForgotPassword ? (
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    {successMessage && (
                      <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                        {successMessage}
                      </div>
                    )}
                    {error && (
                      <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="mail@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Пароль</Label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                        >
                          Забыли пароль?
                        </button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowEmailForm(false)}
                        disabled={isLoading}
                      >
                        Назад
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? 'Вход...' : 'Войти'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="text-center space-y-2 mb-4">
                      <h3 className="font-semibold">Восстановление пароля</h3>
                      <p className="text-sm text-muted-foreground">
                        Введите email для получения ссылки восстановления
                      </p>
                    </div>
                    {error && (
                      <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="mail@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowForgotPassword(false)}
                        disabled={isLoading}
                      >
                        Назад
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? 'Отправка...' : 'Отправить'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Разделитель */}
            <div className="pt-4 text-center text-sm text-muted-foreground">
              Нет аккаунта?{' '}
              <button
                onClick={() => setCurrentPage('register')}
                className="text-primary hover:underline font-medium"
              >
                Зарегистрироваться
              </button>
            </div>


          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;