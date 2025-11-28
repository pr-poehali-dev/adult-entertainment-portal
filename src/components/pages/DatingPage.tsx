import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DatingPageProps {
  setCurrentPage: (page: Page) => void;
}

interface DatingProfile {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  city: string;
  photo: string;
  photos: string[];
  about: string;
  interests: string[];
  lookingFor: string;
  height: number;
  online: boolean;
  verified: boolean;
}

const mockProfiles: DatingProfile[] = [
  {
    id: 1,
    name: 'Анна',
    age: 24,
    gender: 'female',
    city: 'Москва',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800'
    ],
    about: 'Люблю путешествовать, заниматься йогой и пробовать новые кафе. Ищу интересного собеседника для приятного общения.',
    interests: ['Путешествия', 'Йога', 'Фотография', 'Кулинария'],
    lookingFor: 'Серьезные отношения',
    height: 168,
    online: true,
    verified: true
  },
  {
    id: 2,
    name: 'Мария',
    age: 28,
    gender: 'female',
    city: 'Санкт-Петербург',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800'
    ],
    about: 'Маркетолог, обожаю театр и современное искусство. В свободное время рисую акварелью.',
    interests: ['Театр', 'Искусство', 'Книги', 'Психология'],
    lookingFor: 'Знакомство',
    height: 172,
    online: false,
    verified: true
  },
  {
    id: 3,
    name: 'Дмитрий',
    age: 32,
    gender: 'male',
    city: 'Москва',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    ],
    about: 'IT-предприниматель, увлекаюсь спортом и активным отдыхом. Люблю горы и море.',
    interests: ['Спорт', 'Путешествия', 'Бизнес', 'Технологии'],
    lookingFor: 'Серьезные отношения',
    height: 182,
    online: true,
    verified: false
  },
  {
    id: 4,
    name: 'Елена',
    age: 26,
    gender: 'female',
    city: 'Казань',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    photos: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800'
    ],
    about: 'Дизайнер интерьеров. Люблю создавать уют и красоту вокруг себя.',
    interests: ['Дизайн', 'Мода', 'Архитектура', 'Декор'],
    lookingFor: 'Дружба',
    height: 165,
    online: false,
    verified: true
  },
  {
    id: 5,
    name: 'Алексей',
    age: 29,
    gender: 'male',
    city: 'Новосибирск',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800'
    ],
    about: 'Фотограф и путешественник. Объездил 40 стран. Ищу единомышленников.',
    interests: ['Фотография', 'Путешествия', 'Музыка', 'Кино'],
    lookingFor: 'Дружба',
    height: 178,
    online: true,
    verified: true
  },
  {
    id: 6,
    name: 'София',
    age: 23,
    gender: 'female',
    city: 'Екатеринбург',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800'
    ],
    about: 'Студентка мед университета. Люблю танцы и активный образ жизни.',
    interests: ['Танцы', 'Медицина', 'Фитнес', 'Психология'],
    lookingFor: 'Знакомство',
    height: 170,
    online: true,
    verified: false
  }
];

