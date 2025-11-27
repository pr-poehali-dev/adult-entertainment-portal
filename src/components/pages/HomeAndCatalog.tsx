import { Input } from '@/components/ui/input';
import { Page, CatalogItem } from '@/types';
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
}

export const HomePage = ({ setCurrentPage }: { setCurrentPage: (page: Page) => void }) => {
  return (
    <div className="animate-fade-in">
      <HomeHeroSection setCurrentPage={setCurrentPage} />
      <HomeCategoriesSection />
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
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-bold text-primary">{t.catalog.title}</h1>
        <Input 
          placeholder={t.catalog.search} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 bg-background border-border"
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
  );
};
