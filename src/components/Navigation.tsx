import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Page, Profile, Notification, UserRole, Wallet } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/i18n/translations';

interface NavigationProps {
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
}

const Navigation = ({
  currentPage,
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
}: NavigationProps) => {
  const { language, setLanguage, t } = useLanguage();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [balanceAnimation, setBalanceAnimation] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const prevBalanceRef = useRef<number>(0);
  
  const rubBalance = wallet.balances.find(b => b.currency === 'RUB')?.amount || 0;
  const btcBalance = wallet.balances.find(b => b.currency === 'BTC')?.amount || 0;
  const rubToBtcRate = 0.000015;
  const rubInBtc = rubBalance * rubToBtcRate;

  useEffect(() => {
    if (prevBalanceRef.current !== 0 && prevBalanceRef.current !== rubBalance) {
      setBalanceAnimation(true);
      const timer = setTimeout(() => setBalanceAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
    prevBalanceRef.current = rubBalance;
  }, [rubBalance]);
  
  return (
  <nav className="border-b border-border/50 glass-effect sticky top-0 z-50 shadow-lg">
    <div className="max-w-wide mx-auto px-4 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentPage('home')}>
          <Icon name="Crown" size={32} className="text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            <span className="gold-shimmer">Elite</span>
          </h1>
        </div>
        
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

        <div className="md:hidden flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-foreground/80 hover:text-primary"
          >
            <Icon name={showMobileMenu ? "X" : "Menu"} size={24} />
          </Button>
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
                <div className="absolute right-0 top-12 w-96 bg-card border border-border rounded-lg shadow-2xl z-50 animate-fade-in">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Уведомления</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                      }}
                    >
                      Прочитать все
                    </Button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <Icon name="BellOff" size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Нет уведомлений</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer ${
                            !notif.read ? 'bg-primary/5' : ''
                          }`}
                          onClick={() => {
                            setNotifications(
                              notifications.map(n =>
                                n.id === notif.id ? { ...n, read: true } : n
                              )
                            );
                            if (notif.type === 'message') setCurrentPage('messages');
                            if (notif.type === 'booking') setCurrentPage('profile');
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex gap-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              notif.type === 'message' ? 'bg-blue-500/20' :
                              notif.type === 'booking' ? 'bg-green-500/20' :
                              notif.type === 'review' ? 'bg-yellow-500/20' :
                              'bg-purple-500/20'
                            }`}>
                              <Icon 
                                name={
                                  notif.type === 'message' ? 'MessageCircle' :
                                  notif.type === 'booking' ? 'Calendar' :
                                  notif.type === 'review' ? 'Star' :
                                  'Bell'
                                } 
                                size={20}
                                className={
                                  notif.type === 'message' ? 'text-blue-500' :
                                  notif.type === 'booking' ? 'text-green-500' :
                                  notif.type === 'review' ? 'text-yellow-500' :
                                  'text-purple-500'
                                }
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-sm">{notif.title}</h4>
                                {!notif.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notif.text}</p>
                              {notif.type === 'referral' && notif.amount && (
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                                    +{notif.amount} {notif.currency}
                                  </div>
                                  <div className={`px-2 py-0.5 rounded text-xs ${
                                    notif.referralLevel === 1 ? 'bg-primary/10 text-primary' :
                                    notif.referralLevel === 2 ? 'bg-blue-500/10 text-blue-500' :
                                    'bg-purple-500/10 text-purple-500'
                                  }`}>
                                    {notif.referralLevel} линия
                                  </div>
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
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
      </div>
    </div>

    {showMobileMenu && (
      <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-2xl z-50 animate-fade-in">
        <div className="max-w-wide mx-auto px-4 py-6 space-y-4">
          <button 
            onClick={() => { setCurrentPage('home'); setShowMobileMenu(false); }}
            className="w-full text-left py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center gap-3"
          >
            <Icon name="Home" size={20} className="text-primary" />
            <span className="font-medium">{t.nav.home}</span>
          </button>
          
          <button 
            onClick={() => { setCurrentPage('catalog'); setShowMobileMenu(false); }}
            className="w-full text-left py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center gap-3"
          >
            <Icon name="Search" size={20} className="text-primary" />
            <span className="font-medium">{t.nav.catalog}</span>
          </button>
          
          <button 
            onClick={() => { setCurrentPage('work'); setShowMobileMenu(false); }}
            className="w-full text-left py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center gap-3"
          >
            <Icon name="Briefcase" size={20} className="text-primary" />
            <span className="font-medium">Работа</span>
          </button>
          
          <button 
            onClick={() => { setCurrentPage('referral'); setShowMobileMenu(false); }}
            className="w-full text-left py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center gap-3"
          >
            <Icon name="Users" size={20} className="text-primary" />
            <span className="font-medium">Партнёрская программа</span>
          </button>
          
          {userRole && (
            <>
              <Button
                onClick={() => { setCurrentPage('wallet'); setShowMobileMenu(false); }}
                className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-6 shadow-lg ${balanceAnimation ? 'animate-pulse scale-105' : ''}`}
                size="lg"
              >
                <Icon name="Wallet" size={24} className={`mr-3 ${balanceAnimation ? 'animate-bounce' : ''}`} />
                <div className="flex flex-col items-start flex-1">
                  <span className={`text-lg leading-none ${balanceAnimation ? 'animate-pulse' : ''}`}>
                    {rubBalance.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-xs text-white/80 mt-1">
                    {rubInBtc.toFixed(6)} ₿
                  </span>
                </div>
              </Button>
              
              <button 
                onClick={() => { setCurrentPage('favorites'); setShowMobileMenu(false); }}
                className="w-full text-left py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center gap-3"
              >
                <Icon name="Heart" size={20} className="text-primary" />
                <span className="font-medium">{t.nav.favorites}</span>
              </button>
              
              <button 
                onClick={() => { setCurrentPage('messages'); setShowMobileMenu(false); }}
                className="w-full text-left py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 relative"
              >
                <Icon name="MessageCircle" size={20} className="text-primary" />
                <span className="font-medium">{t.nav.messages}</span>
                {notifications.filter(n => !n.read && n.type === 'message').length > 0 && (
                  <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read && n.type === 'message').length}
                  </span>
                )}
              </button>
            </>
          )}
          
          <button 
            onClick={() => { setCurrentPage('rules'); setShowMobileMenu(false); }}
            className="w-full text-left py-3 px-4 rounded-lg hover:bg-muted transition-colors flex items-center gap-3"
          >
            <Icon name="FileText" size={20} className="text-primary" />
            <span className="font-medium">{t.nav.rules}</span>
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
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">{profile.name[0]}</AvatarFallback>
                </Avatar>
                <span>{profile.name}</span>
              </button>
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
    )}
  </nav>
  );
};

export default Navigation;