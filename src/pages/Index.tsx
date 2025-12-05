import Navigation from '@/components/Navigation';
import BookingModal from '@/components/BookingModal';
import ReviewModal from '@/components/ReviewModal';
import PageTransition from '@/components/PageTransition';
import { Toaster } from '@/components/ui/toaster';
import Icon from '@/components/ui/icon';
import { useAppPages } from '@/components/AppPages';
import { catalogItems, reviews } from '@/data/mockData';
import { InstallPrompt } from '@/components/InstallPrompt';
import { SplashScreen } from '@/components/SplashScreen';
import { notificationService } from '@/utils/notificationService';
import { Button } from '@/components/ui/button';
import { useIndexState } from './IndexState';
import { useIndexHandlers } from './IndexHandlers';
import { useIndexEffects } from './IndexEffects';

const Index = () => {
  // Состояние
  const state = useIndexState();

  // Обработчики
  const handlers = useIndexHandlers({
    favorites: state.favorites,
    setFavorites: state.setFavorites,
    toast: state.toast,
    notifications: state.notifications,
    setNotifications: state.setNotifications,
    playNotificationSound: state.playNotificationSound,
    bookingDate: state.bookingDate,
    bookingTime: state.bookingTime,
    setShowBookingModal: state.setShowBookingModal,
    selectedServiceId: state.selectedServiceId,
    setReviewServiceName: state.setReviewServiceName,
    setShowReviewModal: state.setShowReviewModal,
    setBookingDate: state.setBookingDate,
    setBookingTime: state.setBookingTime,
    setBookingDuration: state.setBookingDuration,
    setBookingNote: state.setBookingNote,
    setCurrentPage: state.setCurrentPage,
    reviewServiceName: state.reviewServiceName,
    setProfile: state.setProfile,
  });

  // Эффекты
  useIndexEffects({
    userRole: state.userRole,
    notifications: state.notifications,
    wallet: state.wallet,
    setWallet: state.setWallet,
    walletTransactions: state.walletTransactions,
    setWalletTransactions: state.setWalletTransactions,
    playBalanceSound: state.playBalanceSound,
    addNotification: handlers.addNotification,
    setCurrentPage: state.setCurrentPage,
    toast: state.toast,
    selectedPartyId: state.selectedPartyId,
    setSelectedApplicationId: state.setSelectedApplicationId,
  });

  const { renderPage } = useAppPages({
    currentPage: state.currentPage,
    setCurrentPage: state.setCurrentPage,
    userRole: state.userRole,
    setUserRole: state.setUserRole,
    profile: state.profile,
    catalogItems,
    reviews,
    favorites: state.favorites,
    toggleFavorite: handlers.toggleFavorite,
    selectedServiceId: state.selectedServiceId,
    setSelectedServiceId: state.setSelectedServiceId,
    setShowBookingModal: state.setShowBookingModal,
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
    selectedCategory: state.selectedCategory,
    setSelectedCategory: state.setSelectedCategory,
    priceRange: state.priceRange,
    setPriceRange: state.setPriceRange,
    sortBy: state.sortBy,
    setSortBy: state.setSortBy,
    selectedCountry: state.selectedCountry,
    setSelectedCountry: state.setSelectedCountry,
    selectedLocation: state.selectedLocation,
    setSelectedLocation: state.setSelectedLocation,
    selectedAge: state.selectedAge,
    setSelectedAge: state.setSelectedAge,
    selectedHeight: state.selectedHeight,
    setSelectedHeight: state.setSelectedHeight,
    selectedBodyType: state.selectedBodyType,
    setSelectedBodyType: state.setSelectedBodyType,
    selectedSellerId: state.selectedSellerId,
    setSelectedSellerId: state.setSelectedSellerId,
    onProfileUpdate: handlers.handleProfileUpdate,
    wallet: state.wallet,
    selectedPartyId: state.selectedPartyId,
    setSelectedPartyId: state.setSelectedPartyId,
    selectedApplicationId: state.selectedApplicationId,
    setSelectedApplicationId: state.setSelectedApplicationId,
    onNotificationAdd: handlers.addNotification,
  });

  return (
    <div className={state.isDarkTheme ? 'dark' : ''} data-theme={state.isDarkTheme ? 'dark' : 'light'}>
    <SplashScreen />
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden w-full max-w-full">
      <Navigation 
        currentPage={state.currentPage}
        setCurrentPage={state.setCurrentPage}
        userRole={state.userRole}
        setUserRole={state.setUserRole}
        profile={state.profile}
        notifications={state.notifications}
        setNotifications={state.setNotifications}
        showNotifications={state.showNotifications}
        setShowNotifications={state.setShowNotifications}
        isDarkTheme={state.isDarkTheme}
        setIsDarkTheme={state.setIsDarkTheme}
        wallet={state.wallet}
        soundEnabled={state.soundEnabled}
        setSoundEnabled={state.setSoundEnabled}
      />
      
      <main>
        <PageTransition pageKey={state.currentPage}>
          {renderPage()}
        </PageTransition>
      </main>

      <BookingModal 
        showBookingModal={state.showBookingModal}
        setShowBookingModal={state.setShowBookingModal}
        bookingDate={state.bookingDate}
        setBookingDate={state.setBookingDate}
        bookingTime={state.bookingTime}
        setBookingTime={state.setBookingTime}
        bookingDuration={state.bookingDuration}
        setBookingDuration={state.setBookingDuration}
        bookingNote={state.bookingNote}
        setBookingNote={state.setBookingNote}
        handleBookingSubmit={handlers.handleBookingSubmit}
        servicePrice={state.selectedServiceId ? parseInt(catalogItems.find(item => item.id === state.selectedServiceId)?.price.replace(/\D/g, '') || '25000') : 25000}
        serviceName={state.selectedServiceId ? catalogItems.find(item => item.id === state.selectedServiceId)?.title : 'Услуга'}
        isServiceActive={state.selectedServiceId ? (() => {
          const item = catalogItems.find(item => item.id === state.selectedServiceId);
          if (!item) return true;
          const { isCurrentlyActive } = require('@/utils/scheduleChecker');
          return item.isActive !== false && isCurrentlyActive(item.workSchedule);
        })() : true}
      />

      <ReviewModal
        showReviewModal={state.showReviewModal}
        setShowReviewModal={state.setShowReviewModal}
        serviceName={state.reviewServiceName}
        onSubmitReview={handlers.handleSubmitReview}
      />

      <footer className="border-t border-border/50 mt-20 py-16 bg-gradient-to-b from-card/30 to-card/80 backdrop-blur-sm">
        <div className="max-w-wide mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Icon name="Crown" size={40} className="text-primary" />
              <h2 className="text-5xl font-bold gold-shimmer">Elite</h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Премиальная платформа эскорт-услуг для взыскательных клиентов
            </p>
          </div>
          
          <div className="flex justify-center gap-8 mb-8 text-foreground/80">
            <button onClick={() => state.setCurrentPage('rules')} className="hover:text-primary transition-colors font-medium">
              Правила платформы
            </button>
            <span className="text-muted-foreground">•</span>
            <a href="#" className="hover:text-primary transition-colors font-medium">Конфиденциальность</a>
            <span className="text-muted-foreground">•</span>
            <a href="#" className="hover:text-primary transition-colors font-medium">Поддержка 24/7</a>
          </div>
          
          <div className="pt-8 border-t border-border/30">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 <span className="font-semibold text-primary">Elite</span>. Все права защищены. 18+
            </p>
          </div>
        </div>
      </footer>

      <InstallPrompt />
      <Toaster />
    </div>
    </div>
  );
};

export default Index;