import MessagesPage from '@/components/MessagesPage';
import { HomePage, CatalogPage } from '@/components/pages/HomeAndCatalog';
import { ServiceDetailPage } from '@/components/pages/ServiceDetail';
import { SellerProfilePage } from '@/components/pages/SellerProfile';
import { RegisterPage, ProfilePage, SearchPage, FavoritesPage, RulesPage } from '@/components/pages/UserPages';
import { Page, Profile, CatalogItem, Review, UserRole } from '@/types';
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
}: AppPagesProps) => {
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      
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
        );
      
      case 'profile':
        return userRole ? (
          <ProfilePage profile={profile} />
        ) : (
          <RegisterPage setUserRole={setUserRole} setCurrentPage={setCurrentPage} />
        );
      
      case 'register':
        return <RegisterPage setUserRole={setUserRole} setCurrentPage={setCurrentPage} />;
      
      case 'search':
        return <SearchPage />;
      
      case 'favorites':
        return (
          <FavoritesPage
            catalogItems={catalogItems}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setSelectedServiceId={setSelectedServiceId}
            setCurrentPage={setCurrentPage}
            profile={profile}
            setUserRole={setUserRole}
          />
        );
      
      case 'messages':
        return <MessagesPage />;
      
      case 'rules':
        return <RulesPage />;
      
      case 'seller-profile':
        const seller = sellerProfiles.find(s => s.id === selectedSellerId);
        return seller ? (
          <SellerProfilePage seller={seller} setCurrentPage={setCurrentPage} />
        ) : (
          <HomePage setCurrentPage={setCurrentPage} />
        );
      
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return { renderPage };
};