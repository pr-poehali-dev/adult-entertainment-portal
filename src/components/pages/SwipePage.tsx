import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import MatchChatModal from './MatchChatModal';
import { pushNotificationService } from '@/utils/pushNotifications';

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
  const [matchedProfiles, setMatchedProfiles] = useState<SwipeProfile[]>([]);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<SwipeProfile | null>(null);
  const matchSoundRef = useRef<HTMLAudioElement | null>(null);
  const likeSoundRef = useRef<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [cardAnimation, setCardAnimation] = useState(true);

  const currentProfile = profiles[currentIndex];

  useEffect(() => {
    matchSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzGH0fPTgjMGHm7A7+OZSA0PS6Lf8LljHQU2jdXzzn0pBSh+y/Hej0EKEly16+qmVBIJRJzg8sFuIwcugM/z1YU1Bx1rwO/jmUoNDkug3vC3YxwFN4/U8s98KQUofsvx3o9BCRNctuvqplQSCUOb3/HCbyQHLX/P89aGNgcdbL/u4ppLDQ5Kn93vt2IdBTiP0/LOfCgEKH7M8d+PQQkSW7Xs6qdVEglCmt7xw3AlByx+zvPXhzYHHmy/7uKbTA0NSp/d7rdiHAU4jtLyzn0oBSh+zPHfj0EJEVq07OmoVhIJQZnd8cR0JgcrfM3z2Ig3Bx5tv+zjnE0ODUme3O+0YRwEOIzR8c99KQUoffzx4JBBChFYs+vqqlYTCUCY3fHGdSYHKnrL8tmKOAcdbb7r45xNDg1JntvutWIcBDeL0fHOfioFJ378+eGRQQoRVrLq6qtXEwo+ltvxx3YnByl4yfLaizgHHGy97OScTg4NSJ3a7rVjHAQ3idDx0H8qBSd7+/nikkIKEFSw6OnrV1QKPZbZ8cl4KAcnds/z24s4BxpquuvkmUoLDEed2O+yYRsDN4jP8dGAKgUme/v54pJCCg9Srevp7FlXCzuU1+/KeCgHJXLL89yMOQcZaLfq5ZlMDAtGm9fvs2IcAzWGzvDTgisEJXr7+uOUQwsPUKrn6uxaVgs7ktXuynooBSNuy/PdqTsFGGW06OWaTQwKRZnW7rNiGwM0hM3v1IMsBCR5+/rpk0MLDk6o5ejsWkcKOpDU7s16KAYhbc7y3Ko7BRdks+fmnEwLCUOX1O+zYRoCNILN7taELQQif/z66pRDDBBMpuXn7V1NDDSP0+7Oei4MIXHP8t6rPQgWYbLm5pxNCglCldLvtWEaAjSBzO/XhS0EInr8+OqVRAwNTKTl5u1dTgwyjdLtz3ouCiFuzvLfqz0HFmCx5eacTQoJQ5PQ77dhGgIygMvv2IYuBCF5+vfqlkQNCUqj5OXuYFEMMIvR7NB7LwohbMzy4Kw+BxVescTjnE0KCUKRzu61YBkCMX/K79iGLgQhePr36pdFDQlIoeTk7mFSDC6J0OzQey8KIGrL8uCsPgcVX7LD45tNCglBj83tuWAZAi9+ye/Yhy8EIXn69+uYRQ0JR5/k5O5iUgwthtDrz3wvCh9px/LhrtAIFV6xwuKbTgoJQY7N7LlgGAItfsjv2IcvBCF4+vfrmEYOCEeg5OPuY1IMK4TO69F8MAocaMjy4a7RCBRdssDim04LCUGOzO26YRgCLH3I79mJMAQgePn47JlGDghFnuLi7mNUDCqDzevSfTEKG2fI8uGu0ggUXbK/4ZpOCglAjMrtumEXAit8x+/ZiTAFIHj5+OybRw4HRJ3i4u5kVQwog8vq0n4xCxpnx/LirtMIE16xvuCZTwoHQYrJ7rpgFwIre8fv2YkxBB94+Pjsm0gOB0Kb4uHuZFYMJ4LJ6tN+MwoZZsfw4q7TCBNesL/fmU8KB0CJye67YRYCKnrG79qKMQQeePj47JxIDAdCmuLh72VWDCaBye3SfzULGGTH8OOu0wgSXa++35lPCgc/h8fvvGIVASl6xu/aijIEHnf4+OydSA4HQpni4u5lVwwmf8jt0oA0CxhjxvDjr9MJEV2svuCaUAoGPoXG77xjFQEoecXv24ozBB52+Pjtng==');
    likeSoundRef.current = new Audio('data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU4AAAA=');
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setDragOffset({ x: 0, y: 0 });
    
    if (direction === 'right') {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      likeSoundRef.current?.play().catch(() => {});
      
      const isMatch = Math.random() > 0.7;
      if (isMatch) {
        setMatches(prev => prev + 1);
        setMatchedProfiles(prev => [...prev, currentProfile]);
        setShowMatchAnimation(true);
        
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 400]);
        }
        
        matchSoundRef.current?.play().catch(() => {});
        onMatch?.(currentProfile.id);
        
        pushNotificationService.showMatchNotification(
          currentProfile.name,
          currentProfile.photo
        );
        
        setTimeout(() => {
          setShowMatchAnimation(false);
          setCurrentMatch(currentProfile);
          setShowMatchModal(true);
        }, 2000);
      }
    } else {
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }

    setTimeout(() => {
      setSwipeDirection(null);
      setCardAnimation(false);
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => setCardAnimation(true), 50);
    }, 300);
  };

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      handleSwipe(dragOffset.x > 0 ? 'right' : 'left');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
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
            Знакомства
          </h1>
          {matches > 0 && (
            <Badge className="mt-2 bg-gradient-to-r from-pink-500 to-purple-600">
              <Icon name="Heart" size={14} className="mr-1" />
              {matches} {matches === 1 ? 'совпадение' : 'совпадений'}
            </Badge>
          )}
        </div>

        <div className="relative">
          <Card
            ref={cardRef}
            className={`overflow-hidden cursor-grab active:cursor-grabbing touch-none ${
              cardAnimation ? 'animate-scale-up' : ''
            } ${
              isDragging ? '' : 'transition-all duration-300'
            } transform ${
              swipeDirection === 'left'
                ? '-translate-x-full rotate-12 opacity-0'
                : swipeDirection === 'right'
                ? 'translate-x-full -rotate-12 opacity-0'
                : ''
            }`}
            style={{
              transform: isDragging
                ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`
                : undefined,
              opacity: isDragging ? 1 - Math.abs(dragOffset.x) / 300 : undefined,
            }}
            onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleDragEnd}
          >
            <div className="relative aspect-[2/3] md:aspect-[3/4]">
              {isDragging && dragOffset.x > 50 && (
                <div className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-2xl rotate-12 z-10 shadow-lg">
                  LIKE
                </div>
              )}
              {isDragging && dragOffset.x < -50 && (
                <div className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-2xl -rotate-12 z-10 shadow-lg">
                  NOPE
                </div>
              )}
              <img
                src={currentProfile.photo}
                alt={currentProfile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/20 to-transparent" />
              
              <div className="absolute top-6 left-0 right-0 px-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-bold text-white drop-shadow-lg">{currentProfile.name}</h2>
                    <span className="text-2xl text-white/90 drop-shadow-lg">{currentProfile.age}</span>
                  </div>
                  {currentProfile.verified && (
                    <Badge className="bg-blue-500 text-white">
                      <Icon name="CheckCircle2" size={14} className="mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Icon name="MapPin" size={16} className="text-white drop-shadow-lg" />
                  <span className="text-sm text-white/90 drop-shadow-lg">{currentProfile.city}</span>
                </div>
                <p className="text-sm mt-3 line-clamp-2 text-white/90 drop-shadow-lg">{currentProfile.bio}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {currentProfile.interests.map((interest, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6 px-6">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleSwipe('left')}
                  className="w-16 h-16 rounded-full border-2 border-red-500 text-red-500 bg-white/90 hover:bg-white hover:text-red-600 shadow-lg"
                >
                  <Icon name="X" size={32} />
                </Button>

                <Button
                  size="lg"
                  onClick={() => handleSwipe('right')}
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-xl"
                >
                  <Icon name="Heart" size={36} />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="w-16 h-16 rounded-full border-2 border-blue-500 text-blue-500 bg-white/90 hover:bg-white hover:text-blue-600 shadow-lg"
                >
                  <Icon name="RotateCw" size={24} />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Осталось анкет: {profiles.length - currentIndex - 1}
          </p>
        </div>

        {matchedProfiles.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Ваши совпадения ({matchedProfiles.length})</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: 'matches' });
                  window.dispatchEvent(event);
                }}
                className="text-primary"
              >
                Все
                <Icon name="ChevronRight" size={16} className="ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {matchedProfiles.slice(-6).reverse().map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => {
                    setCurrentMatch(profile);
                    setShowMatchModal(true);
                  }}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-pink-500 hover:scale-105 transition-transform"
                >
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-bold">{profile.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <MatchChatModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchName={currentMatch?.name || ''}
        matchPhoto={currentMatch?.photo || ''}
        onSendMessage={(msg) => {
          console.log('Отправлено сообщение:', msg, 'для', currentMatch?.name);
        }}
      />
    </div>
  );
}