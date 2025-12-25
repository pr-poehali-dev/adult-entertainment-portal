import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserAd, Notification } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { AudioModerationCard } from './audio-moderation/AudioModerationCard';
import { AudioModerationStats } from './audio-moderation/AudioModerationStats';
import { AudioRejectDialog } from './audio-moderation/AudioRejectDialog';

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Модерация аудио-приветствий</h2>
        <p className="text-muted-foreground">Проверка голосовых приветствий в платных объявлениях</p>
      </div>

      <AudioModerationStats
        pendingCount={pendingAds.length}
        approvedCount={approvedAds.length}
        rejectedCount={rejectedAds.length}
      />

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="pending" className="relative">
            <Icon name="Clock" size={16} className="mr-2" />
            На модерации
            {pendingAds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {pendingAds.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            <Icon name="CheckCircle" size={16} className="mr-2" />
            Одобрено ({approvedAds.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <Icon name="XCircle" size={16} className="mr-2" />
            Отклонено ({rejectedAds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAds.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="CheckCircle" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет объявлений на модерации</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingAds.map((ad) => (
                <AudioModerationCard
                  key={ad.id}
                  ad={ad}
                  moderation={getModeration(ad.id)}
                  showActions={true}
                  aiProcessing={aiProcessing}
                  onAIModeration={handleAIModeration}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onUndo={handleUndo}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedAds.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет одобренных объявлений</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedAds.map((ad) => (
                <AudioModerationCard
                  key={ad.id}
                  ad={ad}
                  moderation={getModeration(ad.id)}
                  showActions={true}
                  aiProcessing={aiProcessing}
                  onAIModeration={handleAIModeration}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onUndo={handleUndo}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedAds.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет отклоненных объявлений</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rejectedAds.map((ad) => (
                <AudioModerationCard
                  key={ad.id}
                  ad={ad}
                  moderation={getModeration(ad.id)}
                  showActions={true}
                  aiProcessing={aiProcessing}
                  onAIModeration={handleAIModeration}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onUndo={handleUndo}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AudioRejectDialog
        open={showRejectDialog}
        selectedAd={selectedAd}
        rejectReason={rejectReason}
        onRejectReasonChange={setRejectReason}
        onConfirm={confirmReject}
        onCancel={() => {
          setShowRejectDialog(false);
          setSelectedAd(null);
          setRejectReason('');
        }}
      />
    </div>
  );
};
