import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { UserAd } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AdRespondModal } from './AdRespondModal';
import { AudioPlayer } from '@/components/audio/AudioPlayer';

interface AdRequestCardProps {
  ad: UserAd;
  canRespond: boolean;
  index: number;
}

export const AdRequestCard = ({ ad, canRespond, index }: AdRequestCardProps) => {
  const [showRespondModal, setShowRespondModal] = useState(false);

  return (
    <>
      <Card 
        className="group hover:scale-[1.02] transition-all duration-300 bg-card border-border hover:border-primary/50 hover:shadow-xl animate-fade-in relative overflow-hidden"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60" />
        
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-primary/20 text-primary">
                {ad.authorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{ad.authorName}</span>
                <Badge variant="outline" className="text-xs">Мужчина</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Clock" size={12} />
                <span>{new Date(ad.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-xl text-primary">{ad.price} ₽</div>
              {ad.duration && <div className="text-xs text-muted-foreground">{ad.duration} ч</div>}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge className="bg-gradient-to-r from-primary to-primary/90">
              {ad.category}
            </Badge>
            <Badge variant="secondary">
              <Icon name="Search" size={12} className="mr-1" />
              Ищет девушку
            </Badge>
            {ad.audioGreeting && (
              <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
                <Icon name="Volume2" size={12} className="mr-1 text-purple-500" />
                <span className="text-purple-700 dark:text-purple-300">С голосом</span>
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-lg mb-2">{ad.title}</h3>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {ad.audioGreeting && (
              <div>
                <AudioPlayer 
                  audioUrl={ad.audioGreeting} 
                  duration={ad.audioGreetingDuration}
                />
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {ad.description}
              </p>
            </div>

            {ad.lookingFor && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs font-medium text-primary mb-1">Ищет:</p>
                <p className="text-sm line-clamp-2">{ad.lookingFor}</p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Icon name="Info" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Готов заплатить {ad.price} ₽ {ad.duration ? `за ${ad.duration} ч` : ''}
              </span>
            </div>

            {canRespond ? (
              <Button 
                onClick={() => setShowRespondModal(true)}
                className="w-full gap-2 bg-gradient-to-r from-primary to-primary/90"
              >
                <Icon name="MessageCircle" size={18} />
                Откликнуться
              </Button>
            ) : (
              <div className="text-center py-2 text-sm text-muted-foreground">
                Только девушки могут откликнуться
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showRespondModal && (
        <AdRespondModal 
          ad={ad}
          onClose={() => setShowRespondModal(false)}
          onRespond={(message) => {
            console.log('Response sent:', message);
            setShowRespondModal(false);
          }}
        />
      )}
    </>
  );
};