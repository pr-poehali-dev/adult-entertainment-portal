import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, Page } from '@/types';

interface LoginFormProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
  telegramWidgetRef: React.RefObject<HTMLDivElement>;
}

export const LoginForm = ({ setUserRole, setCurrentPage, telegramWidgetRef }: LoginFormProps) => {
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

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

  return (
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
  );
};
