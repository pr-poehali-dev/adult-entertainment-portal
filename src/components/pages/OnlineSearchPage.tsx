import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Orientation, SexualPreference, Page } from '@/types';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';

interface OnlineUser {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  city: string;
  country: string;
  avatar: string;
  photo?: string;
  orientation: Orientation;
  sexualPreferences: SexualPreference[];
  aboutMe: string;
  lookingFor: string;
  isOnline: boolean;
  lastSeen: string;
}

const mockOnlineUsers: OnlineUser[] = [
  {
    id: 1,
    name: 'Анна',
    age: 24,
    gender: 'female',
    city: 'Москва',
    country: 'Россия',
    avatar: 'А',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop',
    orientation: 'hetero',
    sexualPreferences: ['classic', 'oral'],
    aboutMe: 'Люблю путешествия и новые знакомства',
    lookingFor: 'Ищу интересного собеседника для приятных встреч',
    isOnline: true,
    lastSeen: 'Сейчас онлайн'
  },
  {
    id: 2,
    name: 'Дмитрий',
    age: 28,
    gender: 'male',
    city: 'Санкт-Петербург',
    country: 'Россия',
    avatar: 'Д',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
    orientation: 'hetero',
    sexualPreferences: ['classic', 'toys', 'bdsm'],
    aboutMe: 'Спортсмен, люблю активный отдых',
    lookingFor: 'Ищу партнершу для приятного времяпрепровождения',
    isOnline: true,
    lastSeen: 'Сейчас онлайн'
  },
  {
    id: 3,
    name: 'Мария',
    age: 26,
    gender: 'female',
    city: 'Минск',
    country: 'Беларусь',
    avatar: 'М',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
    orientation: 'bi',
    sexualPreferences: ['classic', 'oral', 'group'],
    aboutMe: 'Открыта к новому опыту',
    lookingFor: 'Ищу людей для интересных встреч',
    isOnline: true,
    lastSeen: 'Сейчас онлайн'
  },
  {
    id: 4,
    name: 'Алексей',
    age: 32,
    gender: 'male',
    city: 'Екатеринбург',
    country: 'Россия',
    avatar: 'А',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    orientation: 'hetero',
    sexualPreferences: ['classic', 'anal', 'toys'],
    aboutMe: 'Предприниматель, ценю откровенность',
    lookingFor: 'Ищу партнершу для регулярных встреч',
    isOnline: false,
    lastSeen: '5 минут назад'
  },
  {
    id: 5,
    name: 'Елена',
    age: 29,
    gender: 'female',
    city: 'Казань',
    country: 'Россия',
    avatar: 'Е',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
    orientation: 'hetero',
    sexualPreferences: ['classic', 'oral', 'toys', 'bdsm'],
    aboutMe: 'Модель, люблю эксперименты',
    lookingFor: 'Ищу состоятельного партнера',
    isOnline: true,
    lastSeen: 'Сейчас онлайн'
  },
  {
    id: 6,
    name: 'Ирина',
    age: 27,
    gender: 'female',
    city: 'Алматы',
    country: 'Казахстан',
    avatar: 'И',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
    orientation: 'hetero',
    sexualPreferences: ['classic', 'oral'],
    aboutMe: 'Люблю танцы и активный отдых',
    lookingFor: 'Ищу интересного мужчину',
    isOnline: true,
    lastSeen: 'Сейчас онлайн'
  },
];

const countriesWithCities = {
  'Россия': ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград'],
  'Беларусь': ['Минск', 'Гомель', 'Могилёв', 'Витебск', 'Гродно', 'Брест'],
  'Казахстан': ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Усть-Каменогорск', 'Семей', 'Атырау'],
};

interface OnlineSearchPageProps {
  setCurrentPage: (page: Page) => void;
}

export const OnlineSearchPage = ({ setCurrentPage }: OnlineSearchPageProps) => {
  const [users] = useState<OnlineUser[]>(mockOnlineUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [onlineOnly, setOnlineOnly] = useState(true);

  const availableCities = filterCountry === 'all' 
    ? Object.values(countriesWithCities).flat()
    : countriesWithCities[filterCountry as keyof typeof countriesWithCities] || [];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = filterGender === 'all' || user.gender === filterGender;
    const matchesCountry = filterCountry === 'all' || user.country === filterCountry;
    const matchesCity = filterCity === 'all' || user.city === filterCity;
    const matchesOnline = !onlineOnly || user.isOnline;

    return matchesSearch && matchesGender && matchesCountry && matchesCity && matchesOnline;
  });

  const handleCountryChange = (value: string) => {
    setFilterCountry(value);
    setFilterCity('all');
  };

  const handleMessageClick = (userId: number) => {
    console.log('Message user:', userId);
  };

  const handleGiftVIPClick = (userId: number) => {
    console.log('Gift VIP to user:', userId);
  };

  return (
    <div className="max-w-wide mx-auto px-4 py-8 animate-fade-in">
      <PageBreadcrumb currentPage="online-search" setCurrentPage={setCurrentPage} />

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск по имени или городу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger>
                <SelectValue placeholder="Пол" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любой пол</SelectItem>
                <SelectItem value="female">Женский</SelectItem>
                <SelectItem value="male">Мужской</SelectItem>
                <SelectItem value="other">Другое</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCountry} onValueChange={handleCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Страна" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все страны</SelectItem>
                <SelectItem value="Россия">Россия</SelectItem>
                <SelectItem value="Беларусь">Беларусь</SelectItem>
                <SelectItem value="Казахстан">Казахстан</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger>
                <SelectValue placeholder="Город" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все города</SelectItem>
                {availableCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="onlineOnly"
                checked={onlineOnly}
                onChange={(e) => setOnlineOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="onlineOnly" className="text-sm cursor-pointer">
                Только онлайн
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground">
          Найдено: {filteredUsers.length} {onlineOnly ? 'онлайн' : 'пользователей'}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">
            {users.filter(u => u.isOnline).length} онлайн
          </span>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Icon name="Users" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Никого не найдено</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить параметры поиска
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map(user => (
            <Card key={user.id} className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group">
              <div className="relative aspect-[3/4]">
                {user.photo ? (
                  <img 
                    src={user.photo} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary/30">{user.avatar}</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <h3 className="text-white font-bold text-lg leading-tight">{user.name}, {user.age}</h3>
                    <p className="text-white/90 text-sm flex items-center gap-1 mt-0.5">
                      <Icon name="MapPin" size={12} />
                      {user.city}
                    </p>
                  </div>
                  {user.isOnline && (
                    <div className="bg-green-500 rounded-full px-2.5 py-1 flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-xs font-medium">Онлайн</span>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    onClick={() => handleMessageClick(user.id)}
                  >
                    <Icon name="MessageCircle" size={18} className="mr-2" />
                    Написать сообщение
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full bg-amber-500/90 hover:bg-amber-500 text-white border-none shadow-lg backdrop-blur-sm"
                    onClick={() => handleGiftVIPClick(user.id)}
                  >
                    <Icon name="Gift" size={18} className="mr-2" />
                    Подарить VIP
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
