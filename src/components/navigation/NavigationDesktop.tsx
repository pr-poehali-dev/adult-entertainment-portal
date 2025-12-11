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
  setUserRole,
  profile,
  notifications,
  setNotifications,
  showNotifications,
  setShowNotifications,
  isDarkTheme,
  setIsDarkTheme,
  wallet,
  soundEnabled,
  setSoundEnabled,
  balanceAnimation,
  rubBalance,
  rubInBtc,
  showProfileMenu,
  setShowProfileMenu,
  isSecondRow = false,
}: NavigationDesktopProps) => {
  const { language, setLanguage, t } = useLanguage();

  if (isSecondRow) {
    return (
      <div className="flex items-center space-x-3 justify-center text-xs">
        <button onClick={() => setCurrentPage('home')} className="text-foreground font-medium hover:text-primary transition-colors">
          {t.nav.home}
        </button>
        <button onClick={() => setCurrentPage('catalog')} className="text-foreground font-medium hover:text-primary transition-colors">
          {t.nav.catalog}
        </button>
        <button onClick={() => setCurrentPage('online-search')} className="text-foreground font-medium hover:text-primary transition-colors flex items-center gap-1">
          <Icon name="Radio" size={12} />
          Онлайн
        </button>
        <button onClick={() => setCurrentPage('work')} className="text-foreground font-medium hover:text-primary transition-colors">
          Работа
        </button>
        {userRole && (
          <>
            <button onClick={() => setCurrentPage('favorites')} className="text-foreground font-medium hover:text-primary transition-colors">
              {t.nav.favorites}
            </button>
            <button 
              onClick={() => setCurrentPage('messages')} 
              className="text-foreground font-medium hover:text-primary transition-colors relative"
            >
              {t.nav.messages}
              {notifications.filter(n => !n.read && n.type === 'message').length > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-gradient-to-r from-secondary to-secondary/90 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {notifications.filter(n => !n.read && n.type === 'message').length}
                </span>
              )}
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <>

      <div className="hidden md:flex items-center space-x-1.5">
        {userRole && (
          <>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setCurrentPage('wallet')}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-2 py-1.5 shadow-lg hover:shadow-xl transition-all"
                size="sm"
              >
                <Icon name="Heart" size={14} className="mr-1" />
                <span className="text-xs leading-none">
                  {(wallet.balances.find(b => b.currency === 'LOVE')?.amount || 0).toLocaleString('ru-RU')} 💗
                </span>
              </Button>
              
              <Button
                onClick={() => setCurrentPage('wallet')}
                className={`bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-2 py-1.5 shadow-lg hover:shadow-xl transition-all ${balanceAnimation ? 'animate-pulse scale-110' : ''}`}
                size="sm"
              >
                <Icon name="Wallet" size={16} className={`mr-1.5 ${balanceAnimation ? 'animate-bounce' : ''}`} />
                <div className="flex flex-col items-start">
                  <span className={`text-xs leading-none ${balanceAnimation ? 'animate-pulse' : ''}`}>
                    {rubBalance.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-[9px] text-white/80 mt-0.5">
                    {rubInBtc.toFixed(6)} ₿
                  </span>
                </div>
              </Button>
            </div>
            
            <div className="relative">
              <div 
                className="flex items-center gap-1.5 px-1.5 py-1 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-medium">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[11px] font-medium leading-none">{profile.name}</span>
                <Icon name="ChevronDown" size={12} />
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
                    <span>Мой профиль</span>
                  </button>
                  
                  {profile.isAgencyOwner ? (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setCurrentPage('agency-dashboard');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 border-t border-border"
                    >
                      <Icon name="Building2" size={16} className="text-primary" />
                      <span className="font-medium">Моё Агентство</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setCurrentPage('agency-register');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 border-t border-border"
                    >
                      <Icon name="Building2" size={16} />
                      <span>Открыть Агентство</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setCurrentPage('referral');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 border-t border-border"
                  >
                    <Icon name="Users" size={16} />
                    <span>Партнёрка</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setUserRole(null);
                      setCurrentPage('home');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 text-red-500 border-t border-border"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Выйти</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        <div className="flex items-center gap-0.5 border border-border rounded-lg p-0.5">
          <Button
            variant={language === 'ru' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setLanguage('ru')}
            className="h-5 w-5 p-0 text-xs"
            title="Русский"
          >
            🇷🇺
          </Button>
          <Button
            variant={language === 'en' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setLanguage('en')}
            className="h-5 w-5 p-0 text-xs"
            title="English"
          >
            🇬🇧
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className="text-foreground/80 hover:text-primary h-7 w-7"
        >
          {isDarkTheme ? <Icon name="Sun" size={14} /> : <Icon name="Moon" size={14} />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-foreground/80 hover:text-primary h-7 w-7"
          title={soundEnabled ? "Выключить звук" : "Включить звук"}
        >
          <Icon name={soundEnabled ? "Volume2" : "VolumeX"} size={14} />
        </Button>
        {userRole && (
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-7 w-7"
            >
              <Icon name="Bell" size={14} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">
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
          <Button variant="ghost" onClick={() => setCurrentPage('profile')} className="h-7 px-2">
            <Avatar className="h-5 w-5 mr-1.5">
              <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">{profile.name[0]}</AvatarFallback>
            </Avatar>
            <span className="hidden lg:inline text-xs">{t.nav.profile}</span>
          </Button>
        ) : (
          <Button onClick={() => setCurrentPage('register')} className="bg-primary text-primary-foreground hover:bg-primary/90 h-7 px-3 text-xs">
            {t.nav.login}
          </Button>
        )}
      </div>
    </>
  );
};