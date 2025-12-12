import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { VirtualPerformer } from './virtualData';

interface VirtualPerformerCardProps {
  performer: VirtualPerformer;
  onBookAudio: () => void;
  onBookVideo: () => void;
  onBookChat: () => void;
}

export const VirtualPerformerCard = ({
  performer,
  onBookAudio,
  onBookVideo,
  onBookChat,
}: VirtualPerformerCardProps) => {
  return (
    <Card className="hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-80 overflow-hidden">
        <img
          src={performer.photos[0]}
          alt={performer.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {performer.verified && (
            <Badge className="bg-green-500">
              <Icon name="CheckCircle2" size={14} className="mr-1" />
              Verified
            </Badge>
          )}
          {performer.vipStatus === 'vip' && (
            <Badge className="bg-primary">
              <Icon name="Crown" size={14} className="mr-1" />
              VIP
            </Badge>
          )}
          {performer.online && (
            <Badge className="bg-green-500 animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full mr-1.5" />
              Онлайн
            </Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-white font-bold text-xl">{performer.name}</h3>
              <p className="text-white/80 text-sm">
                {performer.age} лет • {performer.location}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-500/90 px-2 py-1 rounded">
              <Icon name="Star" size={14} className="text-white" />
              <span className="text-white font-semibold text-sm">{performer.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{performer.about}</p>

        <div className="flex flex-wrap gap-1">
          {performer.specialties.slice(0, 3).map((specialty, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {performer.specialties.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{performer.specialties.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">От</p>
            <p className="text-xl font-bold text-primary">
              {performer.pricePerMinute} ₽
            </p>
            <p className="text-xs text-muted-foreground">за минуту</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>{performer.minDuration}-{performer.maxDuration} мин</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          {performer.services.includes('audio') && (
            <Button
              onClick={onBookAudio}
              className="w-full"
              variant="outline"
              size="sm"
            >
              <Icon name="Phone" size={14} className="mr-1" />
              Аудио
            </Button>
          )}
          {performer.services.includes('video') && (
            <Button onClick={onBookVideo} className="w-full" size="sm">
              <Icon name="Video" size={14} className="mr-1" />
              Видео
            </Button>
          )}
          {performer.services.includes('chat') && (
            <Button
              onClick={onBookChat}
              className="w-full"
              variant="outline"
              size="sm"
            >
              <Icon name="MessageCircle" size={14} className="mr-1" />
              Чат
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
