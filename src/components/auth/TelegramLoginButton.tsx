import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { telegramAuthApi } from '@/lib/api';
import { Page, UserRole } from '@/types';

interface TelegramLoginButtonProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
  botUsername?: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const TelegramLoginButton = ({ 
  setUserRole, 
  setCurrentPage, 
  botUsername = 'your_bot_username',
  isLoading,
  setIsLoading
}: TelegramLoginButtonProps) => {
  const { toast } = useToast();
  const telegramWidgetRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  const handleTelegramAuth = async (user: any) => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scriptLoadedRef.current || !telegramWidgetRef.current) return;

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
    
    telegramWidgetRef.current.appendChild(script);
    scriptLoadedRef.current = true;

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, [botUsername]);

  return (
    <div className="w-full flex justify-center">
      <div ref={telegramWidgetRef} className={isLoading ? 'opacity-50 pointer-events-none' : ''} />
    </div>
  );
};
