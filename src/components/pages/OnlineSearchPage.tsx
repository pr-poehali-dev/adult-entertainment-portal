import { useState, useEffect } from 'react';
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
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

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

  const handleCardClick = (userId: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleNameClick = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage('seller-profile');
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
            <Card key={user.id} className="overflow-hidden hover:shadow-lg transition-all" style={{ perspective: '1000px' }}>
              <div 
                className="relative aspect-[3/4] cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s',
                  transform: flippedCards.has(user.id) ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                <div 
                  className="absolute inset-0"
                  style={{ backfaceVisibility: 'hidden' }}
                  onClick={() => handleCardClick(user.id)}
                >
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
                      <h3 
                        className="text-white font-bold text-lg leading-tight hover:text-primary/80 cursor-pointer transition-colors"
                        onClick={(e) => handleNameClick(user.id, e)}
                      >{user.name}, {user.age}</h3>
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

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMessageClick(user.id);
                      }}
                    >
                      <Icon name="MessageCircle" size={18} className="mr-2" />
                      Написать сообщение
                    </Button>
                  </div>
                </div>
                
                <div 
                  className="absolute inset-0 bg-black/90 p-4"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                  onClick={() => handleCardClick(user.id)}
                >
                  {/* Top section - Name, Age, City (left side) */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <h3 
                        className="text-white font-bold text-lg leading-tight hover:text-white/80 cursor-pointer transition-colors"
                        onClick={(e) => handleNameClick(user.id, e)}
                      >{user.name}, {user.age}</h3>
                      <p className="text-white/90 text-sm flex items-center gap-1 mt-0.5">
                        <Icon name="MapPin" size={12} />
                        {user.city}
                      </p>
                    </div>
                  </div>
                  
                  {/* Online status badge - top right corner */}
                  <div className="absolute top-3 right-3">
                    <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                      <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                      <span className="text-white text-xs font-medium">{user.lastSeen}</span>
                    </div>
                  </div>

                  {/* Middle section - Details */}
                  <div className="absolute top-24 left-4 right-4 bottom-20 overflow-auto">
                    <div className="text-white space-y-3">
                      <div>
                        <h4 className="text-xs font-medium text-white/70 mb-1">О себе:</h4>
                        <p className="text-sm">{user.aboutMe}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-white/70 mb-1">Ищет:</h4>
                        <p className="text-sm">{user.lookingFor}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-white/70 mb-1">Предпочтения:</h4>
                        <div className="flex flex-wrap gap-1">
                          {user.sexualPreferences.map((pref, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white/20 rounded text-xs">
                              {pref === 'classic' && 'Классика'}
                              {pref === 'oral' && 'Оральные ласки'}
                              {pref === 'anal' && 'Анальный секс'}
                              {pref === 'group' && 'Групповой секс'}
                              {pref === 'toys' && 'Игрушки'}
                              {pref === 'bdsm' && 'БДСМ'}
                              {pref === 'dirty' && 'Грязные игры'}
                              {pref === 'cuckold' && 'Куколд'}
                              {pref === 'extreme' && 'Экстрим'}
                              {pref === 'other' && 'Другое'}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom section - Button (same position as front) */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <Button 
                      className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMessageClick(user.id);
                      }}
                    >
                      <Icon name="MessageCircle" size={18} className="mr-2" />
                      Написать сообщение
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};