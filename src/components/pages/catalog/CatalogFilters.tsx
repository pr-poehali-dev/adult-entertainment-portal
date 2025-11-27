import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { serviceCategories, getCategoryName, getSubcategoryName } from '@/data/serviceCategories';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCitiesByCountry } from './catalogUtils';

interface CatalogFiltersProps {
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

export const CatalogFilters = ({
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
}: CatalogFiltersProps) => {
  const { t, language } = useLanguage();
  const availableCities = selectedCountry === 'all' ? [] : getCitiesByCountry(selectedCountry);
  
  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('rating');
    setSelectedCountry('all');
    setSelectedLocation('all');
    setSelectedAge('all');
    setSelectedHeight('all');
    setSelectedBodyType('all');
  };

  return (
    <div className="mb-8 flex flex-wrap gap-4 items-center">
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-[200px] bg-background border-border">
          <SelectValue placeholder={t.catalog.category} />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          <SelectItem value="all">{t.catalog.allServices}</SelectItem>
          {serviceCategories.map(category => (
            <div key={category.id}>
              <SelectItem value={category.id} className="font-semibold">
                {getCategoryName(category.id, language)}
              </SelectItem>
              {category.subcategories.map(sub => (
                <SelectItem key={sub.id} value={sub.id} className="pl-6">
                  {getSubcategoryName(sub.id, language)}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={priceRange} onValueChange={setPriceRange}>
        <SelectTrigger className="w-[200px] bg-background border-border">
          <SelectValue placeholder={t.catalog.price} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.catalog.anyPrice}</SelectItem>
          <SelectItem value="low">До 15 000 ₽</SelectItem>
          <SelectItem value="mid">15 000 - 25 000 ₽</SelectItem>
          <SelectItem value="high">От 25 000 ₽</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[200px] bg-background border-border">
          <SelectValue placeholder={t.catalog.sortBy} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating">{t.catalog.sortByRating}</SelectItem>
          <SelectItem value="price-asc">{t.catalog.sortByPriceAsc}</SelectItem>
          <SelectItem value="price-desc">{t.catalog.sortByPriceDesc}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedCountry} onValueChange={(value) => {
        setSelectedCountry(value);
        setSelectedLocation('all');
      }}>
        <SelectTrigger className="w-[200px] bg-background border-border">
          <SelectValue placeholder={t.catalog.country} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.catalog.allCountries}</SelectItem>
          <SelectItem value="Россия">Россия</SelectItem>
          <SelectItem value="Казахстан">Казахстан</SelectItem>
          <SelectItem value="Беларусь">Беларусь</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedLocation} onValueChange={setSelectedLocation} disabled={selectedCountry === 'all'}>
        <SelectTrigger className="w-[200px] bg-background border-border">
          <SelectValue placeholder={t.catalog.city} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          <SelectItem value="all">{t.catalog.allCities}</SelectItem>
          {availableCities.map((city) => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedAge} onValueChange={setSelectedAge}>
        <SelectTrigger className="w-[200px] bg-background border-border">
          <SelectValue placeholder={t.catalog.age} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.catalog.anyAge}</SelectItem>
          <SelectItem value="18-25">18-25 лет</SelectItem>
          <SelectItem value="26-30">26-30 лет</SelectItem>
          <SelectItem value="31-35">31-35 лет</SelectItem>
          <SelectItem value="36+">36+ лет</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedHeight} onValueChange={setSelectedHeight}>
        <SelectTrigger className="w-[200px] bg-background border-border">
          <SelectValue placeholder={t.catalog.height} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.catalog.anyHeight}</SelectItem>
          <SelectItem value="160-165">160-165 см</SelectItem>
          <SelectItem value="166-170">166-170 см</SelectItem>
          <SelectItem value="171-175">171-175 см</SelectItem>
          <SelectItem value="176+">176+ см</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedBodyType} onValueChange={setSelectedBodyType}>
        <SelectTrigger className="w-[200px] bg-background border-border">
          <SelectValue placeholder={t.catalog.bodyType} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.catalog.anyBodyType}</SelectItem>
          <SelectItem value="Стройная">{t.catalog.bodyTypes.slim}</SelectItem>
          <SelectItem value="Спортивная">{t.catalog.bodyTypes.athletic}</SelectItem>
          <SelectItem value="Средняя">{t.catalog.bodyTypes.average}</SelectItem>
        </SelectContent>
      </Select>

      <Button 
        variant="outline"
        onClick={resetFilters}
        className="border-border hover:bg-accent"
      >
        {t.catalog.reset}
      </Button>
    </div>
  );
};
