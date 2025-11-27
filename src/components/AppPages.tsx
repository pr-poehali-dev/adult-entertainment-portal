import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Page, Profile, CatalogItem, Review, UserRole } from '@/types';

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
}: AppPagesProps) => {
  
  const HomePage = () => (
    <div className="animate-fade-in">
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-primary">
            Мир элитных<br />развлечений
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Премиальная платформа для взрослых. Конфиденциальность, безопасность и высочайший уровень сервиса
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setCurrentPage('catalog')} className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
              Посмотреть каталог
            </Button>
            <Button size="lg" variant="outline" onClick={() => setCurrentPage('register')} className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
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
              <Card key={i} className="group hover:scale-105 transition-all duration-300 cursor-pointer bg-card border-border hover:border-primary">
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

  const getFilteredAndSortedItems = () => {
    const filtered = catalogItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.seller.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      const price = parseInt(item.price.replace(/\D/g, ''));
      let matchesPrice = true;
      if (priceRange === 'low') matchesPrice = price < 15000;
      else if (priceRange === 'mid') matchesPrice = price >= 15000 && price <= 25000;
      else if (priceRange === 'high') matchesPrice = price > 25000;
      
      return matchesSearch && matchesCategory && matchesPrice;
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

  const CatalogPage = () => {
    const filteredItems = getFilteredAndSortedItems();
    
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

          <Button 
            variant="outline" 
            className="border-border"
            onClick={() => {
              setSelectedCategory('all');
              setPriceRange('all');
              setSortBy('rating');
              setSearchQuery('');
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
            {filteredItems.map((item) => (
              <Card key={item.id} className="group hover:scale-105 transition-all duration-300 bg-card border-border">
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
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
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

  const ServiceDetailPage = () => {
    const service = catalogItems.find(item => item.id === selectedServiceId);
    
    if (!service) return <HomePage />;

    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentPage('catalog')}
          className="mb-6 text-primary hover:text-primary/80"
        >
          <Icon name="ArrowLeft" className="mr-2" size={20} />
          Назад к каталогу
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="relative h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                  <Icon name="Image" size={120} className="text-muted-foreground" />
                  <button 
                    onClick={() => toggleFavorite(service.id)}
                    className="absolute top-4 right-4 p-3 bg-background/80 rounded-full hover:bg-background transition-colors"
                  >
                    <Icon 
                      name="Heart"
                      size={24} 
                      className={favorites.includes(service.id) ? "fill-red-500 text-red-500" : "text-foreground"}
                    />
                  </button>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-4xl mb-2">{service.title}</CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="User" size={20} />
                        {service.seller}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Star" size={20} className="text-primary fill-primary" />
                        {service.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={20} />
                        {service.duration}
                      </span>
                    </div>
                  </div>
                  {service.verified && (
                    <Badge className="bg-primary text-primary-foreground text-base px-4 py-2">
                      <Icon name="CheckCircle" size={18} className="mr-2" />
                      Проверено
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Описание</h3>
                  <p className="text-foreground/80 leading-relaxed text-lg">{service.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-semibold mb-3">Что входит в услугу</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.features?.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-foreground/80">
                        <Icon name="CheckCircle" size={20} className="text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-2xl font-semibold mb-4">Отзывы клиентов</h3>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id} className="bg-muted/30 border-border">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {review.author[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">{review.author}</h4>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: review.rating }).map((_, i) => (
                                    <Icon key={i} name="Star" size={16} className="text-primary fill-primary" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{review.date}</p>
                              <p className="text-foreground/80">{review.text}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-24">
              <CardHeader>
                <CardTitle className="text-3xl text-primary">{service.price}</CardTitle>
                <CardDescription>За час услуг</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
                  onClick={() => setShowBookingModal(true)}
                >
                  <Icon name="Calendar" className="mr-2" size={20} />
                  Забронировать
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg py-6"
                  onClick={() => setCurrentPage('messages')}
                >
                  <Icon name="MessageCircle" className="mr-2" size={20} />
                  Написать
                </Button>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Icon name="Shield" size={18} className="text-primary" />
                    <span>Защита платежей</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Icon name="Lock" size={18} className="text-primary" />
                    <span>Конфиденциальность</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Icon name="RefreshCw" size={18} className="text-primary" />
                    <span>Гибкая отмена</span>
                  </div>
                </div>

                <Separator />

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Info" size={18} className="text-primary" />
                    Важная информация
                  </h4>
                  <ul className="space-y-1 text-sm text-foreground/80">
                    <li>• Минимальное бронирование: {service.duration?.replace('От ', '')}</li>
                    <li>• Предоплата: 30%</li>
                    <li>• Отмена за 24 часа без штрафа</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Return placeholder components for other pages (these can be extracted later if needed)
  const RegisterPage = () => (
    <div className="container mx-auto px-4 py-16 max-w-2xl animate-fade-in">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-4xl text-center text-primary">Регистрация</CardTitle>
          <CardDescription className="text-center text-lg">Выберите тип аккаунта для продолжения</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buyer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buyer">Покупатель</TabsTrigger>
              <TabsTrigger value="seller">Продавец</TabsTrigger>
            </TabsList>
            <TabsContent value="buyer" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="buyer-name">Имя</Label>
                <Input id="buyer-name" placeholder="Введите ваше имя" className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyer-email">Email</Label>
                <Input id="buyer-email" type="email" placeholder="your@email.com" className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyer-password">Пароль</Label>
                <Input id="buyer-password" type="password" placeholder="••••••••" className="bg-background border-border" />
              </div>
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
                onClick={() => {
                  setUserRole('buyer');
                  setCurrentPage('home');
                }}
              >
                Зарегистрироваться как покупатель
              </Button>
            </TabsContent>
            <TabsContent value="seller" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="seller-name">Имя</Label>
                <Input id="seller-name" placeholder="Введите ваше имя" className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-email">Email</Label>
                <Input id="seller-email" type="email" placeholder="your@email.com" className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-password">Пароль</Label>
                <Input id="seller-password" type="password" placeholder="••••••••" className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-category">Категория услуг</Label>
                <Select>
                  <SelectTrigger id="seller-category" className="bg-background border-border">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="premium">Премиум</SelectItem>
                    <SelectItem value="business">Бизнес</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
                onClick={() => {
                  setUserRole('seller');
                  setCurrentPage('home');
                }}
              >
                Зарегистрироваться как продавец
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  const ProfilePage = () => (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 text-primary">Профиль</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 bg-card border-border">
          <CardHeader>
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                  {profile.name[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl text-center mb-2">{profile.name}</CardTitle>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Star" size={20} className="text-primary fill-primary" />
                <span className="text-xl font-semibold">{profile.rating}</span>
              </div>
              {profile.verified && (
                <Badge className="bg-primary text-primary-foreground">
                  <Icon name="CheckCircle" size={16} className="mr-1" />
                  Верифицирован
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full border-border">
                <Icon name="Settings" className="mr-2" size={18} />
                Настройки
              </Button>
              <Button variant="outline" className="w-full border-border text-red-500 hover:text-red-600">
                <Icon name="LogOut" className="mr-2" size={18} />
                Выход
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-3xl">Мои бронирования</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Calendar" size={64} className="mx-auto mb-4 opacity-50" />
              <p>У вас пока нет бронирований</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const SearchPage = () => (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 text-primary">Поиск</h1>
      <div className="max-w-2xl mx-auto">
        <Input 
          placeholder="Поиск услуг, категорий, исполнителей..." 
          className="text-lg py-6 bg-background border-border mb-8"
        />
        <div className="text-center text-muted-foreground">
          <Icon name="Search" size={64} className="mx-auto mb-4 opacity-50" />
          <p>Начните вводить запрос для поиска</p>
        </div>
      </div>
    </div>
  );

  const FavoritesPage = () => (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 text-primary">Избранное</h1>
      {favorites.length === 0 ? (
        <Card className="bg-card border-border p-12">
          <div className="text-center space-y-4">
            <Icon name="Heart" size={64} className="mx-auto text-muted-foreground" />
            <h3 className="text-2xl font-semibold">Избранное пусто</h3>
            <p className="text-muted-foreground">Добавьте услуги в избранное для быстрого доступа</p>
            <Button onClick={() => setCurrentPage('catalog')}>
              Перейти в каталог
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogItems.filter(item => favorites.includes(item.id)).map((item) => (
            <Card key={item.id} className="group hover:scale-105 transition-all duration-300 bg-card border-border">
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
                      className="fill-red-500 text-red-500"
                    />
                  </button>
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription>{item.seller}</CardDescription>
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

  const MessagesPage = () => (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 text-primary">Сообщения</h1>
      <Card className="bg-card border-border">
        <CardContent className="p-12 text-center text-muted-foreground">
          <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-50" />
          <p>У вас пока нет сообщений</p>
        </CardContent>
      </Card>
    </div>
  );

  const RulesPage = () => (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 text-primary">Правила платформы</h1>
      <Card className="bg-card border-border">
        <CardContent className="prose prose-invert max-w-none pt-6 space-y-6">
          <section>
            <h2 className="text-3xl font-semibold text-primary mb-4">1. Общие положения</h2>
            <p className="text-foreground/80 leading-relaxed">
              Платформа ÉLITE предоставляет услуги по организации встреч между взрослыми людьми. 
              Все пользователи должны быть совершеннолетними и соблюдать законодательство своей страны.
            </p>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-3xl font-semibold text-primary mb-4">2. Безопасность и конфиденциальность</h2>
            <ul className="space-y-2 text-foreground/80">
              <li>• Все данные пользователей защищены и хранятся конфиденциально</li>
              <li>• Запрещено разглашение личной информации третьим лицам</li>
              <li>• Платформа использует современные методы шифрования</li>
              <li>• Верификация профилей обязательна для продавцов</li>
            </ul>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-3xl font-semibold text-primary mb-4">3. Правила для продавцов</h2>
            <ul className="space-y-2 text-foreground/80">
              <li>• Честное описание услуг и актуальные фотографии</li>
              <li>• Соблюдение договоренностей с клиентами</li>
              <li>• Профессиональное поведение и уважение к клиентам</li>
              <li>• Своевременная оплата комиссии платформы</li>
            </ul>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-3xl font-semibold text-primary mb-4">4. Правила для покупателей</h2>
            <ul className="space-y-2 text-foreground/80">
              <li>• Уважительное отношение к исполнителям услуг</li>
              <li>• Своевременная оплата согласованных услуг</li>
              <li>• Соблюдение оговоренных условий встречи</li>
              <li>• Запрет на домогательства и неэтичное поведение</li>
            </ul>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-3xl font-semibold text-primary mb-4">5. Запрещенные действия</h2>
            <ul className="space-y-2 text-foreground/80">
              <li>• Мошенничество и обман</li>
              <li>• Насилие и угрозы</li>
              <li>• Распространение незаконного контента</li>
              <li>• Попытки обойти систему оплаты платформы</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'catalog': return <CatalogPage />;
      case 'profile': return userRole ? <ProfilePage /> : <RegisterPage />;
      case 'register': return <RegisterPage />;
      case 'search': return <SearchPage />;
      case 'favorites': return <FavoritesPage />;
      case 'messages': return <MessagesPage />;
      case 'rules': return <RulesPage />;
      case 'service': return <ServiceDetailPage />;
      default: return <HomePage />;
    }
  };

  return { renderPage };
};
