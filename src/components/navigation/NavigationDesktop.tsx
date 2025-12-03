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
}

export const NavigationDesktop = ({
  setCurrentPage,
  userRole,
  setUserRole,
  profile,
  notifications,
  setNotifications,
  showNotifications,
  setShowNotifications,
  isDarkTheme,
  setIsDarkTheme,
  soundEnabled,
  setSoundEnabled,
  balanceAnimation,
  rubBalance,
  rubInBtc,
  showProfileMenu,
  setShowProfileMenu,
}: NavigationDesktopProps) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      <div className="hidden md:flex items-center space-x-8">
        <button onClick={() => setCurrentPage('home')} className="text-foreground font-medium hover:text-primary transition-colors tracking-wide">
          {t.nav.home}
        </button>
        <button onClick={() => setCurrentPage('catalog')} className="text-foreground font-medium hover:text-primary transition-colors tracking-wide">
          {t.nav.catalog}
        </button>
        <button onClick={() => setCurrentPage('online-search')} className="text-foreground font-medium hover:text-primary transition-colors tracking-wide flex items-center gap-1">
          <Icon name="Radio" size={16} />
          Онлайн
        </button>
        <button onClick={() => setCurrentPage('work')} className="text-foreground font-medium hover:text-primary transition-colors tracking-wide">
          Работа
        </button>
        <button onClick={() => setCurrentPage('referral')} className="text-foreground font-medium hover:text-primary transition-colors tracking-wide flex items-center gap-1">
          <Icon name="Users" size={16} />
          Партнёрка
        </button>
        {userRole && (
          <>
            <button onClick={() => setCurrentPage('favorites')} className="text-foreground font-medium hover:text-primary transition-colors tracking-wide">
              {t.nav.favorites}
            </button>
            <button 
              onClick={() => setCurrentPage('messages')} 
              className="text-foreground font-medium hover:text-primary transition-colors relative tracking-wide"
            >
              {t.nav.messages}
              {notifications.filter(n => !n.read && n.type === 'message').length > 0 && (
                <span className="absolute -top-1 -right-2 w-5 h-5 bg-gradient-to-r from-secondary to-secondary/90 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  {notifications.filter(n => !n.read && n.type === 'message').length}
                </span>
              )}
            </button>
          </>
        )}
        <button onClick={() => setCurrentPage('rules')} className="text-foreground font-medium hover:text-primary transition-colors tracking-wide">
          {t.nav.rules}
        </button>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {userRole && (
          <>
            <Button
              onClick={() => setCurrentPage('wallet')}
              className={`bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-6 py-6 shadow-lg hover:shadow-xl transition-all ${balanceAnimation ? 'animate-pulse scale-110' : ''}`}
              size="lg"
            >
              <Icon name="Wallet" size={24} className={`mr-3 ${balanceAnimation ? 'animate-bounce' : ''}`} />
              <div className="flex flex-col items-start">
                <span className={`text-lg leading-none ${balanceAnimation ? 'animate-pulse' : ''}`}>
                  {rubBalance.toLocaleString('ru-RU')} ₽
                </span>
                <span className="text-xs text-white/80 mt-1">
                  {rubInBtc.toFixed(6)} ₿
                </span>
              </div>
            </Button>
            
            <div className="relative">
              <div 
                className="flex items-center gap-3 px-3 py-1.5 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium leading-none">{profile.name}</span>
                <Icon name="ChevronDown" size={16} />
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setCurrentPage('profile');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Icon name="User" size={16} />
                    <span>Профиль</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setUserRole(null);
                      setCurrentPage('home');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 text-red-500"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Выйти</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        <div className="flex items-center gap-1 border border-border rounded-lg p-1">
          <Button
            variant={language === 'ru' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setLanguage('ru')}
            className="h-8 w-8 p-0 text-xl"
            title="Русский"
          >
            🇷🇺
          </Button>
          <Button
            variant={language === 'en' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setLanguage('en')}
            className="h-8 w-8 p-0 text-xl"
            title="English"
          >
            🇬🇧
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className="text-foreground/80 hover:text-primary"
        >
          {isDarkTheme ? <Icon name="Sun" size={20} /> : <Icon name="Moon" size={20} />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-foreground/80 hover:text-primary"
          title={soundEnabled ? "Выключить звук" : "Включить звук"}
        >
          <Icon name={soundEnabled ? "Volume2" : "VolumeX"} size={20} />
        </Button>
        {userRole && (
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </Button>

            {showNotifications && (
              <NotificationPanel
                notifications={notifications}
                setNotifications={setNotifications}
                setCurrentPage={setCurrentPage}
                setShowNotifications={setShowNotifications}
              />
            )}
          </div>
        )}
        
        {userRole ? (
          <Button variant="ghost" onClick={() => setCurrentPage('profile')}>
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback className="bg-primary text-primary-foreground">{profile.name[0]}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">{t.nav.profile}</span>
          </Button>
        ) : (
          <Button onClick={() => setCurrentPage('register')} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {t.nav.login}
          </Button>
        )}
      </div>
    </>
  );
};
