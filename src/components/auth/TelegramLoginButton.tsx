import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { telegramAuthApi } from '@/lib/api';
import { Page, UserRole } from '@/types';
import Icon from '@/components/ui/icon';

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
  const [showDomainHelp, setShowDomainHelp] = useState(false);

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

    console.log('🔧 Telegram Widget Debug:', {
      botUsername,
      currentDomain: window.location.hostname,
      currentOrigin: window.location.origin,
      protocol: window.location.protocol
    });

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    
    script.onerror = (error) => {
      console.error('❌ Telegram widget script failed to load:', error);
    };
    
    script.onload = () => {
      console.log('✅ Telegram widget script loaded successfully');
    };
    
    (window as any).onTelegramAuth = handleTelegramAuth;
    
    telegramWidgetRef.current.appendChild(script);
    scriptLoadedRef.current = true;

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, [botUsername]);

  const handleDirectBotLogin = () => {
    const botUrl = `https://t.me/${botUsername}?start=web_auth`;
    window.open(botUrl, '_blank');
    toast({
      title: "Откройте Telegram",
      description: "Подтвердите вход в боте и вернитесь на сайт",
    });
  };

  return (
    <div className="w-full space-y-3">
      <div ref={telegramWidgetRef} className={isLoading ? 'opacity-50 pointer-events-none' : ''} />
      
      {showDomainHelp && (
        <div className="text-xs bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 space-y-1">
          <p className="font-semibold text-yellow-800 dark:text-yellow-200">⚠️ Проблема с доменом</p>
          <p className="text-yellow-700 dark:text-yellow-300">
            Текущий домен: <code className="font-mono">{window.location.hostname}</code>
          </p>
          <p className="text-yellow-700 dark:text-yellow-300">
            Убедитесь, что этот домен добавлен в @BotFather → @{botUsername} → Bot Settings → Domain
          </p>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDirectBotLogin}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-lg transition-colors font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
          </svg>
          Войти через Telegram
        </button>
        
        <button
          type="button"
          onClick={() => setShowDomainHelp(!showDomainHelp)}
          className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Помощь"
        >
          <Icon name="HelpCircle" size={20} />
        </button>
      </div>
    </div>
  );
};