import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Page, CatalogItem, UserRole, UserAd, Profile } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { HomeHeroSection } from './home/HomeHeroSection';
import { HomeCategoriesSection } from './home/HomeCategoriesSection';
import { HomeAdvantagesSection } from './home/HomeAdvantagesSection';
import { WeeklyRaffleBanner } from './home/WeeklyRaffleBanner';
import { DatingBanner } from './home/DatingBanner';
import { AgencyBanner } from './home/AgencyBanner';
import { CatalogFilters } from './catalog/CatalogFilters';
import { CatalogGrid } from './catalog/CatalogGrid';
import { AdRequestCard } from './catalog/AdRequestCard';
import { getFilteredAndSortedItems } from './catalog/catalogUtils';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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

export const HomePage = ({ setCurrentPage, userRole, setSelectedCategory, profile }: { setCurrentPage: (page: Page) => void; userRole?: UserRole; setSelectedCategory: (categoryId: string) => void; profile: Profile }) => {
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
  userRole,
}: HomeAndCatalogProps) => {
  const { t } = useLanguage();
  const [showAds, setShowAds] = useState(false);
  
  // Моковые данные запросов мужчин
  const [userAds] = useState<UserAd[]>([
    {
      id: 1,
      authorId: 10,
      authorName: 'Дмитрий',
      authorAvatar: '/avatars/user1.jpg',
      authorRole: 'buyer',
      type: 'service_request',
      category: 'Классика',
      title: 'Ищу девушку для классического свидания',
      description: 'Хочу встретиться с девушкой для приятного вечера в ресторане и дальнейшего продолжения. Гарантирую уважительное отношение и щедрость.',
      price: 15000,
      currency: 'RUB',
      duration: 3,
      lookingFor: 'Девушка 22-30 лет, стройная, с приятной внешностью. Желательно опыт эскорта.',
      status: 'active',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      authorId: 11,
      authorName: 'Александр',
      authorAvatar: '/avatars/user2.jpg',
      authorRole: 'buyer',
      type: 'service_request',
      category: 'Массаж',
      title: 'Нужен расслабляющий массаж с продолжением',
      description: 'Ищу девушку для качественного массажа и приятного времяпрепровождения. Выезд в мой номер отеля.',
      price: 8000,
      currency: 'RUB',
      duration: 2,
      lookingFor: 'Девушка с опытом массажа, 20-28 лет, привлекательная.',
      status: 'active',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      authorId: 12,
      authorName: 'Михаил',
      authorAvatar: '/avatars/user3.jpg',
      authorRole: 'buyer',
      type: 'service_request',
      category: 'Вечеринка',
      title: 'Ищу девушку для корпоратива',
      description: 'Нужна девушка для сопровождения на корпоративном мероприятии. Вечер в приятной компании, ужин, развлечения.',
      price: 20000,
      currency: 'RUB',
      duration: 4,
      lookingFor: 'Девушка 23-32 года, элегантная, умеющая поддержать беседу. Опыт эскорта обязателен.',
      status: 'active',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    }
  ]);
  
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
  
  const filteredAds = useMemo(() => {
    return userAds.filter(ad => {
      // Фильтр по полу: мужчины видят объявления девушек, девушки видят объявления мужчин
      // Исключение: категория "Вечеринка" видна всем
      if (ad.category !== 'Вечеринка') {
        if (userRole === 'buyer' && ad.authorRole === 'buyer') {
          return false; // Мужчины не видят объявления мужчин
        }
        if (userRole === 'seller' && ad.authorRole === 'seller') {
          return false; // Девушки не видят объявления девушек
        }
      }
      
      if (selectedCategory && selectedCategory !== 'all' && ad.category !== selectedCategory) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return ad.title.toLowerCase().includes(query) || 
               ad.description.toLowerCase().includes(query) ||
               (ad.lookingFor && ad.lookingFor.toLowerCase().includes(query));
      }
      return true;
    });
  }, [userAds, selectedCategory, searchQuery, userRole]);
  
  const canRespond = userRole === 'seller';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-wide mx-auto px-4 py-12 animate-fade-in">
        <div className="flex items-center justify-end mb-12">
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

      {/* Переключатель между услугами и запросами */}
      <div className="flex gap-3 mb-8">
        <Button
          onClick={() => setShowAds(false)}
          variant={!showAds ? 'default' : 'outline'}
          className="flex-1 gap-2"
        >
          <Icon name="Briefcase" size={18} />
          Услуги девушек ({filteredItems.length})
        </Button>
        <Button
          onClick={() => setShowAds(true)}
          variant={showAds ? 'default' : 'outline'}
          className="flex-1 gap-2"
        >
          <Icon name="Search" size={18} />
          Запросы мужчин ({filteredAds.length})
        </Button>
      </div>

      {/* Контент */}
      {!showAds ? (
        <CatalogGrid
          filteredItems={filteredItems}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          setSelectedServiceId={setSelectedServiceId}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad, index) => (
            <AdRequestCard
              key={ad.id}
              ad={ad}
              canRespond={canRespond}
              index={index}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
};