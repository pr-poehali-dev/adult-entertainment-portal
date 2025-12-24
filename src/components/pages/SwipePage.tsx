import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface SwipeProfile {
  id: number;
  name: string;
  age: number;
  city: string;
  photo: string;
  bio: string;
  interests: string[];
  verified: boolean;
}

const mockProfiles: SwipeProfile[] = [
  {
    id: 1,
    name: 'Анна',
    age: 24,
    city: 'Москва',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Люблю путешествия и новые знакомства',
    interests: ['Путешествия', 'Фотография', 'Йога'],
    verified: true,
  },
  {
    id: 2,
    name: 'Мария',
    age: 26,
    city: 'Санкт-Петербург',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    bio: 'Художница и кофеманка',
    interests: ['Искусство', 'Кофе', 'Музыка'],
    verified: true,
  },
  {
    id: 3,
    name: 'Елена',
    age: 23,
    city: 'Казань',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    bio: 'Спортсменка и любительница активного отдыха',
    interests: ['Спорт', 'Природа', 'Танцы'],
    verified: false,
  },
  {
    id: 4,
    name: 'Ольга',
    age: 25,
    city: 'Новосибирск',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    bio: 'IT-специалист с душой романтика',
    interests: ['Технологии', 'Книги', 'Кино'],
    verified: true,
  },
];

interface SwipePageProps {
  onMatch?: (profileId: number) => void;
}

export default function SwipePage({ onMatch }: SwipePageProps) {
  const [profiles, setProfiles] = useState<SwipeProfile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [matches, setMatches] = useState<number>(0);

  const currentProfile = profiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    if (direction === 'right') {
      const isMatch = Math.random() > 0.7;
      if (isMatch) {
        setMatches(prev => prev + 1);
        onMatch?.(currentProfile.id);
      }
    }

    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  useEffect(() => {
    if (currentIndex >= profiles.length) {
      setProfiles([...mockProfiles]);
      setCurrentIndex(0);
    }
  }, [currentIndex, profiles.length]);

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <Icon name="Heart" size={48} className="mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Профили закончились</h2>
          <p className="text-muted-foreground mb-4">Загружаем новые анкеты...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-20 pb-24 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Свайп-знакомства
          </h1>
          <p className="text-sm text-muted-foreground">
            Свайпайте вправо, если нравится, влево — если нет
          </p>
          {matches > 0 && (
            <Badge className="mt-2 bg-gradient-to-r from-pink-500 to-purple-600">
              <Icon name="Heart" size={14} className="mr-1" />
              {matches} {matches === 1 ? 'совпадение' : 'совпадений'}
            </Badge>
          )}
        </div>

        <div className="relative">
          <Card
            className={`overflow-hidden transition-all duration-300 transform ${
              swipeDirection === 'left'
                ? '-translate-x-full rotate-12 opacity-0'
                : swipeDirection === 'right'
                ? 'translate-x-full -rotate-12 opacity-0'
                : 'translate-x-0 rotate-0 opacity-100'
            }`}
          >
            <div className="relative aspect-[3/4]">
              <img
                src={currentProfile.photo}
                alt={currentProfile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              <div className="absolute top-4 right-4">
                {currentProfile.verified && (
                  <Badge className="bg-blue-500 text-white">
                    <Icon name="CheckCircle2" size={14} className="mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-baseline gap-2 mb-2">
                  <h2 className="text-3xl font-bold">{currentProfile.name}</h2>
                  <span className="text-xl">{currentProfile.age}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="MapPin" size={16} />
                  <span className="text-sm">{currentProfile.city}</span>
                </div>
                <p className="text-sm mb-3 line-clamp-2">{currentProfile.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-center gap-6 mt-8">
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Icon name="X" size={32} />
            </Button>

            <Button
              size="lg"
              onClick={() => handleSwipe('right')}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg"
            >
              <Icon name="Heart" size={36} />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="w-16 h-16 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
            >
              <Icon name="RotateCw" size={24} />
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Осталось анкет: {profiles.length - currentIndex - 1}
          </p>
        </div>
      </div>
    </div>
  );
}
