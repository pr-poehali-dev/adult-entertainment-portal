import { lazy, Suspense } from 'react';
import { HomePage, CatalogPage } from '@/components/pages/HomeAndCatalog';

const MessagesPage = lazy(() => import('@/components/MessagesPage'));
const ServiceDetailPage = lazy(() => import('@/components/pages/ServiceDetail').then(m => ({ default: m.ServiceDetailPage })));
const SellerProfilePage = lazy(() => import('@/components/pages/SellerProfile').then(m => ({ default: m.SellerProfilePage })));
const RegisterPage = lazy(() => import('@/components/pages/UserPages').then(m => ({ default: m.RegisterPage })));
const ProfilePage = lazy(() => import('@/components/pages/UserPages').then(m => ({ default: m.ProfilePage })));
const SearchPage = lazy(() => import('@/components/pages/UserPages').then(m => ({ default: m.SearchPage })));
const FavoritesPage = lazy(() => import('@/components/pages/UserPages').then(m => ({ default: m.FavoritesPage })));
const RulesPage = lazy(() => import('@/components/pages/UserPages').then(m => ({ default: m.RulesPage })));
const LoginPage = lazy(() => import('@/components/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const WorkPage = lazy(() => import('@/components/pages/work/WorkPage').then(m => ({ default: m.WorkPage })));
const AdminPage = lazy(() => import('@/components/pages/admin/AdminPage').then(m => ({ default: m.AdminPage })));
const ReferralPage = lazy(() => import('@/components/pages/referral/ReferralPage').then(m => ({ default: m.ReferralPage })));
const CategoryProvidersPage = lazy(() => import('@/components/pages/category/CategoryProvidersPage').then(m => ({ default: m.CategoryProvidersPage })));
const InvitationsPage = lazy(() => import('@/components/pages/invitations/InvitationsPage').then(m => ({ default: m.InvitationsPage })));
const RafflePage = lazy(() => import('@/components/pages/RafflePage').then(m => ({ default: m.RafflePage })));
const DatingPage = lazy(() => import('@/components/pages/DatingPage').then(m => ({ default: m.DatingPage })));
const WalletPage = lazy(() => import('@/components/pages/WalletPage').then(m => ({ default: m.WalletPage })));
const OnlineSearchPage = lazy(() => import('@/components/pages/OnlineSearchPage').then(m => ({ default: m.OnlineSearchPage })));
const PartiesPage = lazy(() => import('@/components/parties/PartiesPage'));
const PartyDetailPage = lazy(() => import('@/components/parties/PartyDetailPage'));
const PartyChatPage = lazy(() => import('@/components/parties/PartyChatPage'));
const OrganizerDashboard = lazy(() => import('@/components/parties/OrganizerDashboard'));
const MyAdsPage = lazy(() => import('@/components/pages/my-ads/MyAdsPage'));
const UserGuidePage = lazy(() => import('@/components/pages/UserGuidePage'));
const BookingsPage = lazy(() => import('@/components/pages/BookingsPage').then(m => ({ default: m.BookingsPage })));
const MyOrdersPage = lazy(() => import('@/components/pages/MyOrdersPage').then(m => ({ default: m.MyOrdersPage })));
const OrderChatPage = lazy(() => import('@/components/pages/order-chat/OrderChatPage').then(m => ({ default: m.OrderChatPage })));
const SwipePage = lazy(() => import('@/components/pages/SwipePage'));
import { Page, Profile, CatalogItem, Review, UserRole, Wallet, Notification } from '@/types';
import { sellerProfiles } from '@/data/sellerProfiles';

interface AppPagesProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  profile: Profile;
  catalogItems: CatalogItem[];
  reviews: Review[];
  favorites: number[];
  toggleFavorite: (id: number) => void;
  selectedServiceId: number | null;
  setSelectedServiceId: (id: number | null) => void;
  setShowBookingModal: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedAge: string;
  setSelectedAge: (age: string) => void;
  selectedHeight: string;
  setSelectedHeight: (height: string) => void;
  selectedBodyType: string;
  setSelectedBodyType: (bodyType: string) => void;
  selectedSellerId: number | null;
  setSelectedSellerId: (id: number | null) => void;
  onProfileUpdate?: (updatedProfile: Partial<Profile>) => void;
  wallet: Wallet;
  selectedPartyId?: number | null;
  setSelectedPartyId?: (id: number | null) => void;
  selectedApplicationId?: number | null;
  setSelectedApplicationId?: (id: number | null) => void;
  onNotificationAdd?: (notification: Notification) => void;
  onOpenLovePurchase?: () => void;
  onPremiumRequired?: () => void;
  bookings: any[];
  setBookings: (bookings: any[]) => void;
  orderChats: any[];
  setOrderChats: (chats: any[]) => void;
  selectedOrderChatId: number | null;
  setSelectedOrderChatId: (id: number | null) => void;
}

export const useAppPages = ({
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
  selectedPartyId,
  setSelectedPartyId,
  selectedApplicationId,
  setSelectedApplicationId,
  onNotificationAdd,
  onOpenLovePurchase,
  onPremiumRequired,
  bookings,
  setBookings,
  orderChats,
  setOrderChats,
  selectedOrderChatId,
  setSelectedOrderChatId,
}: AppPagesProps) => {
  
  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} profile={profile} onPremiumRequired={onPremiumRequired} />;
      
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
            <ServiceDetailPage
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
            <ProfilePage profile={profile} onProfileUpdate={onProfileUpdate} setCurrentPage={setCurrentPage} />
          </Suspense>
        ) : (
          <Suspense fallback={<LoadingFallback />}>
            <RegisterPage setUserRole={setUserRole} setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'register':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <RegisterPage setUserRole={setUserRole} setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'login':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <LoginPage setUserRole={setUserRole} setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'search':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SearchPage setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'favorites':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <FavoritesPage
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
            <MessagesPage setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'rules':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <RulesPage setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'work':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <WorkPage setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'admin':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AdminPage setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'referral':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ReferralPage setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'raffle':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <RafflePage setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'dating':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DatingPage setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'wallet':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <WalletPage setCurrentPage={setCurrentPage} wallet={wallet} onOpenLovePurchase={onOpenLovePurchase} />
          </Suspense>
        );
      
      case 'category':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <CategoryProvidersPage categoryId={selectedCategory} setCurrentPage={setCurrentPage} bookings={bookings} setBookings={setBookings} />
          </Suspense>
        );
      
      case 'invitations':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <InvitationsPage setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'seller-profile':
        const seller = sellerProfiles.find(s => s.id === selectedSellerId);
        return seller ? (
          <Suspense fallback={<LoadingFallback />}>
            <SellerProfilePage seller={seller} setCurrentPage={setCurrentPage} wallet={wallet} />
          </Suspense>
        ) : (
          <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} />
        );
      
      case 'online-search':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <OnlineSearchPage setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'parties':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PartiesPage 
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
            <PartyDetailPage 
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
          <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} />
        );
      
      case 'party-chat':
        return selectedApplicationId ? (
          <Suspense fallback={<LoadingFallback />}>
            <PartyChatPage 
              applicationId={selectedApplicationId}
              currentUserId={1}
              isOrganizer={false}
              onBack={() => setCurrentPage('party-detail')}
            />
          </Suspense>
        ) : (
          <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} />
        );
      
      case 'my-ads':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MyAdsPage profile={profile} setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'user-guide':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UserGuidePage setCurrentPage={setCurrentPage} />
          </Suspense>
        );
      
      case 'organizer-dashboard':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <OrganizerDashboard 
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
            <BookingsPage setCurrentPage={setCurrentPage} userRole={userRole} bookings={bookings} setBookings={setBookings} />
          </Suspense>
        );
      
      case 'my-orders':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <MyOrdersPage 
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
            <OrderChatPage
              chatId={selectedOrderChatId}
              setCurrentPage={setCurrentPage}
              orderChats={orderChats}
              setOrderChats={setOrderChats}
              bookings={bookings}
              currentUserId={1}
            />
          </Suspense>
        ) : (
          <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} />
        );
      
      case 'swipe':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SwipePage onMatch={(id) => onNotificationAdd?.({ 
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
        return <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} profile={profile} onPremiumRequired={onPremiumRequired} />;
      
      default:
        return <HomePage setCurrentPage={setCurrentPage} userRole={userRole} setSelectedCategory={setSelectedCategory} />;
    }
  };

  return { renderPage };
};