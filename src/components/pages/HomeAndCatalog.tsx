import { useMemo, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Page, CatalogItem, UserRole, UserAd, Profile } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { HomeHeroSection } from './home/HomeHeroSection';
import { HomeCategoriesSection } from './home/HomeCategoriesSection';
import { HomeSolutionsSection } from './home/HomeSolutionsSection';
import { WeeklyRaffleBanner } from './home/WeeklyRaffleBanner';
import { DatingBanner } from './home/DatingBanner';
import { AgencyBanner } from './home/AgencyBanner';
import { MobileHomePage } from './home/MobileHomePage';
import { CatalogFilters } from './catalog/CatalogFilters';
import { CatalogGrid } from './catalog/CatalogGrid';
import { AdRequestCard } from './catalog/AdRequestCard';
import { BusinessServiceCard } from './catalog/BusinessServiceCard';
import { getFilteredAndSortedItems } from './catalog/catalogUtils';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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

export const HomePage = ({ 
  setCurrentPage, 
  userRole, 
  setSelectedCategory, 
  profile, 
  onPremiumRequired,
  catalogItems,
  favorites,
  toggleFavorite,
  setSelectedServiceId,
  searchQuery,
  setSearchQuery,
  selectedCategory,
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
}: { 
  setCurrentPage: (page: Page) => void; 
  userRole?: UserRole; 
  setSelectedCategory: (categoryId: string) => void; 
  profile: Profile; 
  onPremiumRequired?: () => void;
  catalogItems: CatalogItem[];
  favorites: number[];
  toggleFavorite: (id: number) => void;
  setSelectedServiceId: (id: number | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
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
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <MobileHomePage
        setCurrentPage={setCurrentPage}
        catalogItems={catalogItems}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        setSelectedServiceId={setSelectedServiceId}
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
  }

  return (
    <div className="animate-fade-in">
      <HomeHeroSection setCurrentPage={setCurrentPage} userRole={userRole} />
      <HomeCategoriesSection setCurrentPage={setCurrentPage} setSelectedCategory={setSelectedCategory} />
      <HomeSolutionsSection />
      <WeeklyRaffleBanner setCurrentPage={setCurrentPage} />
      <DatingBanner setCurrentPage={setCurrentPage} />
      <AgencyBanner setCurrentPage={setCurrentPage} profile={profile} onPremiumRequired={onPremiumRequired} />
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
  const { isLoading } = useCatalog();
  const { businessServices } = useBusinessServices();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'profiles' | 'business' | 'requests'>('profiles');
  
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

  // Фильтруем активные бизнес-услуги
  const activeBusinessServices = useMemo(() => {
    return businessServices.filter(service => service.status === 'active');
  }, [businessServices]);

  const handleContactService = (serviceId: string) => {
    toast({
      title: 'Функция в разработке',
      description: 'Скоро вы сможете связаться с поставщиком услуг',
    });
  };
  
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

      {/* Переключатель между разными типами объявлений */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <Button
          onClick={() => setViewMode('profiles')}
          variant={viewMode === 'profiles' ? 'default' : 'outline'}
          className="gap-2"
        >
          <Icon name="Grid3x3" size={18} />
          Анкеты ({filteredItems.length})
        </Button>
        <Button
          onClick={() => setViewMode('business')}
          variant={viewMode === 'business' ? 'default' : 'outline'}
          className="gap-2"
        >
          <Icon name="Briefcase" size={18} />
          Услуги ({activeBusinessServices.length})
        </Button>
        <Button
          onClick={() => setViewMode('requests')}
          variant={viewMode === 'requests' ? 'default' : 'outline'}
          className="gap-2"
        >
          <Icon name="Search" size={18} />
          Запросы ({filteredAds.length})
        </Button>
      </div>

      {/* Контент */}
      {viewMode === 'profiles' && (
        <CatalogGrid
          filteredItems={filteredItems}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          setSelectedServiceId={setSelectedServiceId}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
        />
      )}

      {viewMode === 'business' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeBusinessServices.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-600/10 flex items-center justify-center">
                <Icon name="Briefcase" size={48} className="text-pink-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Пока нет бизнес-услуг</h3>
              <p className="text-muted-foreground">Бизнес-пользователи могут добавить свои услуги в каталог</p>
            </div>
          ) : (
            activeBusinessServices.map((service, index) => (
              <BusinessServiceCard
                key={service.id}
                service={service}
                index={index}
                onContact={handleContactService}
              />
            ))
          )}
        </div>
      )}

      {viewMode === 'requests' && (
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