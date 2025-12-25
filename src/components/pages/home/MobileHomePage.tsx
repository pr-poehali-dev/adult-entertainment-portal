import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { serviceCategories, getCategoryName } from '@/data/serviceCategories';
import { useLanguage } from '@/contexts/LanguageContext';
import { Page, CatalogItem } from '@/types';
import { CatalogGrid } from '../catalog/CatalogGrid';
import { CatalogFilters } from '../catalog/CatalogFilters';
import { getFilteredAndSortedItems } from '../catalog/catalogUtils';
import { Button } from '@/components/ui/button';

interface MobileHomePageProps {
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

export const MobileHomePage = ({
  setCurrentPage,
  catalogItems,
  favorites,
  toggleFavorite,
  setSelectedServiceId,
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
}: MobileHomePageProps) => {
  const { language } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  // Проверяем, используются ли фильтры
  const hasActiveFilters = useMemo(() => {
    return searchQuery !== '' ||
           selectedCategory !== 'all' ||
           priceRange !== 'all' ||
           selectedCountry !== 'all' ||
           selectedLocation !== 'all' ||
           selectedAge !== 'all' ||
           selectedHeight !== 'all' ||
           selectedBodyType !== 'all';
  }, [searchQuery, selectedCategory, priceRange, selectedCountry, selectedLocation, selectedAge, selectedHeight, selectedBodyType]);

  // Фильтруем анкеты
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

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('rating');
    setSelectedCountry('all');
    setSelectedLocation('all');
    setSelectedAge('all');
    setSelectedHeight('all');
    setSelectedBodyType('all');
    setShowFilters(false);
  };

  // Если фильтры активны - показываем анкеты
  if (hasActiveFilters) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background pb-20">
        <div className="max-w-wide mx-auto px-4 py-6 animate-fade-in">
          {/* Кнопка сброса фильтров */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Результаты поиска</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="flex items-center gap-2"
            >
              <Icon name="X" size={16} />
              Сбросить
            </Button>
          </div>

          {/* Фильтры */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Icon name="SlidersHorizontal" size={18} />
              Фильтры
              {hasActiveFilters && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  активны
                </span>
              )}
            </Button>
            
            {showFilters && (
              <div className="mt-4">
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
              </div>
            )}
          </div>

          {/* Сетка с анкетами */}
          <CatalogGrid
            items={filteredItems}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onServiceClick={(id) => {
              setSelectedServiceId(id);
              setCurrentPage('service');
            }}
          />

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">
                Нет результатов по вашим фильтрам
              </p>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="mt-4"
              >
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Без фильтров - показываем категории
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background pb-20">
      <div className="max-w-wide mx-auto px-4 py-6 animate-fade-in">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">
            <span className="gold-shimmer">Категории Услуг</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Выберите категорию для просмотра анкет
          </p>
        </div>

        {/* Кнопка фильтров */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Icon name="SlidersHorizontal" size={18} />
            Открыть фильтры поиска
          </Button>

          {showFilters && (
            <div className="mt-4">
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
            </div>
          )}
        </div>

        {/* Приватные вечеринки */}
        <Card
          onClick={() => setCurrentPage('parties')}
          className="mb-6 cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-primary/20"
        >
          <div className="relative h-40 overflow-hidden">
            <img
              src="https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg"
              alt="Приватные вечеринки"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <CardTitle className="text-xl text-white font-bold flex items-center gap-2">
                <Icon name="PartyPopper" size={24} />
                Приватные вечеринки
              </CardTitle>
            </div>
          </div>
        </Card>

        {/* Категории услуг */}
        <div className="space-y-4">
          {serviceCategories.map((category) => (
            <Card
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={category.image}
                  alt={getCategoryName(category.id, language)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <CardTitle className="text-xl text-white font-bold">
                    {getCategoryName(category.id, language)}
                  </CardTitle>
                  <Icon name="ChevronRight" size={24} className="text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
