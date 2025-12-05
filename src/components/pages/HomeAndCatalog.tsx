import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Page, CatalogItem, UserRole } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { HomeHeroSection } from './home/HomeHeroSection';
import { HomeCategoriesSection } from './home/HomeCategoriesSection';
import { HomeAdvantagesSection } from './home/HomeAdvantagesSection';
import { WeeklyRaffleBanner } from './home/WeeklyRaffleBanner';
import { DatingBanner } from './home/DatingBanner';
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

export const HomePage = ({ setCurrentPage, userRole, setSelectedCategory }: { setCurrentPage: (page: Page) => void; userRole?: UserRole; setSelectedCategory: (categoryId: string) => void }) => {
  return (
    <div className="animate-fade-in">
      <HomeHeroSection setCurrentPage={setCurrentPage} userRole={userRole} />
      <WeeklyRaffleBanner setCurrentPage={setCurrentPage} />
      <DatingBanner setCurrentPage={setCurrentPage} />
      <HomeCategoriesSection setCurrentPage={setCurrentPage} setSelectedCategory={setSelectedCategory} />
      <HomeAdvantagesSection />
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
  
  const filteredItems = useMemo(() => {
    return getFilteredAndSortedItems(
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
  }, [catalogItems, searchQuery, selectedCategory, priceRange, sortBy, selectedCountry, selectedLocation, selectedAge, selectedHeight, selectedBodyType]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-wide mx-auto px-4 py-12 animate-fade-in">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-6xl font-bold">
            <span className="gold-shimmer">{t.catalog.title}</span>
          </h1>
          <Input 
            placeholder={t.catalog.search} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 h-12 bg-card/80 backdrop-blur-sm border-border focus:border-primary shadow-lg"
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