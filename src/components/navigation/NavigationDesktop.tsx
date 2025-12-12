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
  activeAdsCount?: number;
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
  activeAdsCount = 0,
  isSecondRow = false,
}: NavigationDesktopProps) => {
  const { language, setLanguage, t } = useLanguage();

  if (isSecondRow) {
    return (
      <div className="flex items-center space-x-6 justify-center text-base">
        <button onClick={() => setCurrentPage('home')} className="text-foreground font-medium hover:text-primary transition-colors py-2">
          Главная
        </button>
        <button onClick={() => setCurrentPage('catalog')} className="text-foreground font-medium hover:text-primary transition-colors py-2">
          Объявления
        </button>
        <button onClick={() => setCurrentPage('online-search')} className="text-foreground font-medium hover:text-primary transition-colors py-2">
          Онлайн
        </button>
        <button onClick={() => setCurrentPage('work')} className="text-foreground font-medium hover:text-primary transition-colors py-2">
          Работа
        </button>
        {userRole && (
          <>
            <button onClick={() => setCurrentPage('favorites')} className="text-foreground font-medium hover:text-primary transition-colors py-2">
              Избранное
            </button>
            <button 
              onClick={() => setCurrentPage('messages')} 
              className="text-foreground font-medium hover:text-primary transition-colors relative py-2"
            >
              Сообщения
              {notifications.filter(n => !n.read && n.type === 'message').length > 0 && (
                <span className="absolute -top-0 -right-3 w-4 h-4 bg-gradient-to-r from-secondary to-secondary/90 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {notifications.filter(n => !n.read && n.type === 'message').length}
                </span>
              )}
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)} 
                className="text-foreground font-medium hover:text-primary transition-colors flex items-center gap-2 py-2"
              >
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-medium">
                    {profile.nickname[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{profile.nickname}</span>
                <Icon name="ChevronDown" size={14} />
              </button>

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
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setCurrentPage('my-ads');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 border-t border-border"
                  >
                    <Icon name="FileText" size={16} />
                    <span className="flex-1">Мои объявления</span>
                    {activeAdsCount > 0 && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                        {activeAdsCount}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setCurrentPage('my-orders');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 border-t border-border"
                  >
                    <Icon name="ShoppingBag" size={16} />
                    <span>Мои заказы</span>
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
            
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-muted rounded-lg transition-colors relative"
                title="Уведомления"
              >
                <Icon name="Bell" size={18} className="text-foreground" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-r from-secondary to-secondary/90 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <NotificationPanel
                  notifications={notifications}
                  setNotifications={setNotifications}
                  onClose={() => setShowNotifications(false)}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>
            
            <button
              onClick={() => setCurrentPage('settings')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Настройки"
            >
              <Icon name="Settings" size={18} className="text-foreground" />
            </button>
            
            <button
              onClick={() => setCurrentPage('wallet')}
              className="px-4 py-2 rounded-lg border border-primary/20 bg-transparent hover:bg-primary/5 transition-colors flex items-center gap-2"
            >
              <Icon name="Wallet" size={18} className="text-primary" />
              <span className="font-semibold text-foreground whitespace-nowrap">
                {rubBalance.toLocaleString('ru-RU')} ₽
              </span>
            </button>
          </>
        )}
      </div>
    );
  }

  return null;
};