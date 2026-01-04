import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface AuthPageProps {
  onAuth: () => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referralCode: '',
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [businessType, setBusinessType] = useState<'organization' | 'individual'>('individual');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isAuthenticated', 'true');
    if (isBusinessMode) {
      localStorage.setItem('userRole', 'business');
      localStorage.setItem('businessType', businessType);
    }
    onAuth();
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetSent(false);
      setResetEmail('');
    }, 3000);
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-2xl border-0 animate-scale-in">
          <button
            onClick={() => setShowForgotPassword(false)}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
            Назад
          </button>

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Icon name="KeyRound" className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Восстановление пароля
            </h1>
            <p className="text-gray-500 text-sm text-center">
              Введите email для получения ссылки на восстановление
            </p>
          </div>

          {!resetSent ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="your@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                size="lg"
              >
                Отправить ссылку
              </Button>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center animate-fade-in">
              <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-3" />
              <p className="text-green-800 font-medium mb-1">
                Ссылка отправлена!
              </p>
              <p className="text-green-600 text-sm">
                Проверьте вашу почту {resetEmail}
              </p>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Не получили письмо? Проверьте папку "Спам"
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-all duration-500 bg-gradient-to-br from-pink-600 to-purple-600`}>
      {isBusinessMode && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/40 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      )}
      <Card className={`w-full max-w-md p-8 shadow-2xl border-0 animate-scale-in relative z-10 transition-all duration-500 ${isBusinessMode ? 'bg-white/90 dark:bg-gray-900/90 border-pink-200 dark:border-pink-900' : ''}`}>
        <div className="flex flex-col items-center mb-8 relative">
          <button
            onClick={() => setIsBusinessMode(!isBusinessMode)}
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-pink-500/50 mb-4 ${isBusinessMode ? 'ring-4 ring-pink-300/50 dark:ring-pink-700/50' : ''}`}
            aria-label="Toggle business mode"
          >
            {isBusinessMode ? (
              <span className="text-white text-4xl font-bold transition-transform duration-300 scale-110">₽</span>
            ) : (
              <Icon name="Heart" size={32} className="text-white transition-transform duration-300" />
            )}
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent uppercase">
            {isBusinessMode ? 'LOVE IS BUSINESS' : 'Love Is'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {isBusinessMode ? 'Управляйте своим бизнесом' : 'Найди свою вторую половинку'}
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <Icon name={showLoginPassword ? "EyeOff" : "Eye"} size={20} />
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Забыли пароль?
                </button>
              </div>

              <Button 
                type="submit" 
                className={`w-full h-11 transition-all duration-300 ${isBusinessMode ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:shadow-xl hover:shadow-pink-500/50' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'}`}
                size="lg"
              >
                Войти
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isBusinessMode && (
                <div className="space-y-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg border border-pink-200 dark:border-pink-800">
                  <Label className="text-sm font-semibold">Тип аккаунта</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBusinessType('individual')}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                        businessType === 'individual'
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
                      }`}
                    >
                      <Icon name="User" size={24} className={businessType === 'individual' ? 'text-pink-600' : 'text-gray-500'} />
                      <span className="text-sm font-medium">Частное лицо</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessType('organization')}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                        businessType === 'organization'
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
                      }`}
                    >
                      <Icon name="Building2" size={24} className={businessType === 'organization' ? 'text-pink-600' : 'text-gray-500'} />
                      <span className="text-sm font-medium">Организация</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reg-username">Имя пользователя</Label>
                <Input
                  id="reg-username"
                  type="text"
                  placeholder="Ваше имя"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Пароль</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showRegPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <Icon name={showRegPassword ? "EyeOff" : "Eye"} size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral" className="text-sm text-gray-500">
                  {isBusinessMode ? 'Реферальная ссылка или промокод (необязательно)' : 'Промокод или реферальный код (необязательно)'}
                </Label>
                <Input
                  id="referral"
                  type="text"
                  placeholder="Введите код"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                  className="h-11"
                />
              </div>

              <Button 
                type="submit" 
                className={`w-full h-11 transition-all duration-300 ${isBusinessMode ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:shadow-xl hover:shadow-pink-500/50' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'}`}
                size="lg"
              >
                Создать аккаунт
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">или</span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-11" 
            onClick={() => {
              if (isBusinessMode) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', 'business');
                localStorage.setItem('businessType', businessType);
                onAuth();
              } else {
                localStorage.setItem('isAuthenticated', 'true');
                onAuth();
              }
            }}
          >
            Войти как гость
          </Button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          Продолжая, вы соглашаетесь с условиями использования
        </div>
      </Card>
    </div>
  );
}