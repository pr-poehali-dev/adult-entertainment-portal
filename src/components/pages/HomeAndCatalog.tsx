import { Input } from '@/components/ui/input';
import { Page, CatalogItem, UserRole } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { HomeHeroSection } from './home/HomeHeroSection';
import { HomeCategoriesSection } from './home/HomeCategoriesSection';
import { HomeAdvantagesSection } from './home/HomeAdvantagesSection';
import { CatalogFilters } from './catalog/CatalogFilters';
import { CatalogGrid } from './catalog/CatalogGrid';
import { getFilteredAndSortedItems } from './catalog/catalogUtils';

interface HomeAndCatalogProps {
  setCurrentPage: (page: Page) => void;
  catalogItems: CatalogItem[];
  favorites: number[];
  toggleFavorite: (id: number) => void;
  setSelectedServiceId: (id: number | null) => void;
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
  userRole?: UserRole;
}

export const HomePage = ({ setCurrentPage, userRole }: { setCurrentPage: (page: Page) => void; userRole?: UserRole }) => {
  return (
    <div className="animate-fade-in">
      <HomeHeroSection setCurrentPage={setCurrentPage} userRole={userRole} />
      <HomeCategoriesSection />
      <HomeAdvantagesSection />
      
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50">
        <button
          onClick={() => setCurrentPage('admin')}
          className="group relative bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-4 md:px-6 py-3 md:py-4 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-110 flex items-center gap-2 md:gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
          </svg>
          <span className="font-semibold text-sm md:text-base">Админ-панель</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </button>
        
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-card border border-border rounded-lg shadow-xl p-3 whitespace-nowrap">
            <p className="text-sm font-medium">Быстрый доступ к управлению</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CatalogPage = ({
  catalogItems,
  favorites,
  toggleFavorite,
  setSelectedServiceId,
  setCurrentPage,
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
}: HomeAndCatalogProps) => {
  const { t } = useLanguage();
  const filteredItems = getFilteredAndSortedItems(
    catalogItems, 
    searchQuery, 
    selectedCategory, 
    priceRange, 
    sortBy, 
    selectedCountry, 
    selectedLocation, 
    selectedAge, 
    selectedHeight, 
    selectedBodyType
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12 animate-fade-in">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-6xl font-bold">
            <span className="gold-shimmer">{t.catalog.title}</span>
          </h1>
          <Input 
            placeholder={t.catalog.search} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 h-12 bg-card/80 backdrop-blur-sm border-border focus:border-primary shadow-lg"
          />
        </div>
      
      <CatalogFilters
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

      <CatalogGrid
        filteredItems={filteredItems}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        setSelectedServiceId={setSelectedServiceId}
        setCurrentPage={setCurrentPage}
      />
      </div>
    </div>
  );
};