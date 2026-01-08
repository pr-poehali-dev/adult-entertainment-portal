import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Page, UserRole } from '@/types';
import { TelegramLoginButton } from '@/components/extensions/telegram-auth/TelegramLoginButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AUTH_URL = 'https://functions.poehali.dev/174bbb92-9c03-4c5c-811f-7e5ce4beb2e3';

interface RegisterPageProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
  setIsAuthenticated: (value: boolean) => void;
}

export const RegisterPage = ({ setUserRole, setCurrentPage, setIsAuthenticated }: RegisterPageProps) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTelegramLogin = (userData: any) => {
    console.log('Telegram registration:', userData);
    setIsAuthenticated(true);
    setUserRole('buyer');
    setCurrentPage('home');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password || !confirmPassword || !username) {
      setError('Заполните все поля');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email,
          password,
          username,
          role
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        setIsAuthenticated(true);
        setUserRole(data.user.role as UserRole);
        setCurrentPage('home');
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <Icon name="UserPlus" size={32} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Регистрация</CardTitle>
            <CardDescription>
              Создайте аккаунт для начала работы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Telegram регистрация */}
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

            {/* Email регистрация */}
            {!showEmailForm ? (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowEmailForm(true)}
              >
                <Icon name="Mail" size={18} className="mr-2" />
                Зарегистрироваться через Email
              </Button>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Иван Иванов"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Тип аккаунта</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Покупатель</SelectItem>
                      <SelectItem value="seller">Продавец</SelectItem>
                      <SelectItem value="business">Агентство</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Минимум 6 символов"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
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
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                  </Button>
                </div>
              </form>
            )}

            {/* Информация */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <Icon name="Shield" size={16} className="mt-0.5 text-primary flex-shrink-0" />
                <span>Конфиденциальность и безопасность гарантированы</span>
              </p>
              <p className="flex items-start gap-2">
                <Icon name="Lock" size={16} className="mt-0.5 text-primary flex-shrink-0" />
                <span>Верификация для защиты пользователей</span>
              </p>
            </div>

            {/* Разделитель */}
            <div className="pt-4 text-center text-sm text-muted-foreground">
              Уже есть аккаунт?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-primary hover:underline font-medium"
              >
                Войти
              </button>
            </div>


          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;