import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Orientation, SexualPreference, Page } from '@/types';

interface OnlineUser {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  city: string;
  avatar: string;
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
    avatar: 'А',
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
    avatar: 'Д',
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
    city: 'Москва',
    avatar: 'М',
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
    city: 'Москва',
    avatar: 'А',
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
    avatar: 'Е',
    orientation: 'hetero',
    sexualPreferences: ['classic', 'oral', 'toys', 'bdsm'],
    aboutMe: 'Модель, люблю эксперименты',
    lookingFor: 'Ищу состоятельного партнера',
    isOnline: true,
    lastSeen: 'Сейчас онлайн'
  },
];

interface OnlineSearchPageProps {
  setCurrentPage: (page: Page) => void;
}

export const OnlineSearchPage = ({ setCurrentPage }: OnlineSearchPageProps) => {
  const [users, setUsers] = useState<OnlineUser[]>(mockOnlineUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterOrientation, setFilterOrientation] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [onlineOnly, setOnlineOnly] = useState(true);

  const cities = Array.from(new Set(mockOnlineUsers.map(u => u.city)));

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = filterGender === 'all' || user.gender === filterGender;
    const matchesOrientation = filterOrientation === 'all' || user.orientation === filterOrientation;
    const matchesCity = filterCity === 'all' || user.city === filterCity;
    const matchesOnline = !onlineOnly || user.isOnline;

    return matchesSearch && matchesGender && matchesOrientation && matchesCity && matchesOnline;
  });

  const sexualPreferenceLabels: Record<SexualPreference, string> = {
    classic: 'Классика',
    oral: 'Оральный',
    anal: 'Анальный',
    group: 'Групповой',
    toys: 'Игрушки',
    bdsm: 'БДСМ',
    dirty: 'Грязь',
    cuckold: 'Куколд',
    extreme: 'Экстрим',
    other: 'Другое',
  };

  return (
    <div className="max-w-wide mx-auto px-4 py-8 animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => setCurrentPage('home')}
        className="mb-6"
      >
        <Icon name="ArrowLeft" size={20} className="mr-2" />
        На главную
      </Button>
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4 text-primary">Поиск онлайн</h1>
        <p className="text-lg text-muted-foreground">
          Найдите собеседников, которые сейчас онлайн
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger>
                <SelectValue placeholder="Город" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все города</SelectItem>
                {cities.map(city => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <Card key={user.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl mb-1">{user.name}, {user.age}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={14} />
                      <span>{user.city}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {user.lastSeen}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Icon name="User" size={14} />
                    О себе
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {user.aboutMe}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Heart" size={14} />
                    Ищу
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {user.lookingFor}
                  </p>
                </div>

                {user.sexualPreferences.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Предпочтения</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.sexualPreferences.slice(0, 3).map(pref => (
                        <span
                          key={pref}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {sexualPreferenceLabels[pref]}
                        </span>
                      ))}
                      {user.sexualPreferences.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          +{user.sexualPreferences.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <Button className="w-full">
                  <Icon name="MessageCircle" size={16} className="mr-2" />
                  Написать сообщение
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};