export const DatingPage = ({ setCurrentPage }: DatingPageProps) => {
  const [profiles] = useState<DatingProfile[]>(mockProfiles);
  const [selectedProfile, setSelectedProfile] = useState<DatingProfile | null>(null);
  const [filters, setFilters] = useState({
    gender: 'all',
    ageFrom: '',
    ageTo: '',
    city: 'all',
    lookingFor: 'all',
    onlineOnly: false
  });

  const filteredProfiles = profiles.filter(profile => {
    if (filters.gender !== 'all' && profile.gender !== filters.gender) return false;
    if (filters.ageFrom && profile.age < parseInt(filters.ageFrom)) return false;
    if (filters.ageTo && profile.age > parseInt(filters.ageTo)) return false;
    if (filters.city !== 'all' && profile.city !== filters.city) return false;
    if (filters.lookingFor !== 'all' && profile.lookingFor !== filters.lookingFor) return false;
    if (filters.onlineOnly && !profile.online) return false;
    return true;
  });

  const cities = Array.from(new Set(profiles.map(p => p.city)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-pink-50/30 dark:via-pink-950/10 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setCurrentPage('home')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>

        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Heart" size={48} className="text-pink-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Знакомства
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Найди интересных людей рядом с тобой. Бесплатные знакомства без скрытых платежей.
          </p>
        </div>

        <Card className="mb-8 border-2 border-pink-200 dark:border-pink-900">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Пол</label>
                <Select value={filters.gender} onValueChange={(value) => setFilters({...filters, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="female">Женский</SelectItem>
                    <SelectItem value="male">Мужской</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Возраст от</label>
                <Input
                  type="number"
                  placeholder="18"
                  value={filters.ageFrom}
                  onChange={(e) => setFilters({...filters, ageFrom: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Возраст до</label>
                <Input
                  type="number"
                  placeholder="50"
                  value={filters.ageTo}
                  onChange={(e) => setFilters({...filters, ageTo: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Город</label>
                <Select value={filters.city} onValueChange={(value) => setFilters({...filters, city: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все города" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все города</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Цель знакомства</label>
                <Select value={filters.lookingFor} onValueChange={(value) => setFilters({...filters, lookingFor: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Любая" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Любая</SelectItem>
                    <SelectItem value="Серьезные отношения">Серьезные отношения</SelectItem>
                    <SelectItem value="Знакомство">Знакомство</SelectItem>
                    <SelectItem value="Дружба">Дружба</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant={filters.onlineOnly ? "default" : "outline"}
                  onClick={() => setFilters({...filters, onlineOnly: !filters.onlineOnly})}
                  className="w-full"
                >
                  <Icon name="Wifi" size={16} className="mr-2" />
                  Только онлайн
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Найдено анкет: <span className="font-bold">{filteredProfiles.length}</span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({
                  gender: 'all',
                  ageFrom: '',
                  ageTo: '',
                  city: 'all',
                  lookingFor: 'all',
                  onlineOnly: false
                })}
              >
                Сбросить фильтры
              </Button>
            </div>
          </CardContent>
        </Card>

        {!selectedProfile ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map(profile => (
              <Card
                key={profile.id}
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setSelectedProfile(profile)}
              >
                <div className="relative">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {profile.online && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Онлайн
                    </div>
                  )}
                  {profile.verified && (
                    <div className="absolute top-3 left-3 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                      <Icon name="CheckCircle2" size={16} />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white text-2xl font-bold">{profile.name}, {profile.age}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                      <Icon name="MapPin" size={14} />
                      {profile.city}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {profile.about}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.interests.slice(0, 3).map(interest => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      <Icon name="Heart" size={12} className="inline mr-1" />
                      {profile.lookingFor}
                    </div>
                    <Button size="sm">
                      Подробнее
                      <Icon name="ArrowRight" size={14} className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-5xl mx-auto">
            <CardContent className="p-0">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white"
                >
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Назад
                </Button>

                <div className="grid md:grid-cols-2 gap-6 p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={selectedProfile.photos[0]}
                        alt={selectedProfile.name}
                        className="w-full h-96 object-cover rounded-xl"
                      />
                      {selectedProfile.online && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          Онлайн
                        </div>
                      )}
                    </div>
                    {selectedProfile.photos.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {selectedProfile.photos.slice(1).map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt={`Фото ${idx + 2}`}
                            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-3xl font-bold mb-2">
                            {selectedProfile.name}, {selectedProfile.age}
                            {selectedProfile.verified && (
                              <Icon name="CheckCircle2" size={24} className="inline ml-2 text-blue-500" />
                            )}
                          </h2>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Icon name="MapPin" size={16} />
                            {selectedProfile.city}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Icon name="User" size={16} />
                            О себе
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {selectedProfile.about}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Icon name="Heart" size={16} />
                            Ищу
                          </h3>
                          <Badge className="bg-pink-500">{selectedProfile.lookingFor}</Badge>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Icon name="Sparkles" size={16} />
                            Интересы
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedProfile.interests.map(interest => (
                              <Badge key={interest} variant="outline">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Icon name="Info" size={16} />
                            Параметры
                          </h3>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-muted-foreground text-xs mb-1">Возраст</p>
                              <p className="font-semibold">{selectedProfile.age} лет</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-muted-foreground text-xs mb-1">Рост</p>
                              <p className="font-semibold">{selectedProfile.height} см</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                      <Button className="flex-1 h-14 text-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                        <Icon name="Heart" size={20} className="mr-2" />
                        Мне нравится
                      </Button>
                      <Button variant="outline" className="flex-1 h-14 text-lg">
                        <Icon name="MessageCircle" size={20} className="mr-2" />
                        Написать
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
