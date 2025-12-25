import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { UserAd } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AudioPlayer } from '@/components/audio/AudioPlayer';

interface AudioModerationStatus {
  adId: number;
  status: 'pending' | 'approved' | 'rejected';
  moderatedAt?: string;
  moderatorNote?: string;
  aiAnalysis?: {
    transcript: string;
    confidence: number;
    aiRecommendation: boolean;
  };
}

interface AudioModerationCardProps {
  ad: UserAd;
  moderation: AudioModerationStatus | undefined;
  showActions?: boolean;
  aiProcessing: number[];
  onAIModeration: (ad: UserAd) => void;
  onApprove: (ad: UserAd) => void;
  onReject: (ad: UserAd) => void;
  onUndo: (ad: UserAd) => void;
}

export const AudioModerationCard = ({
  ad,
  moderation,
  showActions = true,
  aiProcessing,
  onAIModeration,
  onApprove,
  onReject,
  onUndo,
}: AudioModerationCardProps) => {
  return (
    <Card key={ad.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary/20 text-primary">
              {ad.authorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold">{ad.authorName}</span>
              <Badge variant="outline" className="text-xs">
                {ad.authorRole === 'buyer' ? 'Мужчина' : 'Девушка'}
              </Badge>
              {moderation?.status === 'approved' && (
                <Badge className="bg-green-500">
                  <Icon name="CheckCircle" size={12} className="mr-1" />
                  Одобрено
                </Badge>
              )}
              {moderation?.status === 'rejected' && (
                <Badge variant="destructive">
                  <Icon name="XCircle" size={12} className="mr-1" />
                  Отклонено
                </Badge>
              )}
              {moderation?.status === 'pending' && (
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  <Icon name="Clock" size={12} className="mr-1" />
                  На модерации
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Calendar" size={12} />
              <span>{new Date(ad.createdAt).toLocaleString('ru-RU')}</span>
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
            <Icon name="Megaphone" size={12} className="mr-1" />
            {ad.type === 'service_offer' ? 'Предложение' : 'Запрос'}
          </Badge>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <Icon name="Volume2" size={12} className="mr-1 text-purple-500" />
            <span className="text-purple-700 dark:text-purple-300">С голосом</span>
          </Badge>
          {ad.isBoosted && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
              <Icon name="TrendingUp" size={12} className="mr-1" />
              В топе
            </Badge>
          )}
        </div>

        <h3 className="font-semibold text-lg">{ad.title}</h3>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {ad.description}
        </p>

        {ad.audioGreeting && (
          <AudioPlayer 
            audioUrl={ad.audioGreeting} 
            duration={ad.audioGreetingDuration}
          />
        )}

        {moderation?.aiAnalysis && (
          <div className={`p-3 border rounded-lg ${
            moderation.aiAnalysis.aiRecommendation 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Sparkles" size={14} className={moderation.aiAnalysis.aiRecommendation ? 'text-green-500' : 'text-amber-500'} />
              <p className="text-xs font-medium">
                AI-анализ (уверенность: {moderation.aiAnalysis.confidence}%)
              </p>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Распознанный текст:</p>
            <p className="text-sm">{moderation.aiAnalysis.transcript}</p>
          </div>
        )}

        {moderation?.moderatorNote && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-xs font-medium text-destructive mb-1">Причина отклонения:</p>
            <p className="text-sm">{moderation.moderatorNote}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Icon name="Eye" size={12} />
              <span>{ad.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="MessageCircle" size={12} />
              <span>{ad.responses?.length || 0}</span>
            </div>
          </div>
          <span>ID: #{ad.id}</span>
        </div>

        {showActions && (
          <div className="space-y-2 pt-2">
            {moderation?.status === 'pending' && (
              <>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => onAIModeration(ad)}
                  disabled={aiProcessing.includes(ad.id)}
                >
                  {aiProcessing.includes(ad.id) ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      AI анализирует...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" size={16} className="mr-2" />
                      🤖 Проверить AI-модератором
                    </>
                  )}
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => onApprove(ad)}
                  >
                    <Icon name="CheckCircle" size={16} className="mr-2" />
                    Одобрить
                  </Button>
                  <Button 
                    variant="destructive"
                    className="flex-1"
                    onClick={() => onReject(ad)}
                  >
                    <Icon name="XCircle" size={16} className="mr-2" />
                    Отклонить
                  </Button>
                </div>
              </>
            )}
            {(moderation?.status === 'approved' || moderation?.status === 'rejected') && (
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => onUndo(ad)}
              >
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Отменить модерацию
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
