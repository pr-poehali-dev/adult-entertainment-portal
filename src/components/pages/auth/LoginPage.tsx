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

export const LoginPage = ({ setUserRole, setCurrentPage, setIsAuthenticated }: LoginPageProps) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleTelegramLogin = (userData: any) => {
    console.log('Telegram login:', userData);
    setIsAuthenticated(true);
    setUserRole('buyer');
    setCurrentPage('home');
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }

    setIsAuthenticated(true);
    setUserRole('buyer');
    setCurrentPage('home');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resetEmail) {
      setError('Введите email');
      return;
    }

    setSuccessMessage('Ссылка для восстановления пароля отправлена на ' + resetEmail);
    setTimeout(() => {
      setShowForgotPassword(false);
      setShowEmailForm(false);
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md">
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
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowEmailForm(false)}
                      >
                        Назад
                      </Button>
                      <Button type="submit" className="flex-1">
                        Войти
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
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowForgotPassword(false)}
                      >
                        Назад
                      </Button>
                      <Button type="submit" className="flex-1">
                        Отправить
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