import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import MatchChatModal from './MatchChatModal';
import { pushNotificationService } from '@/utils/pushNotifications';
import SwipeFiltersModal, { SwipeFilters } from './SwipeFilters';
import SwipeCard, { SwipeProfile } from './SwipeCard';
import SwipeHeader from './SwipeHeader';
import SwipeLimitModal from './SwipeLimitModal';

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
  const [profiles] = useState<SwipeProfile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [matches, setMatches] = useState<number>(0);
  const [matchedProfiles, setMatchedProfiles] = useState<SwipeProfile[]>([]);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<SwipeProfile | null>(null);
  const matchSoundRef = useRef<HTMLAudioElement | null>(null);
  const likeSoundRef = useRef<HTMLAudioElement | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [cardAnimation, setCardAnimation] = useState(true);
  const [viewedToday, setViewedToday] = useState(0);
  const [isPremium] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SwipeFilters>({
    ageRange: [18, 75],
    heightRange: [150, 220],
    location: 'Все города',
    lookingFor: 'any',
    verifiedOnly: false,
  });
  const [filteredProfiles, setFilteredProfiles] = useState<SwipeProfile[]>(mockProfiles);
  
  const FREE_DAILY_LIMIT = 20;
  const isLimitReached = !isPremium && viewedToday >= FREE_DAILY_LIMIT;

  const currentProfile = filteredProfiles[currentIndex];
  const activeFiltersCount = 
    (filters.location !== 'Все города' ? 1 : 0) + 
    (filters.lookingFor !== 'any' ? 1 : 0) + 
    (filters.verifiedOnly ? 1 : 0) + 
    (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 75 ? 1 : 0) +
    (filters.heightRange[0] !== 150 || filters.heightRange[1] !== 220 ? 1 : 0);

  useEffect(() => {
    matchSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzGH0fPTgjMGHm7A7+OZSA0PS6Lf8LljHQU2jdXzzn0pBSh+y/Hej0EKEly16+qmVBIJRJzg8sFuIwcugM/z1YU1Bx1rwO/jmUoNDkug3vC3YxwFN4/U8s98KQUofsvx3o9BCRNctuvqplQSCUOb3/HCbyQHLX/P89aGNgcdbL/u4ppLDQ5Kn93vt2IdBTiP0/LOfCgEKH7M8d+PQQkSW7Xs6qdVEglCmt7xw3AlByx+zvPXhzYHHmy/7uKbTA0NSp/d7rdiHAU4jtLyzn0oBSh+zPHfj0EJEVq07OmoVhIJQZnd8cR0JgcrfM3z2Ig3Bx5tv+zjnE0ODUme3O+0YRwEOIzR8c99KQUoffzx4JBBChFYs+vqqlYTCUCY3fHGdSYHKnrL8tmKOAcdbb7r45xNDg1JntvutWIcBDeL0fHOfioFJ378+eGRQQoRVrLq6qtXEwo+ltvxx3YnByl4yfLaizgHHGy97OScTg4NSJ3a7rVjHAQ3idDx0H8qBSd7+/nikkIKEFSw6OnrV1QKPZbZ8cl4KAcnds/z24s4BxpquuvkmUoLDEed2O+yYRsDN4jP8dGAKgUme/v54pJCCg9Srevp7FlXCzuU1+/KeCgHJXLL89yMOQcZaLfq5ZlMDAtGm9fvs2IcAzWGzvDTgisEJXr7+uOUQwsPUKrn6uxaVgs7ktXuynooBSNuy/PdqTsFGGW06OWaTQwKRZnW7rNiGwM0hM3v1IMsBCR5+/rpk0MLDk6o5ejsWkcKOpDU7s16KAYhbc7y3Ko7BRdks+fmnEwLCUOX1O+zYRoCNILN7taELQQif/z66pRDDBBMpuXn7V1NDDSP0+7Oei4MIXHP8t6rPQgWYbLm5pxNCglCldLvtWEaAjSBzO/XhS0EInr8+OqVRAwNTKTl5u1dTgwyjdLtz3ouCiFuzvLfqz0HFmCx5eacTQoJQ5PQ77dhGgIygMvv2IYuBCF5+vfqlkQNCUqj5OXuYFEMMIvR7NB7LwohbMzy4Kw+BxVescTjnE0KCUKRzu61YBkCMX/K79iGLgQhePr36pdFDQlIoeTk7mFSDC6J0OzQey8KIGrL8uCsPgcVX7LD45tNCglBj83tuWAZAi9+ye/Yhy8EIXn69+uYRQ0JR5/k5O5iUgwthtDrz3wvCh9px/LhrtAIFV6xwuKbTgoJQY7N7LlgGAItfsjv2IcvBCF4+vfrmEYOCEeg5OPuY1IMK4TO69F8MAocaMjy4a7RCBRdssDim04LCUGOzO26YRgCLH3I79mJMAQgePn47JlGDghFnuLi7mNUDCqDzevSfTEKG2fI8uGu0ggUXbK/4ZpOCglAjMrtumEXAit8x+/ZiTAFIHj5+OybRw4HRJ3i4u5kVQwog8vq0n4xCxpnx/LirtMIE16xvuCZTwoHQYrJ7rpgFwIre8fv2YkxBB94+Pjsm0gOB0Kb4uHuZFYMJ4LJ6tN+MwoZZsfw4q7TCBNesL/fmU8KB0CJye67YRYCKnrG79qKMQQeePj47JxIDAdCmuLh72VWDCaBye3SfzULGGTH8OOu0wgSXa++35lPCgc/h8fvvGIVASl6xu/aijIEHnf4+OydSA4HQpni4u5lVwwmf8jt0oA0CxhjxvDjr9MJEV2svuCaUAoGPoXG77xjFQEoecXv24ozBB52+Pjtng==');
    likeSoundRef.current = new Audio('data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU4AAAA=');
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isLimitReached) {
      setShowLimitModal(true);
      return;
    }
    
    setSwipeDirection(direction);
    setDragOffset({ x: 0, y: 0 });
    setViewedToday(prev => prev + 1);
    
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
    const filtered = profiles.filter(profile => {
      const ageMatch = profile.age >= filters.ageRange[0] && profile.age <= filters.ageRange[1];
      const locationMatch = filters.location === 'Все города' || profile.city === filters.location;
      const verifiedMatch = !filters.verifiedOnly || profile.verified;
      
      return ageMatch && locationMatch && verifiedMatch;
    });
    setFilteredProfiles(filtered);
    setCurrentIndex(0);
  }, [filters, profiles]);

  useEffect(() => {
    if (currentIndex >= filteredProfiles.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, filteredProfiles.length]);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('swipe_date');
    const savedCount = localStorage.getItem('swipe_count');
    
    if (savedDate === today && savedCount) {
      setViewedToday(parseInt(savedCount));
    } else {
      localStorage.setItem('swipe_date', today);
      localStorage.setItem('swipe_count', '0');
      setViewedToday(0);
    }
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('swipe_date', today);
    localStorage.setItem('swipe_count', viewedToday.toString());
  }, [viewedToday]);

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
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 overflow-hidden">
      {showMatchAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="text-center animate-scale-up">
            <div className="text-8xl mb-6 animate-bounce">💕</div>
            <h2 className="text-4xl font-bold text-white mb-4">Взаимная симпатия!</h2>
            <p className="text-xl text-white/90">Вы понравились друг другу</p>
          </div>
        </div>
      )}
      
      <div className="h-full overflow-y-auto pt-20 pb-24 px-4">
        <div className="max-w-md mx-auto">
          <SwipeHeader
            matches={matches}
            viewedToday={viewedToday}
            freeLimit={FREE_DAILY_LIMIT}
            isPremium={isPremium}
            filteredProfilesCount={filteredProfiles.length}
            currentIndex={currentIndex}
            activeFiltersCount={activeFiltersCount}
            onOpenFilters={() => setShowFilters(true)}
          />

        <SwipeCard
          profile={currentProfile}
          swipeDirection={swipeDirection}
          dragOffset={dragOffset}
          isDragging={isDragging}
          cardAnimation={cardAnimation}
          onSwipe={handleSwipe}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onSkip={() => setCurrentIndex(prev => prev + 1)}
        />

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Осталось анкет: {filteredProfiles.length - currentIndex - 1}
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
                  const event = new CustomEvent('navigate', { detail: 'messages' });
                  window.dispatchEvent(event);
                }}
              >
                Смотреть все
                <Icon name="ChevronRight" size={16} className="ml-1" />
              </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {matchedProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => {
                    setCurrentMatch(profile);
                    setShowMatchModal(true);
                  }}
                  className="flex-shrink-0 relative group"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-pink-500 ring-offset-2">
                    <img
                      src={profile.photo}
                      alt={profile.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Icon name="Heart" size={12} className="text-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>

      {showMatchModal && currentMatch && (
        <MatchChatModal
          profile={currentMatch}
          onClose={() => {
            setShowMatchModal(false);
            setCurrentMatch(null);
          }}
        />
      )}

      <SwipeLimitModal
        show={showLimitModal}
        freeLimit={FREE_DAILY_LIMIT}
        onClose={() => setShowLimitModal(false)}
        onGetPremium={() => {
          setShowLimitModal(false);
          const event = new CustomEvent('navigate', { detail: 'premium' });
          window.dispatchEvent(event);
        }}
      />

      {showFilters && (
        <SwipeFiltersModal
          filters={filters}
          onApply={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}