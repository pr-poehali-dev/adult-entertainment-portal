import { useState } from 'react';
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

type Page = 'home' | 'catalog' | 'profile' | 'register' | 'search' | 'favorites' | 'messages' | 'rules';
type UserRole = 'buyer' | 'seller' | null;

interface Profile {
  name: string;
  role: UserRole;
  avatar: string;
  rating: number;
  verified: boolean;
}

interface CatalogItem {
  id: number;
  title: string;
  seller: string;
  rating: number;
  price: string;
  category: string;
  image: string;
  verified: boolean;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [profile] = useState<Profile>({
    name: 'Елена Романова',
    role: 'buyer',
    avatar: '',
    rating: 4.8,
    verified: true
  });

  const catalogItems: CatalogItem[] = [
    { id: 1, title: 'Премиум сопровождение', seller: 'Анна', rating: 4.9, price: '25 000 ₽/час', category: 'VIP', image: '', verified: true },
    { id: 2, title: 'Индивидуальные встречи', seller: 'Мария', rating: 4.7, price: '15 000 ₽/час', category: 'Премиум', image: '', verified: true },
    { id: 3, title: 'Деловое сопровождение', seller: 'Виктория', rating: 4.8, price: '20 000 ₽/час', category: 'Бизнес', image: '', verified: false },
    { id: 4, title: 'Эксклюзивный сервис', seller: 'Диана', rating: 5.0, price: '30 000 ₽/час', category: 'VIP', image: '', verified: true },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const Navigation = () => (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary cursor-pointer" onClick={() => setCurrentPage('home')}>
            ÉLITE
          </h1>
          
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => setCurrentPage('home')} className="text-foreground/80 hover:text-primary transition-colors">
              Главная
            </button>
            <button onClick={() => setCurrentPage('catalog')} className="text-foreground/80 hover:text-primary transition-colors">
              Каталог
            </button>
            <button onClick={() => setCurrentPage('search')} className="text-foreground/80 hover:text-primary transition-colors">
              Поиск
            </button>
            {userRole && (
              <>
                <button onClick={() => setCurrentPage('favorites')} className="text-foreground/80 hover:text-primary transition-colors">
                  Избранное
                </button>
                <button onClick={() => setCurrentPage('messages')} className="text-foreground/80 hover:text-primary transition-colors">
                  Сообщения
                </button>
              </>
            )}
            <button onClick={() => setCurrentPage('rules')} className="text-foreground/80 hover:text-primary transition-colors">
              Правила
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {userRole ? (
              <Button variant="ghost" onClick={() => setCurrentPage('profile')}>
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-primary text-primary-foreground">{profile.name[0]}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">Профиль</span>
              </Button>
            ) : (
              <Button onClick={() => setCurrentPage('register')} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

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

  const CatalogPage = () => (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 text-primary">Каталог услуг</h1>
      
      <div className="mb-8 flex flex-wrap gap-4">
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="premium">Премиум</SelectItem>
            <SelectItem value="business">Бизнес</SelectItem>
          </SelectContent>
        </Select>
        
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Цена" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">До 15 000 ₽</SelectItem>
            <SelectItem value="mid">15 000 - 25 000 ₽</SelectItem>
            <SelectItem value="high">От 25 000 ₽</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Только проверенные
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogItems.map((item) => (
          <Card key={item.id} className="group hover:scale-105 transition-all duration-300 bg-card border-border">
            <CardHeader>
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                <Icon name="Image" size={64} className="text-muted-foreground" />
                <button 
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                >
                  <Icon 
                    name={favorites.includes(item.id) ? "Heart" : "Heart"} 
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
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Подробнее
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const RegisterPage = () => (
    <div className="container mx-auto px-4 py-16 max-w-2xl animate-fade-in">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-4xl text-center text-primary">Регистрация</CardTitle>
          <CardDescription className="text-center text-lg">Выберите тип аккаунта для продолжения</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buyer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="buyer" className="text-lg">Покупатель</TabsTrigger>
              <TabsTrigger value="seller" className="text-lg">Продавец</TabsTrigger>
            </TabsList>
            
            <TabsContent value="buyer" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="buyer-name">Имя</Label>
                <Input id="buyer-name" placeholder="Введите ваше имя" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyer-email">Email</Label>
                <Input id="buyer-email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyer-password">Пароль</Label>
                <Input id="buyer-password" type="password" placeholder="Минимум 8 символов" />
              </div>
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6" 
                onClick={() => { setUserRole('buyer'); setCurrentPage('home'); }}
              >
                Зарегистрироваться как покупатель
              </Button>
            </TabsContent>
            
            <TabsContent value="seller" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="seller-name">Имя или псевдоним</Label>
                <Input id="seller-name" placeholder="Как вас представить" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-email">Email</Label>
                <Input id="seller-email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-password">Пароль</Label>
                <Input id="seller-password" type="password" placeholder="Минимум 8 символов" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-category">Категория услуг</Label>
                <Select>
                  <SelectTrigger id="seller-category">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vip">VIP сопровождение</SelectItem>
                    <SelectItem value="business">Бизнес-встречи</SelectItem>
                    <SelectItem value="events">Мероприятия</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-description">Описание</Label>
                <Textarea id="seller-description" placeholder="Расскажите о себе и ваших услугах" rows={4} />
              </div>
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
                onClick={() => { setUserRole('seller'); setCurrentPage('home'); }}
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
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <Card className="bg-card border-border">
        <CardHeader className="text-center">
          <Avatar className="w-32 h-32 mx-auto mb-4">
            <AvatarFallback className="bg-primary text-primary-foreground text-4xl">{profile.name[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-4xl flex items-center justify-center gap-2">
            {profile.name}
            {profile.verified && <Icon name="CheckCircle" className="text-primary" size={32} />}
          </CardTitle>
          <CardDescription className="text-lg">
            <Badge className="mt-2 bg-primary text-primary-foreground">
              {profile.role === 'buyer' ? 'Покупатель' : 'Продавец'}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-2 text-2xl">
            <Icon name="Star" className="text-primary" />
            <span className="font-bold">{profile.rating}</span>
            <span className="text-muted-foreground">/ 5.0</span>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Личная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value="email@example.com" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input value="+7 (900) 000-00-00" readOnly />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Статистика</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: 'Заказов', value: '12' },
                { label: 'Отзывов', value: '8' },
                { label: 'В избранном', value: favorites.length.toString() },
                { label: 'Сообщений', value: '3' }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              Редактировать профиль
            </Button>
            <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Настройки
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SearchPage = () => (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 text-primary">Поиск</h1>
      <Card className="bg-card border-border mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input 
              placeholder="Поиск по услугам, продавцам..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-lg"
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              <Icon name="Search" className="mr-2" />
              Найти
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {searchQuery && (
        <div className="text-muted-foreground text-center py-12">
          Результаты поиска для "{searchQuery}"
        </div>
      )}
    </div>
  );

  const FavoritesPage = () => (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 text-primary">Избранное</h1>
      {favorites.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <Icon name="Heart" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">У вас пока нет избранных объявлений</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogItems.filter(item => favorites.includes(item.id)).map((item) => (
            <Card key={item.id} className="bg-card border-border">
              <CardHeader>
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                  <Icon name="Image" size={64} className="text-muted-foreground" />
                  <button 
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                  >
                    <Icon name="Heart" size={20} className="fill-red-500 text-red-500" />
                  </button>
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription>{item.seller}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{item.price}</span>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
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
        <CardContent className="py-12 text-center">
          <Icon name="MessageCircle" size={64} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">У вас пока нет сообщений</p>
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
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        {renderPage()}
      </main>
      <footer className="border-t border-border mt-20 py-12 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">ÉLITE</h2>
          <p className="text-muted-foreground mb-6">Премиальная платформа для взрослых</p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <button onClick={() => setCurrentPage('rules')} className="hover:text-primary transition-colors">
              Правила
            </button>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Конфиденциальность</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Поддержка</a>
          </div>
          <p className="text-xs text-muted-foreground mt-6">© 2024 ÉLITE. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;