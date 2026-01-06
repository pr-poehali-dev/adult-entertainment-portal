import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Page, Profile, Notification, UserRole, Wallet } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/i18n/translations';
import { NotificationPanel } from './NotificationPanel';
import { useServiceCategories } from '@/contexts/ServiceCategoriesContext';
import { useState, useEffect, useRef } from 'react';

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
  setIsAuthenticated?: (value: boolean) => void;
  setSelectedServiceCategory?: (category: { id: string; name: string } | null) => void;
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
  setSelectedServiceCategory,
}: NavigationDesktopProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { serviceCategories } = useServiceCategories();
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const servicesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setShowServicesMenu(false);
      }
    };

    if (showServicesMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showServicesMenu]);

  if (isSecondRow) {
    return (
      <div className="flex items-center space-x-6 justify-center text-base">
        <button onClick={() => setCurrentPage('home')} className="text-foreground font-medium hover:text-primary transition-colors py-2">
          Главная
        </button>
        <button onClick={() => setCurrentPage('online-search')} className="text-foreground font-medium hover:text-primary transition-colors py-2">
          Поиск
        </button>
        <button onClick={() => setCurrentPage('all-ads')} className="text-foreground font-medium hover:text-primary transition-colors py-2">
          Объявления
        </button>
        <div className="relative" ref={servicesMenuRef}>
          <button 
            onClick={() => setShowServicesMenu(!showServicesMenu)}
            className="text-foreground font-medium hover:text-primary transition-colors py-2 flex items-center gap-1"
          >
            Услуги
            <Icon name="ChevronDown" size={14} />
          </button>
          
          {showServicesMenu && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
              <div className="max-h-96 overflow-y-auto">
                {serviceCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedServiceCategory?.({ id: category.id, name: category.name });
                      setCurrentPage('agency-services');
                      setShowServicesMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3 border-b border-border last:border-0"
                  >
                    <Icon name={category.icon} size={20} className="text-primary" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
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
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setCurrentPage('bookings');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 border-t border-border"
                  >
                    <Icon name="History" size={16} />
                    <span>История бронирований</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setCurrentPage('wallet');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 border-t border-border"
                  >
                    <Icon name="Wallet" size={16} />
                    <span>Кошелек</span>
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
                      setCurrentPage('settings');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 border-t border-border"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Настройки</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm('Вы уверены, что хотите выйти?')) {
                        setShowProfileMenu(false);
                        localStorage.removeItem('userProfile');
                        localStorage.removeItem('isAuthenticated');
                        localStorage.removeItem('userRole');
                        setUserRole(null);
                        setCurrentPage('login');
                      }
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