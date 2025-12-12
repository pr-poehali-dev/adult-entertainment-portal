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
    <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-2xl z-50 animate-slide-down max-h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-wide mx-auto px-3 py-4 space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <button 
          onClick={() => { setCurrentPage('home'); setShowMobileMenu(false); }}
          className="w-full py-2.5 px-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 text-left"
        >
          <Icon name="Home" size={18} className="text-primary flex-shrink-0" />
          <span className="text-sm font-medium">{t.nav.home}</span>
        </button>
        
        <button 
          onClick={() => { setCurrentPage('catalog'); setShowMobileMenu(false); }}
          className="w-full py-2.5 px-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 text-left"
        >
          <Icon name="Search" size={18} className="text-primary flex-shrink-0" />
          <span className="text-sm font-medium">{t.nav.catalog}</span>
        </button>
        
        <button 
          onClick={() => { setCurrentPage('work'); setShowMobileMenu(false); }}
          className="w-full py-2.5 px-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 text-left"
        >
          <Icon name="Briefcase" size={18} className="text-primary flex-shrink-0" />
          <span className="text-sm font-medium">Работа</span>
        </button>
        
        {!profile.isAgencyOwner && (
          <button 
            onClick={() => { setCurrentPage('agency-register'); setShowMobileMenu(false); }}
            className="w-full py-2.5 px-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 text-left"
          >
            <Icon name="Building2" size={18} className="text-primary flex-shrink-0" />
            <span className="text-sm font-medium">Открыть Агентство</span>
          </button>
        )}
        
        {userRole && (
          <>
            <button 
              onClick={() => { setCurrentPage('favorites'); setShowMobileMenu(false); }}
              className="w-full py-2.5 px-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 text-left"
            >
              <Icon name="Heart" size={18} className="text-primary flex-shrink-0" />
              <span className="text-sm font-medium">{t.nav.favorites}</span>
            </button>
            
            <button 
              onClick={() => { setCurrentPage('messages'); setShowMobileMenu(false); }}
              className="w-full py-2.5 px-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 text-left relative"
            >
              <Icon name="MessageCircle" size={18} className="text-primary flex-shrink-0" />
              <span className="text-sm font-medium">{t.nav.messages}</span>
              {notifications.filter(n => !n.read && n.type === 'message').length > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                  {notifications.filter(n => !n.read && n.type === 'message').length}
                </span>
              )}
            </button>
          </>
        )}
        
        <button 
          onClick={() => { setCurrentPage('rules'); setShowMobileMenu(false); }}
          className="w-full py-2.5 px-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 text-left"
        >
          <Icon name="FileText" size={18} className="text-primary flex-shrink-0" />
          <span className="text-sm font-medium">{t.nav.rules}</span>
        </button>
        
        <button 
          onClick={() => { setCurrentPage('referral'); setShowMobileMenu(false); }}
          className="w-full py-2.5 px-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 text-left"
        >
          <Icon name="Users" size={18} className="text-primary flex-shrink-0" />
          <span className="text-sm font-medium">Партнёрка</span>
        </button>
        
        <div className="border-t border-border pt-3 mt-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground">Язык / Language</span>
            <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
              <Button
                variant={language === 'ru' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setLanguage('ru')}
                className="h-7 w-7 p-0 text-base"
              >
                🇷🇺
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setLanguage('en')}
                className="h-7 w-7 p-0 text-base"
              >
                🇬🇧
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground">Тема</span>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="flex items-center gap-1.5 h-8 text-xs px-3"
            >
              {isDarkTheme ? <Icon name="Sun" size={14} /> : <Icon name="Moon" size={14} />}
              <span>{isDarkTheme ? 'Светлая' : 'Тёмная'}</span>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Звук</span>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-1.5 h-8 text-xs px-3"
            >
              <Icon name={soundEnabled ? "Volume2" : "VolumeX"} size={14} />
              <span>{soundEnabled ? 'Вкл' : 'Выкл'}</span>
            </Button>
          </div>
        </div>
        
        {userRole ? (
          <div className="space-y-2 pt-3 border-t border-border">
            <button 
              onClick={() => { setCurrentPage('profile'); setShowMobileMenu(false); }}
              className="w-full py-2.5 px-3 rounded-lg bg-muted hover:bg-muted/70 transition-colors flex items-center gap-3 font-semibold"
            >
              <Avatar className="h-5 w-5">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{profile.nickname[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{profile.nickname}</span>
            </button>
            
            <button 
              onClick={() => { setCurrentPage('my-orders'); setShowMobileMenu(false); }}
              className="w-full py-2.5 px-3 rounded-lg bg-muted hover:bg-muted/70 transition-colors flex items-center gap-3 font-medium"
            >
              <Icon name="ShoppingBag" size={18} className="text-primary flex-shrink-0" />
              <span className="text-sm">Мои заказы</span>
            </button>

            <button 
              onClick={() => { setCurrentPage('bookings'); setShowMobileMenu(false); }}
              className="w-full py-2.5 px-3 rounded-lg bg-muted hover:bg-muted/70 transition-colors flex items-center gap-3 font-medium"
            >
              <Icon name="History" size={18} className="text-primary flex-shrink-0" />
              <span className="text-sm">История бронирований</span>
            </button>

            {profile.isAgencyOwner && (
              <button 
                onClick={() => { setCurrentPage('agency-dashboard'); setShowMobileMenu(false); }}
                className="w-full py-2.5 px-3 rounded-lg bg-primary/10 border border-primary hover:bg-primary/20 transition-colors flex items-center gap-3 font-semibold"
              >
                <Icon name="Building2" size={18} className="text-primary flex-shrink-0" />
                <span className="text-primary text-sm">Моё Агентство</span>
              </button>
            )}
            
            <button 
              onClick={() => { 
                setUserRole(null); 
                setCurrentPage('home'); 
                setShowMobileMenu(false); 
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-3 justify-center font-semibold"
            >
              <Icon name="LogOut" size={18} />
              <span className="text-sm">Выйти</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => { setCurrentPage('register'); setShowMobileMenu(false); }}
            className="w-full py-2.5 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold text-sm text-center"
          >
            {t.nav.login}
          </button>
        )}
      </div>
    </div>
  );
};