import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { useRef } from 'react';

export interface SwipeProfile {
  id: number;
  name: string;
  age: number;
  city: string;
  photo: string;
  bio: string;
  interests: string[];
  verified: boolean;
}

interface SwipeCardProps {
  profile: SwipeProfile;
  swipeDirection: 'left' | 'right' | null;
  dragOffset: { x: number; y: number };
  isDragging: boolean;
  cardAnimation: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  onDragStart: (clientX: number, clientY: number) => void;
  onDragMove: (clientX: number, clientY: number) => void;
  onDragEnd: () => void;
  onSkip: () => void;
}

export default function SwipeCard({
  profile,
  swipeDirection,
  dragOffset,
  isDragging,
  cardAnimation,
  onSwipe,
  onDragStart,
  onDragMove,
  onDragEnd,
  onSkip,
}: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  return (
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
        onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
        onMouseMove={(e) => onDragMove(e.clientX, e.clientY)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={onDragEnd}
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
            src={profile.photo}
            alt={profile.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-3xl font-bold">{profile.name}</h3>
              <span className="text-2xl">{profile.age}</span>
              {profile.verified && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Icon name="Check" size={16} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3 text-white/90">
              <Icon name="MapPin" size={16} />
              <span>{profile.city}</span>
            </div>
            <p className="text-sm text-white/80 mb-3">{profile.bio}</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-center items-center gap-6 mt-8">
        <Button
          size="lg"
          variant="outline"
          onClick={() => onSwipe('left')}
          className="w-16 h-16 rounded-full border-2 border-red-500 text-red-500 bg-white/90 hover:bg-white hover:text-red-600 shadow-lg"
        >
          <Icon name="X" size={24} />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => onSwipe('right')}
          className="w-20 h-20 rounded-full border-2 border-green-500 text-green-500 bg-white/90 hover:bg-white hover:text-green-600 shadow-lg scale-110"
        >
          <Icon name="Heart" size={28} />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={onSkip}
          className="w-16 h-16 rounded-full border-2 border-blue-500 text-blue-500 bg-white/90 hover:bg-white hover:text-blue-600 shadow-lg"
        >
          <Icon name="RotateCw" size={24} />
        </Button>
      </div>
    </div>
  );
}
