import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Page, Profile, Notification, UserRole, Wallet } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/i18n/translations';
import { NotificationPanel } from './NotificationPanel';

interface NavigationDesktopProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  profile: Profile;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  isDarkTheme: boolean;
  setIsDarkTheme: (isDark: boolean) => void;
  wallet: Wallet;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  balanceAnimation: boolean;
  rubBalance: number;
  rubInBtc: number;
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  isSecondRow?: boolean;
}

export const NavigationDesktop = ({
  setCurrentPage,
  userRole,
  profile,
  notifications,
  wallet,
  balanceAnimation,
  rubBalance,
  rubInBtc,
}: NavigationDesktopProps) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
        <button onClick={() => setCurrentPage('home')} className="text-foreground font-medium hover:text-primary transition-colors text-sm">
          {t.nav.home}
        </button>
        <button onClick={() => setCurrentPage('catalog')} className="text-foreground font-medium hover:text-primary transition-colors text-sm">
          {t.nav.catalog}
        </button>
        <button onClick={() => setCurrentPage('online-search')} className="text-foreground font-medium hover:text-primary transition-colors flex items-center gap-1.5 text-sm">
          <Icon name="Radio" size={14} />
          Онлайн
        </button>
        <button onClick={() => setCurrentPage('work')} className="text-foreground font-medium hover:text-primary transition-colors text-sm">
          Работа
        </button>
        {!profile.isAgencyOwner && (
          <button onClick={() => setCurrentPage('agency-register')} className="text-foreground font-medium hover:text-primary transition-colors flex items-center gap-1.5 text-sm">
            <Icon name="Building2" size={14} />
            Открыть Агентство
          </button>
        )}
        <button onClick={() => setCurrentPage('referral')} className="text-foreground font-medium hover:text-primary transition-colors flex items-center gap-1.5 text-sm">
          <Icon name="Users" size={14} />
          Партнёрка
        </button>
        {userRole && (
          <>
            <button onClick={() => setCurrentPage('favorites')} className="text-foreground font-medium hover:text-primary transition-colors text-sm">
              {t.nav.favorites}
            </button>
            <button 
              onClick={() => setCurrentPage('messages')} 
              className="text-foreground font-medium hover:text-primary transition-colors relative text-sm"
            >
              {t.nav.messages}
              {notifications.filter(n => !n.read && n.type === 'message').length > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notifications.filter(n => !n.read && n.type === 'message').length}
                </span>
              )}
            </button>
          </>
        )}
        <button onClick={() => setCurrentPage('rules')} className="text-foreground font-medium hover:text-primary transition-colors text-sm">
          {t.nav.rules}
        </button>
      </div>

      <div className="hidden md:flex items-center gap-3">
        {userRole && (
          <>
            <Button
              onClick={() => setCurrentPage('wallet')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
              size="sm"
            >
              <Icon name="Heart" size={16} className="mr-1.5" />
              <span className="text-sm leading-none">
                {(wallet.balances.find(b => b.currency === 'LOVE')?.amount || 0).toLocaleString('ru-RU')} 💗
              </span>
            </Button>
            
            <Button
              onClick={() => setCurrentPage('wallet')}
              className={`bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all ${balanceAnimation ? 'animate-pulse scale-110' : ''}`}
              size="sm"
            >
              <Icon name="Wallet" size={18} className={`mr-2 ${balanceAnimation ? 'animate-bounce' : ''}`} />
              <div className="flex flex-col items-start">
                <span className={`text-sm font-bold leading-none ${balanceAnimation ? 'animate-pulse' : ''}`}>
                  {rubBalance.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-white/90 mt-0.5">
                  {rubInBtc.toFixed(6)} ₿
                </span>
              </div>
            </Button>
          </>
        )}
      </div>
    </>
  );
};