import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Page, Profile, Notification, UserRole } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationMobileProps {
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
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
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  balanceAnimation: boolean;
  rubBalance: number;
  rubInBtc: number;
}

export const NavigationMobile = ({
  showMobileMenu,
  setShowMobileMenu,
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
}: NavigationMobileProps) => {
  const { language, setLanguage, t } = useLanguage();

  if (!showMobileMenu) return null;

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-2xl z-50 animate-slide-down max-h-[calc(100vh-80px)] overflow-y-auto">
      <div className="max-w-wide mx-auto px-4 py-6 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <button 
          onClick={() => { setCurrentPage('home'); setShowMobileMenu(false); }}
          className="w-full py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-3"
        >
          <Icon name="Home" size={20} className="text-primary" />
          <span className="font-medium">{t.nav.home}</span>
        </button>
        
        <button 
          onClick={() => { setCurrentPage('catalog'); setShowMobileMenu(false); }}
          className="w-full py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-3"
        >
          <Icon name="Search" size={20} className="text-primary" />
          <span className="font-medium">{t.nav.catalog}</span>
        </button>
        
        <button 
          onClick={() => { setCurrentPage('work'); setShowMobileMenu(false); }}
          className="w-full py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-3"
        >
          <Icon name="Briefcase" size={20} className="text-primary" />
          <span className="font-medium">Работа</span>
        </button>
        
        {!profile.isAgencyOwner && (
          <button 
            onClick={() => { setCurrentPage('agency-register'); setShowMobileMenu(false); }}
            className="w-full py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-3"
          >
            <Icon name="Building2" size={20} className="text-primary" />
            <span className="font-medium">Открыть Агентство</span>
          </button>
        )}
        
        {userRole && (
          <>
            <button 
              onClick={() => { setCurrentPage('favorites'); setShowMobileMenu(false); }}
              className="w-full py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-3"
            >
              <Icon name="Heart" size={20} className="text-primary" />
              <span className="font-medium">{t.nav.favorites}</span>
            </button>
            
            <button 
              onClick={() => { setCurrentPage('messages'); setShowMobileMenu(false); }}
              className="w-full py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-3 relative"
            >
              <Icon name="MessageCircle" size={20} className="text-primary" />
              <span className="font-medium">{t.nav.messages}</span>
              {notifications.filter(n => !n.read && n.type === 'message').length > 0 && (
                <span className="absolute right-4 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter(n => !n.read && n.type === 'message').length}
                </span>
              )}
            </button>
          </>
        )}
        
        <button 
          onClick={() => { setCurrentPage('rules'); setShowMobileMenu(false); }}
          className="w-full py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-3"
        >
          <Icon name="FileText" size={20} className="text-primary" />
          <span className="font-medium">{t.nav.rules}</span>
        </button>
        
        <button 
          onClick={() => { setCurrentPage('referral'); setShowMobileMenu(false); }}
          className="w-full py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-3"
        >
          <Icon name="Users" size={20} className="text-primary" />
          <span className="font-medium">Партнёрская программа</span>
        </button>
        
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Язык / Language</span>
            <div className="flex items-center gap-2 border border-border rounded-lg p-1">
              <Button
                variant={language === 'ru' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setLanguage('ru')}
                className="h-8 w-8 p-0 text-lg"
              >
                🇷🇺
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setLanguage('en')}
                className="h-8 w-8 p-0 text-lg"
              >
                🇬🇧
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Тема</span>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="flex items-center gap-2"
            >
              {isDarkTheme ? <Icon name="Sun" size={16} /> : <Icon name="Moon" size={16} />}
              <span>{isDarkTheme ? 'Светлая' : 'Тёмная'}</span>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Звук уведомлений</span>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2"
            >
              <Icon name={soundEnabled ? "Volume2" : "VolumeX"} size={16} />
              <span>{soundEnabled ? 'Вкл' : 'Выкл'}</span>
            </Button>
          </div>
        </div>
        
        {userRole ? (
          <div className="space-y-3">
            <button 
              onClick={() => { setCurrentPage('profile'); setShowMobileMenu(false); }}
              className="w-full py-3 px-4 rounded-lg bg-muted hover:bg-muted/70 transition-colors flex items-center gap-3 justify-center font-semibold"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">{profile.nickname[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{profile.nickname}</span>
            </button>
            
            <button 
              onClick={() => { setCurrentPage('my-orders'); setShowMobileMenu(false); }}
              className="w-full py-3 px-4 rounded-lg bg-muted hover:bg-muted/70 transition-colors flex items-center gap-3 justify-center font-semibold"
            >
              <Icon name="ShoppingBag" size={20} className="text-primary" />
              <span>Мои заказы</span>
            </button>

            {profile.isAgencyOwner && (
              <button 
                onClick={() => { setCurrentPage('agency-dashboard'); setShowMobileMenu(false); }}
                className="w-full py-3 px-4 rounded-lg bg-primary/10 border border-primary hover:bg-primary/20 transition-colors flex items-center gap-3 justify-center font-semibold"
              >
                <Icon name="Building2" size={20} className="text-primary" />
                <span className="text-primary">Моё Агентство</span>
              </button>
            )}
            
            <button 
              onClick={() => { 
                setUserRole(null); 
                setCurrentPage('home'); 
                setShowMobileMenu(false); 
              }}
              className="w-full py-3 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-3 justify-center font-semibold"
            >
              <Icon name="LogOut" size={20} />
              <span>Выйти</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => { setCurrentPage('register'); setShowMobileMenu(false); }}
            className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold text-center"
          >
            {t.nav.login}
          </button>
        )}
      </div>
    </div>
  );
};