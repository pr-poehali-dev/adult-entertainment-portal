import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Page, Profile, Notification, UserRole, Wallet } from '@/types';
import { NavigationDesktop } from './navigation/NavigationDesktop';
import { NavigationMobile } from './navigation/NavigationMobile';

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
  activeAdsCount?: number;
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
  activeAdsCount = 0,
}: NavigationProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [balanceAnimation, setBalanceAnimation] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  return (
  <nav className={`border-b border-border/50 glass-effect shadow-lg sticky top-0 z-50 transition-transform duration-300 ${
    isVisible ? 'translate-y-0' : '-translate-y-full'
  }`}>
    <div className="max-w-wide mx-auto px-2 sm:px-4 py-4">
      <div className="flex items-center justify-between gap-1">

        <div className="md:hidden flex items-center space-x-1">
          {userRole && (
            <>
              <Button
                onClick={() => setCurrentPage('wallet')}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-2 py-1.5 shadow-lg"
                size="sm"
              >
                <span className="text-xs leading-none">
                  {(wallet.balances.find(b => b.currency === 'LOVE')?.amount || 0).toLocaleString('ru-RU')} 💗
                </span>
              </Button>
              <Button
                onClick={() => setCurrentPage('wallet')}
                className={`bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-2 py-1.5 shadow-lg ${balanceAnimation ? 'animate-pulse scale-110' : ''}`}
                size="sm"
              >
                <Icon name="Wallet" size={16} className={`mr-1.5 ${balanceAnimation ? 'animate-bounce' : ''}`} />
                <div className="flex flex-col items-start">
                  <span className={`text-xs leading-none ${balanceAnimation ? 'animate-pulse' : ''}`}>
                    {rubBalance.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </Button>
              <Button
                onClick={() => setShowNotifications(!showNotifications)}
                variant="ghost"
                size="icon"
                className="relative h-8 w-8"
              >
                <Icon name="Bell" size={18} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-secondary to-secondary/90 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
            </>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-foreground/80 hover:text-foreground h-8 w-8"
          >
            <Icon name={showMobileMenu ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      
      <div className="hidden md:flex items-center justify-center">
        <NavigationDesktop
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          userRole={userRole}
          setUserRole={setUserRole}
          profile={profile}
          notifications={notifications}
          setNotifications={setNotifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          isDarkTheme={isDarkTheme}
          setIsDarkTheme={setIsDarkTheme}
          wallet={wallet}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          balanceAnimation={balanceAnimation}
          rubBalance={rubBalance}
          rubInBtc={rubInBtc}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          activeAdsCount={activeAdsCount}
          isSecondRow={true}
        />
      </div>
    </div>

    <NavigationMobile
      showMobileMenu={showMobileMenu}
      setShowMobileMenu={setShowMobileMenu}
      setCurrentPage={setCurrentPage}
      userRole={userRole}
      setUserRole={setUserRole}
      profile={profile}
      notifications={notifications}
      setNotifications={setNotifications}
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
      isDarkTheme={isDarkTheme}
      setIsDarkTheme={setIsDarkTheme}
      soundEnabled={soundEnabled}
      setSoundEnabled={setSoundEnabled}
      balanceAnimation={balanceAnimation}
      rubBalance={rubBalance}
      rubInBtc={rubInBtc}
    />
  </nav>
  );
};

export default Navigation;