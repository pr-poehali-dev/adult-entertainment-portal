import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { telegramAuthApi } from '@/lib/api';
import { UserRole, Page } from '@/types';

interface TelegramAuthWidgetProps {
  telegramWidgetRef: React.RefObject<HTMLDivElement>;
  activeTab: 'login' | 'register';
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
  setLoginLoading: (loading: boolean) => void;
}

export const TelegramAuthWidget = ({ 
  telegramWidgetRef, 
  activeTab, 
  setUserRole, 
  setCurrentPage,
  setLoginLoading 
}: TelegramAuthWidgetProps) => {
  const { toast } = useToast();

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
      const botUsername = 'love_is_city_bot';
      
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

  return null;
};
