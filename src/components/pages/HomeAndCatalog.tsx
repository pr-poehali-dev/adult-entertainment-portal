import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Page, CatalogItem } from '@/types';

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
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

export const HomePage = ({ setCurrentPage }: { setCurrentPage: (page: Page) => void }) => (
  <div className="animate-fade-in">
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent" />
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-primary animate-fade-in">
          Мир элитных<br />развлечений
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
          Премиальная платформа для взрослых. Конфиденциальность, безопасность и высочайший уровень сервиса
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{ animationDelay: '200ms' }}>
          <Button size="lg" onClick={() => setCurrentPage('catalog')} className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 transition-transform hover:scale-105">
            Посмотреть каталог
          </Button>
          <Button size="lg" variant="outline" onClick={() => setCurrentPage('register')} className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-transform hover:scale-105">
            Регистрация
          </Button>
        </div>
      </div>
    </section>

    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">Категории услуг</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['VIP сопровождение', 'Бизнес-встречи', 'Приватные мероприятия'].map((category, i) => (
            <Card 
              key={i} 
              className="group hover:scale-105 transition-all duration-300 cursor-pointer bg-card border-border hover:border-primary animate-slide-in-left"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardHeader>
                <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                  <Icon name="Sparkles" size={64} className="text-primary" />
                </div>
                <CardTitle className="text-2xl text-center">{category}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">Преимущества платформы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: 'Shield', title: 'Безопасность', desc: 'Проверенные профили' },
            { icon: 'Lock', title: 'Конфиденциальность', desc: 'Полная анонимность' },
            { icon: 'Star', title: 'Премиум сервис', desc: 'Высочайший уровень' },
            { icon: 'CheckCircle', title: 'Гарантии', desc: 'Защита сделок' }
          ].map((item, i) => (
            <div key={i} className="text-center animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name={item.icon as any} size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const getFilteredAndSortedItems = (
  catalogItems: CatalogItem[],
  searchQuery: string,
  selectedCategory: string,
  priceRange: string,
  sortBy: string,
  selectedLocation: string
) => {
  const filtered = catalogItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.seller.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
    
    const price = parseInt(item.price.replace(/\D/g, ''));
    let matchesPrice = true;
    if (priceRange === 'low') matchesPrice = price < 15000;
    else if (priceRange === 'mid') matchesPrice = price >= 15000 && price <= 25000;
    else if (priceRange === 'high') matchesPrice = price > 25000;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') {
      const priceA = parseInt(a.price.replace(/\D/g, ''));
      const priceB = parseInt(b.price.replace(/\D/g, ''));
      return priceA - priceB;
    }
    if (sortBy === 'price-desc') {
      const priceA = parseInt(a.price.replace(/\D/g, ''));
      const priceB = parseInt(b.price.replace(/\D/g, ''));
      return priceB - priceA;
    }
    return 0;
  });

  return filtered;
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
  selectedLocation,
  setSelectedLocation,
}: HomeAndCatalogProps) => {
  const filteredItems = getFilteredAndSortedItems(catalogItems, searchQuery, selectedCategory, priceRange, sortBy, selectedLocation);
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-bold text-primary">Каталог услуг</h1>
        <Input 
          placeholder="Поиск..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 bg-background border-border"
        />
      </div>
      
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px] bg-background border-border">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
            <SelectItem value="Премиум">Премиум</SelectItem>
            <SelectItem value="Стандарт">Стандарт</SelectItem>
            <SelectItem value="Бизнес">Бизнес</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="w-[200px] bg-background border-border">
            <SelectValue placeholder="Цена" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Любая цена</SelectItem>
            <SelectItem value="low">До 15 000 ₽</SelectItem>
            <SelectItem value="mid">15 000 - 25 000 ₽</SelectItem>
            <SelectItem value="high">От 25 000 ₽</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px] bg-background border-border">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">По рейтингу</SelectItem>
            <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
            <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-[200px] bg-background border-border">
            <SelectValue placeholder="Город" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все города</SelectItem>
            <SelectItem value="Москва">Москва</SelectItem>
            <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
            <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          className="border-border"
          onClick={() => {
            setSelectedCategory('all');
            setPriceRange('all');
            setSortBy('rating');
            setSearchQuery('');
            setSelectedLocation('all');
          }}
        >
          <Icon name="RotateCcw" className="mr-2" size={18} />
          Сбросить
        </Button>

        <div className="ml-auto text-sm text-muted-foreground">
          Найдено: {filteredItems.length} {filteredItems.length === 1 ? 'услуга' : 'услуг'}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <Card className="bg-card border-border p-12">
          <div className="text-center space-y-4">
            <Icon name="SearchX" size={64} className="mx-auto text-muted-foreground" />
            <h3 className="text-2xl font-semibold">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange('all');
                setSortBy('rating');
                setSearchQuery('');
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="group hover:scale-105 transition-all duration-300 bg-card border-border animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader>
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                  <Icon name="Image" size={64} className="text-muted-foreground" />
                  <button 
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                  >
                    <Icon 
                      name="Heart"
                      size={20} 
                      className={favorites.includes(item.id) ? "fill-red-500 text-red-500" : "text-foreground"}
                    />
                  </button>
                </div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-xl mb-1">{item.title}</CardTitle>
                    {item.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Icon name="MapPin" size={14} />
                        {item.location}
                      </div>
                    )}
                  </div>
                  {item.verified && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Icon name="CheckCircle" size={14} className="mr-1" />
                      Проверено
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Icon name="User" size={16} />
                    {item.seller}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Star" size={16} className="text-primary" />
                    {item.rating}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{item.price}</span>
                  <Button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => { setSelectedServiceId(item.id); setCurrentPage('service'); }}
                  >
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};