import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export interface DatingProfile {
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

interface DatingProfileCardProps {
  profile: DatingProfile;
  onClick: () => void;
  showLikeButton?: boolean;
  onLike?: () => void;
  variant?: 'default' | 'liked' | 'match';
}

export const DatingProfileCard = ({ 
  profile, 
  onClick, 
  showLikeButton = false, 
  onLike,
  variant = 'default'
}: DatingProfileCardProps) => {
  const getBorderColor = () => {
    if (variant === 'liked') return 'border-2 border-pink-300';
    if (variant === 'match') return 'border-2 border-green-300';
    return '';
  };

  const getBadge = () => {
    if (variant === 'liked') {
      return (
        <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
          <Icon name="Heart" size={14} />
          Лайкнул(а) вас
        </div>
      );
    }
    if (variant === 'match') {
      return (
        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Icon name="Sparkles" size={14} />
          Матч!
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer group ${getBorderColor()}`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {getBadge()}
        {profile.online && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Онлайн
          </div>
        )}
        {profile.verified && variant === 'default' && (
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
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 break-words">
          {profile.about}
        </p>
        {showLikeButton && onLike ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            <Icon name="Heart" size={16} className="mr-2" />
            Ответить взаимностью
          </Button>
        ) : variant === 'match' ? (
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
              }}
              variant="outline"
              className="flex-1"
            >
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Icon name="MessageCircle" size={16} className="mr-2" />
              Написать
            </Button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </CardContent>
    </Card>
  );
};