import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Page, UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';

interface LoginPageProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
}

export const LoginPage = ({ setUserRole, setCurrentPage }: LoginPageProps) => {
  const { toast } = useToast();
  const [loginMethod, setLoginMethod] = useState<'email' | 'username'>('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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

    setTimeout(() => {
      const isSeller = loginValue.includes('seller') || loginValue.includes('девушк');
      const role: UserRole = isSeller ? 'seller' : 'buyer';
      
      setUserRole(role);
      setCurrentPage('home');
      
      toast({
        title: "Успешный вход!",
        description: `Добро пожаловать, ${isSeller ? 'девушка' : 'мужчина'}`,
      });
      
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border shadow-2xl animate-fade-in relative z-10">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <Icon name="LogIn" size={36} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl text-center text-primary">Вход</CardTitle>
          <CardDescription className="text-center text-lg">
            Войдите в свой аккаунт для продолжения
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
            className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-2xl hover:shadow-primary/50 text-base py-6 transition-all duration-300 hover:scale-105 font-semibold"
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

          <Button
            variant="outline"
            className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white text-base py-6 transition-all duration-300 hover:scale-105 font-semibold"
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