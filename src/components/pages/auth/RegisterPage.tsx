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
const EMAIL_VERIFY_URL = 'https://functions.poehali.dev/b28004ac-e099-490f-9a6b-e46f494fdc84';

interface RegisterPageProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
  setIsAuthenticated: (value: boolean) => void;
}

export const RegisterPage = ({ setUserRole, setCurrentPage, setIsAuthenticated }: RegisterPageProps) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleTelegramLogin = (userData: any) => {
    console.log('Telegram registration:', userData);
    
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
    
    setIsAuthenticated(true);
    setUserRole('buyer');
    setCurrentPage('home');
  };

  const handleSendCode = async (e: React.FormEvent) => {
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
      const response = await fetch(EMAIL_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_code',
          email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCodeSent(true);
        setStep('verify');
      } else {
        setError(data.error || 'Ошибка отправки кода');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!verificationCode) {
      setError('Введите код');
      setIsLoading(false);
      return;
    }

    try {
      const verifyResponse = await fetch(EMAIL_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_code',
          code: verificationCode
        })
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setError(verifyData.error || 'Неверный код');
        setIsLoading(false);
        return;
      }

      const registerResponse = await fetch(AUTH_URL, {
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

      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        localStorage.clear();
        
        localStorage.setItem('access_token', registerData.access_token);
        localStorage.setItem('refresh_token', registerData.refresh_token);
        localStorage.setItem('user', JSON.stringify(registerData.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        const userProfile = {
          name: registerData.user.username || username,
          nickname: registerData.user.username || username,
          role: registerData.user.role || role,
          avatar: '',
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
            telegram: { value: '', forSale: false },
            phone: { value: '', forSale: false },
          }
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        setIsAuthenticated(true);
        setUserRole(registerData.user.role as UserRole);
        setCurrentPage('home');
      } else {
        setError(registerData.error || 'Ошибка регистрации');
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
              <div className="space-y-4">
                {step === 'form' ? (
                  <form onSubmit={handleSendCode} className="space-y-4">
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
                        {isLoading ? 'Отправка...' : 'Получить код'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                    <div className="text-center space-y-2 mb-4">
                      <Icon name="Mail" size={48} className="mx-auto text-primary" />
                      <h3 className="font-semibold">Проверьте почту</h3>
                      <p className="text-sm text-muted-foreground">
                        Код отправлен на {email}
                      </p>
                    </div>
                    
                    {error && (
                      <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="code">Код подтверждения</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        disabled={isLoading}
                        maxLength={6}
                        className="text-center text-2xl tracking-widest"
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        Код действителен 10 минут
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setStep('form')}
                        disabled={isLoading}
                      >
                        Назад
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? 'Проверка...' : 'Подтвердить'}
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={async () => {
                        setError('');
                        setIsLoading(true);
                        try {
                          const response = await fetch(EMAIL_VERIFY_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'send_code', email })
                          });
                          if (response.ok) {
                            setError('');
                          }
                        } catch (err) {
                          setError('Ошибка отправки');
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      disabled={isLoading}
                    >
                      Отправить код повторно
                    </Button>
                  </form>
                )}
              </div>
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