import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Page, UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { useAuth } from '@/contexts/AuthContext';
import { TelegramLoginButton } from '@/components/auth/TelegramLoginButton';

interface LoginPageProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
}

export const LoginPage = ({ setUserRole, setCurrentPage }: LoginPageProps) => {
  const { toast } = useToast();
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'email' | 'username'>('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isBusinessMode, setIsBusinessMode] = useState(false);

  const handleLogin = async () => {
    const loginValue = loginMethod === 'email' ? email : username;
    
    if (!loginValue || !password) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await login(loginValue, password);
      
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const role: UserRole = userData.role === 'seller' ? 'seller' : 'buyer';
      setUserRole(role);
      setCurrentPage('home');
      
      toast({
        title: "Успешный вход!",
        description: `Добро пожаловать, ${userData.username}`,
      });
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Проверьте данные и попробуйте снова",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-16 transition-all duration-500 ${isBusinessMode ? 'bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-pink-950/20' : 'bg-gradient-to-br from-background via-muted/30 to-background'}`}>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {isBusinessMode ? (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/40 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </>
        )}
      </div>

      <Card className={`w-full max-w-md backdrop-blur-sm shadow-2xl animate-fade-in relative z-10 transition-all duration-500 ${isBusinessMode ? 'bg-white/90 dark:bg-gray-900/90 border-pink-200 dark:border-pink-900' : 'bg-card/80 border-border'}`}>
        <CardHeader className="space-y-4">
          <div className="flex justify-center relative">
            <button
              onClick={() => setIsBusinessMode(!isBusinessMode)}
              className={`absolute -top-2 -right-2 w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-pink-500/50 z-10 ${isBusinessMode ? 'animate-pulse ring-4 ring-pink-300/50 dark:ring-pink-700/50' : ''}`}
              aria-label="Toggle business mode"
            >
              <Icon name="Heart" size={24} className={`text-white transition-transform duration-300 ${isBusinessMode ? 'scale-110' : ''}`} />
            </button>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${isBusinessMode ? 'bg-gradient-to-br from-pink-500 to-purple-600' : 'bg-gradient-to-br from-primary to-primary/60'}`}>
              <Icon name="LogIn" size={36} className="text-white" />
            </div>
          </div>
          <CardTitle 
            className={`text-4xl text-center ${!isBusinessMode ? 'text-primary' : ''}`}
            style={isBusinessMode ? { 
              background: 'linear-gradient(to right, #ec4899, #a855f7)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            } : {}}
          >
            {isBusinessMode ? 'LOVE IS BUSINESS' : 'Вход'}
          </CardTitle>
          <CardDescription className="text-center text-lg">
            {isBusinessMode ? 'Войдите для управления своим бизнесом' : 'Войдите в свой аккаунт для продолжения'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <Button
              variant={loginMethod === 'email' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setLoginMethod('email')}
              disabled={isLoading}
            >
              <Icon name="Mail" size={16} className="mr-2" />
              Email
            </Button>
            <Button
              variant={loginMethod === 'username' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setLoginMethod('username')}
              disabled={isLoading}
            >
              <Icon name="User" size={16} className="mr-2" />
              Логин
            </Button>
          </div>

          {loginMethod === 'email' ? (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-border h-12"
                disabled={isLoading}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-border h-12"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Пароль</Label>
              <Button
                variant="link"
                className="text-xs text-primary hover:text-primary/80 p-0 h-auto"
                onClick={() => setShowForgotPassword(true)}
                disabled={isLoading}
              >
                Забыли пароль?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-background border-border h-12"
              disabled={isLoading}
            />
          </div>

          <Button
            className={`w-full text-white hover:shadow-2xl text-base py-6 transition-all duration-300 hover:scale-105 font-semibold ${isBusinessMode ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-pink-500/50' : 'bg-gradient-to-r from-primary to-primary/90 hover:shadow-primary/50'}`}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Icon name="Loader2" size={20} className="animate-spin" />
                Входим...
              </span>
            ) : (
              'Войти'
            )}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">или</span>
            </div>
          </div>

          <TelegramLoginButton
            setUserRole={setUserRole}
            setCurrentPage={setCurrentPage}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">нет аккаунта?</span>
            </div>
          </div>

          <Button
            variant="outline"
            className={`w-full border-2 text-base py-6 transition-all duration-300 hover:scale-105 font-semibold ${isBusinessMode ? 'border-pink-500 text-pink-600 hover:bg-pink-500 dark:text-pink-400 dark:border-pink-600 dark:hover:bg-pink-600 hover:text-white' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
            onClick={() => setCurrentPage('register')}
            disabled={isLoading}
          >
            Зарегистрироваться
          </Button>

          <div className="text-center pt-4">
            <Button
              variant="link"
              className="text-muted-foreground hover:text-primary"
              onClick={() => setCurrentPage('home')}
            >
              ← Вернуться на главную
            </Button>
          </div>
        </CardContent>
      </Card>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};