import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { UserAd, AdResponse } from '@/types';

interface MyAdCardProps {
  ad: UserAd;
  onDelete: (adId: number) => void;
  onRenew: (adId: number) => void;
  onComplete: (adId: number) => void;
  onBoost: (adId: number) => void;
  onViewResponse: (ad: UserAd, response: AdResponse) => void;
}

export const MyAdCard = ({ 
  ad, 
  onDelete, 
  onRenew, 
  onComplete, 
  onBoost, 
  onViewResponse 
}: MyAdCardProps) => {
  const pendingResponses = ad.responses?.filter(r => r.status === 'pending').length || 0;
  const isBoostedActive = ad.isBoosted && ad.boostedUntil && new Date(ad.boostedUntil) > new Date();
  const boostedTimeLeft = isBoostedActive && ad.boostedUntil 
    ? Math.max(0, Math.floor((new Date(ad.boostedUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60)))
    : 0;

  const promotionConfig = {
    raise: { color: 'border-blue-500', gradient: 'from-blue-500 via-cyan-500 to-blue-500' },
    highlight: { color: 'border-purple-500', gradient: 'from-purple-500 via-pink-500 to-purple-500' },
    pin: { color: 'border-orange-500', gradient: 'from-orange-500 via-red-500 to-orange-500' },
    premium: { color: 'border-yellow-500', gradient: 'from-yellow-500 via-amber-500 to-yellow-500' }
  };

  const promotion = isBoostedActive && ad.promotionType ? promotionConfig[ad.promotionType] : null;
  
  return (
    <Card className={`hover:shadow-lg transition-shadow relative overflow-hidden ${isBoostedActive && promotion ? `border-2 ${promotion.color} shadow-xl` : ''}`}>
      {isBoostedActive && promotion && (
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${promotion.gradient} animate-pulse`} />
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant={ad.type === 'service_offer' ? 'default' : 'secondary'}>
                {ad.type === 'service_offer' ? 'Предложение услуги' : 'Запрос услуги'}
              </Badge>
              <Badge variant="outline">{ad.category}</Badge>
              {isBoostedActive && ad.promotionType === 'raise' && (
                <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <Icon name="TrendingUp" size={12} className="mr-1" />
                  Поднято {boostedTimeLeft}ч
                </Badge>
              )}
              {isBoostedActive && ad.promotionType === 'highlight' && (
                <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Icon name="Palette" size={12} className="mr-1" />
                  Выделено {Math.floor(boostedTimeLeft / 24)}д
                </Badge>
              )}
              {isBoostedActive && ad.promotionType === 'pin' && (
                <Badge variant="default" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <Icon name="Pin" size={12} className="mr-1" />
                  Закреплено {Math.floor(boostedTimeLeft / 24)}д
                </Badge>
              )}
              {isBoostedActive && ad.promotionType === 'premium' && (
                <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                  <Icon name="Crown" size={12} className="mr-1" />
                  Премиум {Math.floor(boostedTimeLeft / 24)}д
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1 truncate">{ad.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{ad.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-pink-500">
              {ad.price} {ad.currency}
            </div>
            {ad.priceType && (
              <div className="text-xs text-muted-foreground">
                {ad.priceType === 'hourly' && 'в час'}
                {ad.priceType === 'session' && 'за сеанс'}
                {ad.priceType === 'daily' && 'в день'}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {ad.audioGreetingUrl && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Mic" size={16} className="text-pink-500" />
              <span className="text-sm font-medium">Аудио-приветствие</span>
            </div>
            <AudioPlayer src={ad.audioGreetingUrl} />
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="Eye" size={16} />
              {ad.viewCount}
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={16} />
              {new Date(ad.createdAt).toLocaleDateString()}
            </div>
            {pendingResponses > 0 && (
              <Badge variant="destructive" className="gap-1">
                <Icon name="MessageCircle" size={14} />
                {pendingResponses} новых
              </Badge>
            )}
          </div>
        </div>

        {ad.status === 'active' && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBoost(ad.id)}
              className="gap-2 flex-1 min-w-[120px]"
            >
              <Icon name="TrendingUp" size={16} />
              Продвинуть
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onComplete(ad.id)}
              className="gap-2 flex-1 min-w-[120px]"
            >
              <Icon name="CheckCircle" size={16} />
              Завершить
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(ad.id)}
              className="gap-2 text-destructive hover:text-destructive flex-1 min-w-[120px]"
            >
              <Icon name="Trash2" size={16} />
              Удалить
            </Button>
          </div>
        )}

        {ad.status !== 'active' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRenew(ad.id)}
              className="gap-2 flex-1"
            >
              <Icon name="RefreshCw" size={16} />
              Возобновить
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(ad.id)}
              className="gap-2 text-destructive hover:text-destructive flex-1"
            >
              <Icon name="Trash2" size={16} />
              Удалить
            </Button>
          </div>
        )}

        {ad.responses && ad.responses.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Icon name="MessageCircle" size={16} />
              Отклики ({ad.responses.length})
            </h4>
            <div className="space-y-2">
              {ad.responses.slice(0, 3).map((response) => (
                <div
                  key={response.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => onViewResponse(ad, response)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback>{response.authorName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{response.authorName}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {response.message}
                      </div>
                    </div>
                  </div>
                  <Badge variant={
                    response.status === 'pending' ? 'default' :
                    response.status === 'accepted' ? 'default' : 'secondary'
                  }>
                    {response.status === 'pending' && 'Новый'}
                    {response.status === 'accepted' && 'Принят'}
                    {response.status === 'rejected' && 'Отклонен'}
                  </Badge>
                </div>
              ))}
              {ad.responses.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full">
                  Показать все отклики ({ad.responses.length})
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
