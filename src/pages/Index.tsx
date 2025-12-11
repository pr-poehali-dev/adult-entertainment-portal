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
import { isCurrentlyActive } from '@/utils/scheduleChecker';
import AgencyRegister from '@/components/pages/AgencyRegister';
import AgencyDashboard from '@/components/pages/AgencyDashboard';
import AgencyPaymentModal from '@/components/AgencyPaymentModal';
import AgencyGirlForm from '@/components/AgencyGirlForm';
import { LovePurchaseModal } from '@/components/wallet/LovePurchaseModal';
import { SettingsPage } from '@/components/pages/SettingsPage';

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
    agencyGirls: state.agencyGirls,
    setAgencyGirls: state.setAgencyGirls,
    setShowAgencyPayment: state.setShowAgencyPayment,
    setPendingAgencyName: state.setPendingAgencyName,
    setShowGirlForm: state.setShowGirlForm,
    setEditingGirl: state.setEditingGirl,
    wallet: state.wallet,
    setWallet: state.setWallet,
    walletTransactions: state.walletTransactions,
    setWalletTransactions: state.setWalletTransactions,
    pendingAgencyName: state.pendingAgencyName,
    pendingAgencyType: state.pendingAgencyType,
    setPendingAgencyType: state.setPendingAgencyType,
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

  const allCatalogItems = [...catalogItems, ...state.agencyGirls];
  
  const activeAdsCount = state.userAds.filter(ad => ad.status === 'active').length;

  const { renderPage } = useAppPages({
    currentPage: state.currentPage,
    setCurrentPage: state.setCurrentPage,
    userRole: state.userRole,
    setUserRole: state.setUserRole,
    profile: state.profile,
    catalogItems: allCatalogItems,
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
    onOpenLovePurchase: () => state.setShowLovePurchase(true),
  });

  if (state.currentPage === 'agency-register') {
    return (
      <AgencyRegister
        onBack={() => {
          state.setShowAgencyPayment(false);
          state.setPendingAgencyName('');
          state.setCurrentPage('home');
        }}
        onPayment={handlers.handleAgencyRegister}
      />
    );
  }

  if (state.currentPage === 'agency-dashboard') {
    return (
      <AgencyDashboard
        agencyName={state.profile.agencyName || 'Моё агентство'}
        agencyType={state.profile.agencyType}
        agencyGirls={state.agencyGirls}
        transactions={state.walletTransactions}
        onBack={() => state.setCurrentPage('profile')}
        onAddGirl={() => {
          state.setEditingGirl(null);
          state.setShowGirlForm(true);
        }}
        onEditGirl={handlers.handleEditGirl}
        onDeleteGirl={handlers.handleDeleteGirl}
        onToggleActive={handlers.handleToggleGirlActive}
      />
    );
  }

  if (state.currentPage === 'settings') {
    return (
      <div className={state.isDarkTheme ? 'dark' : ''} data-theme={state.isDarkTheme ? 'dark' : 'light'}>
        <div className="min-h-screen bg-background text-foreground">
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
            activeAdsCount={activeAdsCount}
          />
          <SettingsPage
            isDarkTheme={state.isDarkTheme}
            setIsDarkTheme={state.setIsDarkTheme}
            soundEnabled={state.soundEnabled}
            setSoundEnabled={state.setSoundEnabled}
          />
        </div>
      </div>
    );
  }

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
        activeAdsCount={activeAdsCount}
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
        servicePrice={state.selectedServiceId ? parseInt(allCatalogItems.find(item => item.id === state.selectedServiceId)?.price.replace(/\D/g, '') || '25000') : 25000}
        serviceName={state.selectedServiceId ? allCatalogItems.find(item => item.id === state.selectedServiceId)?.title : 'Услуга'}
        isServiceActive={state.selectedServiceId ? (() => {
          const item = allCatalogItems.find(item => item.id === state.selectedServiceId);
          if (!item) return true;
          return item.isActive !== false && isCurrentlyActive(item.workSchedule);
        })() : true}
      />

      <ReviewModal
        showReviewModal={state.showReviewModal}
        setShowReviewModal={state.setShowReviewModal}
        serviceName={state.reviewServiceName}
        onSubmitReview={handlers.handleSubmitReview}
      />

      <AgencyPaymentModal
        isOpen={state.showAgencyPayment}
        onClose={() => {
          state.setShowAgencyPayment(false);
          state.setCurrentPage('agency-register');
        }}
        onPaymentConfirm={handlers.handleAgencyPayment}
        agencyName={state.pendingAgencyName}
        walletBalances={state.wallet.balances}
        onTopUp={handlers.handleTopUpWallet}
      />

      <AgencyGirlForm
        isOpen={state.showGirlForm}
        onClose={() => {
          state.setShowGirlForm(false);
          state.setEditingGirl(null);
        }}
        onSubmit={(girlData) => {
          if (state.editingGirl) {
            handlers.handleUpdateGirl({ ...state.editingGirl, ...girlData });
          } else {
            handlers.handleAddGirl({
              ...girlData,
              agencyId: state.profile.agencyId,
              agencyName: state.profile.agencyName,
            });
          }
          state.setShowGirlForm(false);
          state.setEditingGirl(null);
        }}
        editingGirl={state.editingGirl}
        agencyId={state.profile.agencyId || 0}
        agencyName={state.profile.agencyName || ''}
        agencyType={state.profile.agencyType}
      />

      <LovePurchaseModal
        isOpen={state.showLovePurchase}
        onClose={() => state.setShowLovePurchase(false)}
        onPurchase={handlers.handlePurchaseLove}
        rubBalance={state.wallet.balances.find(b => b.currency === 'RUB')?.amount || 0}
      />

      <footer className="border-t border-border/50 mt-20 py-12 md:py-16 bg-gradient-to-b from-card/30 to-card/80 backdrop-blur-sm">
        <div className="max-w-wide mx-auto px-4">
          {/* Адаптивное меню для мобильных и десктопа */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-8 mb-8 text-foreground/80 text-sm md:text-base">
            <button onClick={() => state.setCurrentPage('rules')} className="hover:text-primary transition-colors font-medium px-2">
              Правила платформы
            </button>
            <span className="text-muted-foreground hidden md:inline">•</span>
            <a href="#" className="hover:text-primary transition-colors font-medium px-2">Конфиденциальность</a>
            <span className="text-muted-foreground hidden md:inline">•</span>
            <a href="#" className="hover:text-primary transition-colors font-medium px-2">Поддержка 24/7</a>
            <span className="text-muted-foreground hidden md:inline">•</span>
            <button onClick={() => state.setCurrentPage('user-guide')} className="hover:text-primary transition-colors font-medium px-2">
              Пользовательская Инструкция
            </button>
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