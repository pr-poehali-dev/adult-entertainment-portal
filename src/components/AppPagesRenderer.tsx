import { Suspense } from 'react';
import { HomePage, CatalogPage } from '@/components/pages/HomeAndCatalog';
import { sellerProfiles } from '@/data/sellerProfiles';
import { AppPagesProps } from './AppPagesTypes';
import * as Pages from './AppPagesImports';

export const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const renderPage = (props: AppPagesProps) => {
  const {
    currentPage,
    setCurrentPage,
    userRole,
    setUserRole,
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
    onNotificationAdd,
    addNotification,
    onOpenLovePurchase,
    onPremiumRequired,
    bookings,
    setBookings,
    orderChats,
    setOrderChats,
    selectedOrderChatId,
    setSelectedOrderChatId,
  } = props;

  switch (currentPage) {
    case 'home':
      return (
        <HomePage 
          setCurrentPage={setCurrentPage} 
          userRole={userRole} 
          setSelectedCategory={setSelectedCategory} 
          profile={profile} 
          onPremiumRequired={onPremiumRequired}
          catalogItems={catalogItems}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          setSelectedServiceId={setSelectedServiceId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedAge={selectedAge}
          setSelectedAge={setSelectedAge}
          selectedHeight={selectedHeight}
          setSelectedHeight={setSelectedHeight}
          selectedBodyType={selectedBodyType}
          setSelectedBodyType={setSelectedBodyType}
        />
      );
    
    case 'catalog':
      return (
        <CatalogPage
          catalogItems={catalogItems}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          setSelectedServiceId={setSelectedServiceId}
          setCurrentPage={setCurrentPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedAge={selectedAge}
          setSelectedAge={setSelectedAge}
          selectedHeight={selectedHeight}
          setSelectedHeight={setSelectedHeight}
          selectedBodyType={selectedBodyType}
          setSelectedBodyType={setSelectedBodyType}
        />
      );
    
    case 'service':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.ServiceDetailPage
            catalogItems={catalogItems}
            reviews={reviews}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            selectedServiceId={selectedServiceId}
            setCurrentPage={setCurrentPage}
            setShowBookingModal={setShowBookingModal}
            setSelectedSellerId={setSelectedSellerId}
          />
        </Suspense>
      );
    
    case 'profile':
      return userRole ? (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.ProfilePage 
            profile={profile} 
            onProfileUpdate={onProfileUpdate} 
            setCurrentPage={setCurrentPage}
            wallet={wallet}
            setWallet={setWallet}
            transactions={walletTransactions}
            setTransactions={setWalletTransactions}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.RegisterPage setUserRole={setUserRole} setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'register':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.RegisterPage setUserRole={setUserRole} setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'login':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.LoginPage setUserRole={setUserRole} setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'search':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.SearchPage setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'favorites':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.FavoritesPage
            catalogItems={catalogItems}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setSelectedServiceId={setSelectedServiceId}
            setCurrentPage={setCurrentPage}
          />
        </Suspense>
      );
    
    case 'messages':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.MessagesPage setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'rules':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.RulesPage setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'work':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.WorkPage setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'admin':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.AdminPage setCurrentPage={setCurrentPage} onAddNotification={addNotification || (() => {})} />
        </Suspense>
      );
    
    case 'referral':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.ReferralPage setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'raffle':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.RafflePage setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'dating':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.DatingPage setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'wallet':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.WalletPage setCurrentPage={setCurrentPage} wallet={wallet} onOpenLovePurchase={onOpenLovePurchase} />
        </Suspense>
      );
    
    case 'category':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.CategoryProvidersPage categoryId={selectedCategory} setCurrentPage={setCurrentPage} bookings={bookings} setBookings={setBookings} />
        </Suspense>
      );
    
    case 'invitations':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.InvitationsPage setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'seller-profile':
      const seller = sellerProfiles.find(s => s.id === selectedSellerId);
      return seller ? (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.SellerProfilePage seller={seller} setCurrentPage={setCurrentPage} wallet={wallet} />
        </Suspense>
      ) : (
        <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} profile={profile} onPremiumRequired={onPremiumRequired} catalogItems={catalogItems} favorites={favorites} toggleFavorite={toggleFavorite} setSelectedServiceId={setSelectedServiceId} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} priceRange={priceRange} setPriceRange={setPriceRange} sortBy={sortBy} setSortBy={setSortBy} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} selectedAge={selectedAge} setSelectedAge={setSelectedAge} selectedHeight={selectedHeight} setSelectedHeight={setSelectedHeight} selectedBodyType={selectedBodyType} setSelectedBodyType={setSelectedBodyType} />
      );
    
    case 'online-search':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.OnlineSearchPage setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'parties':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.PartiesPage 
            onPartyClick={(id) => {
              setSelectedPartyId?.(id);
              setCurrentPage('party-detail');
            }}
            currentUserId={1}
            onOrganizerDashboard={() => setCurrentPage('organizer-dashboard')}
            setCurrentPage={setCurrentPage}
          />
        </Suspense>
      );
    
    case 'party-detail':
      return selectedPartyId ? (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.PartyDetailPage 
            partyId={selectedPartyId}
            currentUserId={1}
            onBack={() => setCurrentPage('parties')}
            onStartChat={(applicationId) => {
              setSelectedApplicationId?.(applicationId);
              setCurrentPage('party-chat');
            }}
            onNotificationAdd={onNotificationAdd}
          />
        </Suspense>
      ) : (
        <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} profile={profile} onPremiumRequired={onPremiumRequired} catalogItems={catalogItems} favorites={favorites} toggleFavorite={toggleFavorite} setSelectedServiceId={setSelectedServiceId} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} priceRange={priceRange} setPriceRange={setPriceRange} sortBy={sortBy} setSortBy={setSortBy} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} selectedAge={selectedAge} setSelectedAge={setSelectedAge} selectedHeight={selectedHeight} setSelectedHeight={setSelectedHeight} selectedBodyType={selectedBodyType} setSelectedBodyType={setSelectedBodyType} />
      );
    
    case 'party-chat':
      return selectedApplicationId ? (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.PartyChatPage 
            applicationId={selectedApplicationId}
            currentUserId={1}
            isOrganizer={false}
            onBack={() => setCurrentPage('party-detail')}
          />
        </Suspense>
      ) : (
        <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} profile={profile} onPremiumRequired={onPremiumRequired} catalogItems={catalogItems} favorites={favorites} toggleFavorite={toggleFavorite} setSelectedServiceId={setSelectedServiceId} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} priceRange={priceRange} setPriceRange={setPriceRange} sortBy={sortBy} setSortBy={setSortBy} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} selectedAge={selectedAge} setSelectedAge={setSelectedAge} selectedHeight={selectedHeight} setSelectedHeight={setSelectedHeight} selectedBodyType={selectedBodyType} setSelectedBodyType={setSelectedBodyType} />
      );
    
    case 'my-ads':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.MyAdsPage profile={profile} setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'user-guide':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.UserGuidePage setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    case 'organizer-dashboard':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.OrganizerDashboard 
            organizerId={1}
            onBack={() => setCurrentPage('parties')}
            onViewParty={(id) => {
              setSelectedPartyId?.(id);
              setCurrentPage('party-detail');
            }}
            onOpenChat={(applicationId) => {
              setSelectedApplicationId?.(applicationId);
              setCurrentPage('party-chat');
            }}
          />
        </Suspense>
      );
    
    case 'bookings':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.BookingsPage setCurrentPage={setCurrentPage} userRole={userRole} bookings={bookings} setBookings={setBookings} />
        </Suspense>
      );
    
    case 'my-orders':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.MyOrdersPage 
            setCurrentPage={setCurrentPage} 
            bookings={bookings}
            orderChats={orderChats}
            setOrderChats={setOrderChats}
            setSelectedOrderChatId={setSelectedOrderChatId}
            currentUserId={1}
          />
        </Suspense>
      );
    
    case 'order-chat':
      return selectedOrderChatId ? (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.OrderChatPage
            chatId={selectedOrderChatId}
            setCurrentPage={setCurrentPage}
            orderChats={orderChats}
            setOrderChats={setOrderChats}
            bookings={bookings}
            currentUserId={1}
          />
        </Suspense>
      ) : (
        <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} profile={profile} onPremiumRequired={onPremiumRequired} catalogItems={catalogItems} favorites={favorites} toggleFavorite={toggleFavorite} setSelectedServiceId={setSelectedServiceId} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} priceRange={priceRange} setPriceRange={setPriceRange} sortBy={sortBy} setSortBy={setSortBy} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} selectedAge={selectedAge} setSelectedAge={setSelectedAge} selectedHeight={selectedHeight} setSelectedHeight={setSelectedHeight} selectedBodyType={selectedBodyType} setSelectedBodyType={setSelectedBodyType} />
      );
    
    case 'swipe':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.SwipePage onMatch={(id) => onNotificationAdd?.({ 
            id: Date.now(), 
            type: 'message', 
            message: 'У вас новое совпадение! 💕', 
            time: 'Только что', 
            read: false 
          })} />
        </Suspense>
      );
    
    case 'premium':
      setCurrentPage('home');
      onPremiumRequired?.();
      return <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} profile={profile} onPremiumRequired={onPremiumRequired} catalogItems={catalogItems} favorites={favorites} toggleFavorite={toggleFavorite} setSelectedServiceId={setSelectedServiceId} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} priceRange={priceRange} setPriceRange={setPriceRange} sortBy={sortBy} setSortBy={setSortBy} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} selectedAge={selectedAge} setSelectedAge={setSelectedAge} selectedHeight={selectedHeight} setSelectedHeight={setSelectedHeight} selectedBodyType={selectedBodyType} setSelectedBodyType={setSelectedBodyType} />;
    
    case 'matches':
      return (
        <Suspense fallback={<LoadingFallback />}>
          <Pages.MatchesPage setCurrentPage={setCurrentPage} />
        </Suspense>
      );
    
    default:
      return <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} profile={profile} onPremiumRequired={onPremiumRequired} catalogItems={catalogItems} favorites={favorites} toggleFavorite={toggleFavorite} setSelectedServiceId={setSelectedServiceId} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} priceRange={priceRange} setPriceRange={setPriceRange} sortBy={sortBy} setSortBy={setSortBy} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} selectedAge={selectedAge} setSelectedAge={setSelectedAge} selectedHeight={selectedHeight} setSelectedHeight={setSelectedHeight} selectedBodyType={selectedBodyType} setSelectedBodyType={setSelectedBodyType} />;
  }
};
