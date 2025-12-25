import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { UserAd, Notification } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

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

interface AdminAudioGreetingsProps {
  onAddNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
}

export const AdminAudioGreetings = ({ onAddNotification }: AdminAudioGreetingsProps) => {
  const { toast } = useToast();
  
  const [ads] = useState<UserAd[]>([
    {
      id: 1,
      authorId: 1,
      authorName: 'Елена Романова',
      authorAvatar: '',
      authorRole: 'buyer',
      type: 'service_request',
      category: 'Классика',
      title: 'Ищу девушку для классического свидания',
      description: 'Хочу встретиться с девушкой для приятного вечера.',
      price: 5000,
      currency: 'RUB',
      duration: 2,
      status: 'active',
      createdAt: '2024-12-20T10:00:00Z',
      audioGreeting: 'https://example.com/audio1.mp3',
      audioGreetingDuration: 15,
      viewCount: 127,
      isBoosted: false,
      responses: []
    },
    {
      id: 2,
      authorId: 2,
      authorName: 'Иван Петров',
      authorAvatar: '',
      authorRole: 'buyer',
      type: 'service_request',
      category: 'Массаж',
      title: 'Ищу массажистку',
      description: 'Нужен профессиональный массаж на дому.',
      price: 3000,
      currency: 'RUB',
      duration: 1,
      status: 'active',
      createdAt: '2024-12-20T12:00:00Z',
      audioGreeting: 'https://example.com/audio2.mp3',
      audioGreetingDuration: 18,
      viewCount: 85,
      isBoosted: true,
      responses: []
    }
  ]);

  const [moderationStatuses, setModerationStatuses] = useState<AudioModerationStatus[]>([
    { adId: 1, status: 'pending' },
    { adId: 2, status: 'pending' }
  ]);

  const [selectedAd, setSelectedAd] = useState<UserAd | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [aiProcessing, setAiProcessing] = useState<number[]>([]);

  const getModeration = (adId: number) => {
    return moderationStatuses.find(m => m.adId === adId);
  };

  const handleAIModeration = async (ad: UserAd) => {
    if (!ad.audioGreeting) return;
    
    setAiProcessing(prev => [...prev, ad.id]);
    
    try {
      const audioResponse = await fetch(ad.audioGreeting);
      const audioBlob = await audioResponse.blob();
      
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      await new Promise((resolve) => {
        reader.onloadend = resolve;
      });
      
      const base64Audio = (reader.result as string).split(',')[1];
      
      const response = await fetch('https://functions.poehali.dev/64dd8681-70e5-4e25-b3c8-d218918038fc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioBase64: base64Audio,
          adTitle: ad.title,
          adDescription: ad.description
        })
      });
      
      const result = await response.json();
      
      if (result.approved) {
        setModerationStatuses(prev => prev.map(m => 
          m.adId === ad.id 
            ? { 
                ...m, 
                status: 'approved', 
                moderatedAt: new Date().toISOString(),
                aiAnalysis: {
                  transcript: result.transcript,
                  confidence: result.confidence,
                  aiRecommendation: true
                }
              }
            : m
        ));
        
        onAddNotification({
          type: 'audio_approved',
          title: '✅ Аудио-приветствие одобрено',
          text: `Ваше голосовое приветствие в объявлении "${ad.title}" прошло модерацию и теперь видно всем пользователям!`,
          adId: ad.id
        });
        
        toast({
          title: '🤖 AI одобрил аудио',
          description: `Объявление #${ad.id} автоматически одобрено. Уверенность: ${result.confidence}%`,
        });
      } else {
        setModerationStatuses(prev => prev.map(m => 
          m.adId === ad.id 
            ? { 
                ...m,
                aiAnalysis: {
                  transcript: result.transcript,
                  confidence: result.confidence,
                  aiRecommendation: false
                },
                moderatorNote: result.reason
              }
            : m
        ));
        
        toast({
          title: '🤖 AI рекомендует отклонить',
          description: `Причина: ${result.reason}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('AI moderation error:', error);
      toast({
        title: 'Ошибка AI-анализа',
        description: 'Не удалось проанализировать аудио. Проверьте вручную.',
        variant: 'destructive',
      });
    } finally {
      setAiProcessing(prev => prev.filter(id => id !== ad.id));
    }
  };

  const handleApprove = (ad: UserAd) => {
    setModerationStatuses(prev => prev.map(m => 
      m.adId === ad.id 
        ? { ...m, status: 'approved', moderatedAt: new Date().toISOString() }
        : m
    ));
    
    onAddNotification({
      type: 'audio_approved',
      title: '✅ Аудио-приветствие одобрено',
      text: `Ваше голосовое приветствие в объявлении "${ad.title}" прошло модерацию и теперь видно всем пользователям!`,
      adId: ad.id
    });
    
    toast({
      title: 'Аудио одобрено',
      description: `Голосовое приветствие в объявлении #${ad.id} одобрено. Пользователь получит уведомление.`,
    });
  };

  const handleReject = (ad: UserAd) => {
    setSelectedAd(ad);
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (!selectedAd) return;

    setModerationStatuses(prev => prev.map(m => 
      m.adId === selectedAd.id 
        ? { 
            ...m, 
            status: 'rejected', 
            moderatedAt: new Date().toISOString(),
            moderatorNote: rejectReason
          }
        : m
    ));
    
    onAddNotification({
      type: 'audio_rejected',
      title: '❌ Аудио-приветствие отклонено',
      text: `Ваше голосовое приветствие в объявлении "${selectedAd.title}" не прошло модерацию. Причина: ${rejectReason}`,
      adId: selectedAd.id,
      moderatorNote: rejectReason
    });
    
    toast({
      title: 'Аудио отклонено',
      description: `Голосовое приветствие в объявлении #${selectedAd.id} отклонено. Пользователь получит уведомление.`,
      variant: 'destructive',
    });

    setShowRejectDialog(false);
    setSelectedAd(null);
    setRejectReason('');
  };

  const handleUndo = (ad: UserAd) => {
    setModerationStatuses(prev => prev.map(m => 
      m.adId === ad.id 
        ? { adId: ad.id, status: 'pending' }
        : m
    ));
    toast({
      title: 'Статус сброшен',
      description: `Модерация объявления #${ad.id} отменена`,
    });
  };

  const pendingAds = ads.filter(ad => {
    const mod = getModeration(ad.id);
    return ad.audioGreeting && mod?.status === 'pending';
  });

  const approvedAds = ads.filter(ad => {
    const mod = getModeration(ad.id);
    return ad.audioGreeting && mod?.status === 'approved';
  });

  const rejectedAds = ads.filter(ad => {
    const mod = getModeration(ad.id);
    return ad.audioGreeting && mod?.status === 'rejected';
  });

  const renderAdCard = (ad: UserAd, showActions: boolean = true) => {
    const moderation = getModeration(ad.id);
    
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
                    onClick={() => handleAIModeration(ad)}
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
                      onClick={() => handleApprove(ad)}
                    >
                      <Icon name="CheckCircle" size={16} className="mr-2" />
                      Одобрить
                    </Button>
                    <Button 
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleReject(ad)}
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
                  onClick={() => handleUndo(ad)}
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Модерация аудио-приветствий</h2>
        <p className="text-muted-foreground">Проверка голосовых приветствий в платных объявлениях</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            label: 'На модерации', 
            value: pendingAds.length, 
            icon: 'Clock', 
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10'
          },
          { 
            label: 'Одобрено', 
            value: approvedAds.length, 
            icon: 'CheckCircle', 
            color: 'text-green-500',
            bgColor: 'bg-green-500/10'
          },
          { 
            label: 'Отклонено', 
            value: rejectedAds.length, 
            icon: 'XCircle', 
            color: 'text-red-500',
            bgColor: 'bg-red-500/10'
          }
        ].map((stat, index) => (
          <Card key={index} className={stat.bgColor}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon name={stat.icon as any} size={32} className={stat.color} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Icon name="Sparkles" size={20} className="text-purple-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                🤖 AI-модератор включен
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Нажмите кнопку "Проверить AI-модератором" для автоматического анализа аудио через OpenAI Whisper + GPT-4
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>AI распознает речь и анализирует содержание на правила</li>
                <li>Автоматическое одобрение безопасных аудио</li>
                <li>Помечает подозрительный контент для ручной проверки</li>
                <li>Показывает уверенность AI в процентах</li>
                <li>Контролируйте соответствие правилам платформы</li>
                <li>При отклонении обязательно указывайте причину</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="gap-2">
            <Icon name="Clock" size={16} />
            На модерации ({pendingAds.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <Icon name="CheckCircle" size={16} />
            Одобрено ({approvedAds.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <Icon name="XCircle" size={16} />
            Отклонено ({rejectedAds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingAds.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold mb-2">Все проверено!</h3>
                <p className="text-muted-foreground">Нет аудио-приветствий ожидающих модерации</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingAds.map(ad => renderAdCard(ad, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {approvedAds.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Пока пусто</h3>
                <p className="text-muted-foreground">Одобренные аудио появятся здесь</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {approvedAds.map(ad => renderAdCard(ad, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {rejectedAds.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Пока пусто</h3>
                <p className="text-muted-foreground">Отклоненные аудио появятся здесь</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {rejectedAds.map(ad => renderAdCard(ad, true))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отклонить аудио-приветствие</DialogTitle>
            <DialogDescription>
              Укажите причину отклонения голосового приветствия в объявлении #{selectedAd?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Причина отклонения</label>
              <Textarea
                placeholder="Например: Нецензурная лексика, спам, не соответствует правилам..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <p className="font-medium mb-1">Частые причины отклонения:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Нецензурная лексика</li>
                <li>Реклама сторонних ресурсов</li>
                <li>Не соответствует описанию</li>
                <li>Низкое качество записи</li>
                <li>Нарушение правил платформы</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Отмена
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
            >
              <Icon name="XCircle" size={16} className="mr-2" />
              Отклонить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};