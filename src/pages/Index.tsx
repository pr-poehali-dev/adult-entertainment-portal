import { useState, useEffect } from 'react';
import { NavigationDesktop } from '@/components/navigation/NavigationDesktop';
import { NavigationMobile } from '@/components/navigation/NavigationMobile';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';
import { renderPage } from '@/components/AppPagesRenderer';
import { Page, UserRole, Profile, CatalogItem, Review, Notification, Wallet, Booking, OrderChat } from '@/types';
import { sellerProfiles } from '@/data/sellerProfiles';
import { SplashScreen } from '@/components/SplashScreen';
import { InstallPrompt } from '@/components/InstallPrompt';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { NotificationPermissionPrompt } from '@/components/NotificationPermissionPrompt';
import { LoadingOverlay } from '@/components/LoadingOverlay';

const defaultProfile: Profile = {
  name: '',
  nickname: '',
  role: 'buyer',
  avatar: '',
  rating: 0,
  verified: false,
  vipStatus: 'none',
  vipExpiry: null,
  subscriptionType: 'free',
  subscriptionExpiry: null,
  profileCompleted: false,
  kycCompleted: false,
  isAgencyOwner: false,
  contacts: {
    instagram: { value: '', forSale: false },
    telegram: { value: '', forSale: false },
    phone: { value: '', forSale: false },
  }
};

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [catalogItems] = useState<CatalogItem[]>([]);
  const [reviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<[number, number]>([18, 50]);
  const [selectedHeight, setSelectedHeight] = useState<[number, number]>([150, 190]);
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet>({ balance: 0, currency: 'RUB' });
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orderChats, setOrderChats] = useState<OrderChat[]>([]);
  const [selectedOrderChatId, setSelectedOrderChatId] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [rubBalance] = useState(0);
  const [rubInBtc] = useState(0);
  const [balanceAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedProfile = localStorage.getItem('userProfile');
    const savedRole = localStorage.getItem('userRole');

    if (savedAuth === 'true' && savedProfile) {
      setIsAuthenticated(true);
      setProfile(JSON.parse(savedProfile));
      setUserRole((savedRole as UserRole) || 'buyer');
      setCurrentPage('home');
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = { ...notification, id: Date.now().toString() };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const onProfileUpdate = (updatedProfile: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
    localStorage.setItem('userProfile', JSON.stringify({ ...profile, ...updatedProfile }));
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <InstallPrompt />
      <OfflineIndicator />
      <NotificationPermissionPrompt />
      {isLoading && <LoadingOverlay />}
      
      {isAuthenticated && (
        <>
          <NavigationDesktop
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
            setIsAuthenticated={setIsAuthenticated}
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
          />
          
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
            setIsAuthenticated={setIsAuthenticated}
          />
        </>
      )}
      
      <main className={isAuthenticated ? 'pt-16' : ''}>
        {renderPage({
          currentPage,
          setCurrentPage,
          userRole,
          setUserRole,
          setIsAuthenticated,
          profile,
          catalogItems,
          reviews,
          favorites,
          toggleFavorite,
          selectedServiceId,
          setSelectedServiceId,
          setShowBookingModal,
          searchQuery,
          setSearchQuery,
          selectedCategory,
          setSelectedCategory,
          priceRange,
          setPriceRange,
          sortBy,
          setSortBy,
          selectedCountry,
          setSelectedCountry,
          selectedLocation,
          setSelectedLocation,
          selectedAge,
          setSelectedAge,
          selectedHeight,
          setSelectedHeight,
          selectedBodyType,
          setSelectedBodyType,
          selectedSellerId,
          setSelectedSellerId,
          onProfileUpdate,
          wallet,
          setWallet,
          walletTransactions,
          setWalletTransactions,
          selectedPartyId,
          setSelectedPartyId,
          selectedApplicationId,
          setSelectedApplicationId,
          onNotificationAdd: addNotification,
          addNotification,
          onOpenLovePurchase: () => {},
          onPremiumRequired: () => {},
          bookings,
          setBookings,
          orderChats,
          setOrderChats,
          selectedOrderChatId,
          setSelectedOrderChatId,
        })}
      </main>
      
      {isAuthenticated && (
        <MobileBottomNav 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Index;