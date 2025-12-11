import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { StripteaseAd } from './stripteaseData';

interface StripteaseAdCardProps {
  ad: StripteaseAd;
  onBook: () => void;
}

export const StripteaseAdCard = ({ ad, onBook }: StripteaseAdCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={ad.coverImage}
          alt={ad.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {ad.verified && (
            <Badge className="bg-blue-500 text-white">
              <Icon name="BadgeCheck" size={14} className="mr-1" />
              Проверен
            </Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-3">
            <img
              src={ad.avatar}
              alt={ad.name}
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">{ad.name}, {ad.age}</h3>
              <p className="text-white/90 text-sm flex items-center gap-1">
                <Icon name="MapPin" size={14} />
                {ad.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="font-bold">{ad.rating}</span>
            <span className="text-sm text-muted-foreground">({ad.reviewsCount})</span>
          </div>
          <Badge variant="secondary">
            <Icon name="Briefcase" size={14} className="mr-1" />
            {ad.experience}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{ad.about}</p>

        <div className="flex flex-wrap gap-1">
          {ad.specialties.slice(0, 3).map((specialty, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {ad.specialties.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{ad.specialties.length - 3}
            </Badge>
          )}
        </div>

        <div className="border-t pt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Цена за час</p>
            <p className="text-2xl font-bold text-primary">
              {ad.pricePerHour.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <Button onClick={onBook} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Icon name="Calendar" size={18} className="mr-2" />
            Забронировать
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
