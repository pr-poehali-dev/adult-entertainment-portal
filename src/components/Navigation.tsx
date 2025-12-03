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
  <nav className="border-b border-border/50 glass-effect sticky top-0 z-50 shadow-lg w-full overflow-x-hidden">
    <div className="max-w-wide mx-auto px-4 py-5 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentPage('home')}>
          <Icon name="Crown" size={32} className="text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            <span className="gold-shimmer">Elite</span>
          </h1>
        </div>
        
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
        />

        <div className="md:hidden flex items-center space-x-2 relative z-50">
          {userRole && (
            <Button
              onClick={() => setCurrentPage('wallet')}
              className={`bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-3 py-2 shadow-lg ${balanceAnimation ? 'animate-pulse scale-110' : ''}`}
              size="sm"
            >
              <Icon name="Wallet" size={18} className={`mr-2 ${balanceAnimation ? 'animate-bounce' : ''}`} />
              <div className="flex flex-col items-start">
                <span className={`text-sm leading-none ${balanceAnimation ? 'animate-pulse' : ''}`}>
                  {rubBalance.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-foreground/80 hover:text-primary"
          >
            <Icon name={showMobileMenu ? "X" : "Menu"} size={24} />
          </Button>
        </div>
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