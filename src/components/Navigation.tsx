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
  theme: 'standard' | 'light' | 'dark';
  setTheme: (theme: 'standard' | 'light' | 'dark') => void;
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
  theme,
  setTheme,
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
  
  return (
  <nav className="border-b border-border/50 glass-effect sticky top-0 z-50 shadow-lg">
    <div className="max-w-wide mx-auto px-2 sm:px-4 py-2">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentPage('home')}>
          <img 
            src="https://cdn.poehali.dev/files/eb44749d-b270-4ce8-8ff5-baa7f8487a4a.png" 
            alt="Love is..."
            className="h-10 sm:h-12 md:h-14 w-auto object-contain"
          />
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
          theme={theme}
          setTheme={setTheme}
          wallet={wallet}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          balanceAnimation={balanceAnimation}
          rubBalance={rubBalance}
          rubInBtc={rubInBtc}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          isSecondRow={false}
        />

        <div className="md:hidden flex items-center space-x-1">
          {userRole && (
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
      
      <div className="hidden md:block border-t border-border/30 py-3">
        <div className="max-w-wide mx-auto px-4">
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
            isSecondRow={true}
          />
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
      theme={theme}
      setTheme={setTheme}
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