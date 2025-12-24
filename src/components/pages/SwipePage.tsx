import { useState, useEffect, useRef } from 'react';
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
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const matchSoundRef = useRef<HTMLAudioElement | null>(null);
  const likeSoundRef = useRef<HTMLAudioElement | null>(null);

  const currentProfile = profiles[currentIndex];

  useEffect(() => {
    matchSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzGH0fPTgjMGHm7A7+OZSA0PS6Lf8LljHQU2jdXzzn0pBSh+y/Hej0EKEly16+qmVBIJRJzg8sFuIwcugM/z1YU1Bx1rwO/jmUoNDkug3vC3YxwFN4/U8s98KQUofsvx3o9BCRNctuvqplQSCUOb3/HCbyQHLX/P89aGNgcdbL/u4ppLDQ5Kn93vt2IdBTiP0/LOfCgEKH7M8d+PQQkSW7Xs6qdVEglCmt7xw3AlByx+zvPXhzYHHmy/7uKbTA0NSp/d7rdiHAU4jtLyzn0oBSh+zPHfj0EJEVq07OmoVhIJQZnd8cR0JgcrfM3z2Ig3Bx5tv+zjnE0ODUme3O+0YRwEOIzR8c99KQUoffzx4JBBChFYs+vqqlYTCUCY3fHGdSYHKnrL8tmKOAcdbb7r45xNDg1JntvutWIcBDeL0fHOfioFJ378+eGRQQoRVrLq6qtXEwo+ltvxx3YnByl4yfLaizgHHGy97OScTg4NSJ3a7rVjHAQ3idDx0H8qBSd7+/nikkIKEFSw6OnrV1QKPZbZ8cl4KAcnds/z24s4BxpquuvkmUoLDEed2O+yYRsDN4jP8dGAKgUme/v54pJCCg9Srevp7FlXCzuU1+/KeCgHJXLL89yMOQcZaLfq5ZlMDAtGm9fvs2IcAzWGzvDTgisEJXr7+uOUQwsPUKrn6uxaVgs7ktXuynooBSNuy/PdqTsFGGW06OWaTQwKRZnW7rNiGwM0hM3v1IMsBCR5+/rpk0MLDk6o5ejsWkcKOpDU7s16KAYhbc7y3Ko7BRdks+fmnEwLCUOX1O+zYRoCNILN7taELQQif/z66pRDDBBMpuXn7V1NDDSP0+7Oei4MIXHP8t6rPQgWYbLm5pxNCglCldLvtWEaAjSBzO/XhS0EInr8+OqVRAwNTKTl5u1dTgwyjdLtz3ouCiFuzvLfqz0HFmCx5eacTQoJQ5PQ77dhGgIygMvv2IYuBCF5+vfqlkQNCUqj5OXuYFEMMIvR7NB7LwohbMzy4Kw+BxVescTjnE0KCUKRzu61YBkCMX/K79iGLgQhePr36pdFDQlIoeTk7mFSDC6J0OzQey8KIGrL8uCsPgcVX7LD45tNCglBj83tuWAZAi9+ye/Yhy8EIXn69+uYRQ0JR5/k5O5iUgwthtDrz3wvCh9px/LhrtAIFV6xwuKbTgoJQY7N7LlgGAItfsjv2IcvBCF4+vfrmEYOCEeg5OPuY1IMK4TO69F8MAocaMjy4a7RCBRdssDim04LCUGOzO26YRgCLH3I79mJMAQgePn47JlGDghFnuLi7mNUDCqDzevSfTEKG2fI8uGu0ggUXbK/4ZpOCglAjMrtumEXAit8x+/ZiTAFIHj5+OybRw4HRJ3i4u5kVQwog8vq0n4xCxpnx/LirtMIE16xvuCZTwoHQYrJ7rpgFwIre8fv2YkxBB94+Pjsm0gOB0Kb4uHuZFYMJ4LJ6tN+MwoZZsfw4q7TCBNesL/fmU8KB0CJye67YRYCKnrG79qKMQQeePj47JxIDAdCmuLh72VWDCaBye3SfzULGGTH8OOu0wgSXa++35lPCgc/h8fvvGIVASl6xu/aijIEHnf4+OydSA4HQpni4u5lVwwmf8jt0oA0CxhjxvDjr9MJEV2svuCaUAoGPoXG77xjFQEoecXv24ozBB52+Pjtng==');
    likeSoundRef.current = new Audio('data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU4AAAA=');
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    if (direction === 'right') {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      likeSoundRef.current?.play().catch(() => {});
      
      const isMatch = Math.random() > 0.7;
      if (isMatch) {
        setMatches(prev => prev + 1);
        setShowMatchAnimation(true);
        
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 400]);
        }
        
        matchSoundRef.current?.play().catch(() => {});
        onMatch?.(currentProfile.id);
        
        setTimeout(() => setShowMatchAnimation(false), 2000);
      }
    } else {
      if (navigator.vibrate) {
        navigator.vibrate(30);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-20 pb-24 px-4 relative">
      {showMatchAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="text-center animate-scale-up">
            <div className="text-8xl mb-4 animate-bounce">💕</div>
            <h2 className="text-4xl font-bold text-white mb-2">Совпадение!</h2>
            <p className="text-xl text-white/90">Вы понравились друг другу</p>
          </div>
        </div>
      )}
      
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