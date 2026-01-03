import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { UserAd, AdResponse, Profile, Page } from '@/types';
import { CreateAdModal } from './CreateAdModal';
import { AdResponseModal } from './AdResponseModal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { useCatalog } from '@/contexts/CatalogContext';
import { useToast } from '@/hooks/use-toast';
import { AdPromotionModal } from '@/components/ads/AdPromotionModal';

interface MyAdsPageProps {
  profile: Profile;
  setCurrentPage: (page: Page) => void;
}

const MyAdsPage = ({ profile, setCurrentPage }: MyAdsPageProps) => {
  const { catalogItems, deleteCatalogItem, updateCatalogItem, refreshCatalog } = useCatalog();
  const { toast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<UserAd | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<AdResponse | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [adToPromote, setAdToPromote] = useState<UserAd | null>(null);
  
  const [ads, setAds] = useState<UserAd[]>([]);

  useEffect(() => {
    const userAds = catalogItems
      .filter(item => item.userId === profile.id)
      .map(item => ({
        id: item.id,
        authorId: item.userId,
        authorName: profile.name,
        authorAvatar: profile.avatar,
        authorRole: profile.role!,
        type: profile.role === 'seller' ? 'service_offer' as const : 'service_request' as const,
        category: item.category,
        title: item.title,
        description: item.description,
        price: item.price,
        currency: 'RUB' as const,
        status: item.isActive ? 'active' as const : 'completed' as const,
        createdAt: item.createdAt,
        viewCount: item.viewCount,
        isBoosted: false,
        responses: item.responses || []
      }));
    setAds(userAds);
  }, [catalogItems, profile]);

  const activeAds = ads.filter(ad => ad.status === 'active');
  const completedAds = ads.filter(ad => ad.status === 'completed' || ad.status === 'cancelled');

  const handleCreateAd = (newAd: Omit<UserAd, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'authorRole' | 'createdAt' | 'responses' | 'viewCount'>) => {
    const ad: UserAd = {
      ...newAd,
      id: Date.now(),
      authorId: 1,
      authorName: profile.name,
      authorAvatar: profile.avatar,
      authorRole: profile.role!,
      createdAt: new Date().toISOString(),
      viewCount: 0,
      responses: []
    };
    setAds([ad, ...ads]);
    setShowCreateModal(false);
  };

  const handleResponseAction = (adId: number, responseId: number, action: 'accept' | 'reject') => {
    setAds(ads.map(ad => {
      if (ad.id === adId && ad.responses) {
        return {
          ...ad,
          responses: ad.responses.map(resp => 
            resp.id === responseId 
              ? { ...resp, status: action === 'accept' ? 'accepted' : 'rejected' }
              : resp
          )
        };
      }
      return ad;
    }));
  };

  const handleDeleteAd = async (adId: number) => {
    if (confirm('Вы уверены, что хотите удалить это объявление?')) {
      try {
        await deleteCatalogItem(adId);
        await refreshCatalog();
      } catch (error) {
        
      }
    }
  };

  const handleRenewAd = async (adId: number) => {
    try {
      await updateCatalogItem(adId, { isActive: true });
      await refreshCatalog();
    } catch (error) {
      
    }
  };

  const handleCompleteAd = async (adId: number) => {
    if (confirm('Вы уверены, что хотите завершить это объявление?')) {
      try {
        await updateCatalogItem(adId, { isActive: false });
        await refreshCatalog();
      } catch (error) {
        
      }
    }
  };

  const handleBoostAd = (adId: number) => {
    const ad = ads.find(a => a.id === adId);
    if (ad) {
      setAdToPromote(ad);
      setShowPromotionModal(true);
    }
  };

  const handlePromotionPurchase = (serviceId: string, price: number) => {
    if (!adToPromote) return;

    let duration = 24; // часы
    const promotionType = serviceId;

    switch (serviceId) {
      case 'raise':
        duration = 24;
        break;
      case 'highlight':
        duration = 24 * 7;
        break;
      case 'pin':
        duration = 24 * 3;
        break;
      case 'premium':
        duration = 24 * 7;
        break;
    }

    const boostedUntil = new Date();
    boostedUntil.setHours(boostedUntil.getHours() + duration);

    setAds(ads.map(ad => 
      ad.id === adToPromote.id 
        ? { 
            ...ad, 
            isBoosted: true, 
            boostedUntil: boostedUntil.toISOString(),
            promotionType: promotionType,
            createdAt: new Date().toISOString()
          }
        : ad
    ));

    toast({
      title: "Продвижение активировано!",
      description: `Объявление "${adToPromote.title}" успешно продвинуто`,
    });

    setShowPromotionModal(false);
    setAdToPromote(null);
  };

  const handleViewResponse = (ad: UserAd, response: AdResponse) => {
    setSelectedAd(ad);
    setSelectedResponse(response);
    setShowResponseModal(true);
  };

  const renderAdCard = (ad: UserAd) => {
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
      <Card key={ad.id} className={`hover:shadow-lg transition-shadow relative overflow-hidden ${isBoostedActive && promotion ? `border-2 ${promotion.color} shadow-xl` : ''}`}>
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
                  <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white">
                    <Icon name="Crown" size={12} className="mr-1" />
                    VIP {Math.floor(boostedTimeLeft / 24)}д
                  </Badge>
                )}
                {ad.audioGreeting && (
                  <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
                    <Icon name="Volume2" size={12} className="mr-1 text-purple-500" />
                    <span className="text-purple-700 dark:text-purple-300">С голосом</span>
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg truncate">{ad.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ad.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-xl text-primary">{ad.price} ₽</div>
              {ad.duration && <div className="text-xs text-muted-foreground">{ad.duration} ч</div>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {ad.audioGreeting && (
            <div className="mb-3">
              <AudioPlayer 
                audioUrl={ad.audioGreeting} 
                duration={ad.audioGreetingDuration}
              />
            </div>
          )}

          {ad.lookingFor && (
            <div className="mb-3 p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Ищу: </span>
                {ad.lookingFor}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-3">
              <span>Создано: {new Date(ad.createdAt).toLocaleDateString('ru-RU')}</span>
              <div className="flex items-center gap-1 text-primary">
                <Icon name="Eye" size={14} />
                <span className="font-medium">{ad.viewCount}</span>
              </div>
            </div>
            {pendingResponses > 0 && (
              <Badge variant="destructive" className="text-xs">
                {pendingResponses} новых откликов
              </Badge>
            )}
          </div>

          <div className="space-y-2 mt-3">
            {ad.status === 'active' && !isBoostedActive && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-gradient-to-r from-primary/10 to-pink-500/10 hover:from-primary/20 hover:to-pink-500/20 border-primary/30"
                onClick={() => handleBoostAd(ad.id)}
              >
                <Icon name="Sparkles" size={16} className="mr-2" />
                Продвинуть объявление
              </Button>
            )}
            
            <div className="flex gap-2">
              {ad.status === 'active' ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleCompleteAd(ad.id)}
                  >
                    <Icon name="CheckCircle" size={16} className="mr-2" />
                    Завершить
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDeleteAd(ad.id)}
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
                  </Button>
                </>
              ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1"
                onClick={() => handleRenewAd(ad.id)}
              >
                <Icon name="RotateCw" size={16} className="mr-2" />
                Возобновить
              </Button>
              )}
            </div>
          </div>

          {ad.responses && ad.responses.length > 0 ? (
            <div className="space-y-2 mt-4 pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">Отклики ({ad.responses.length})</h4>
              {ad.responses.slice(0, 3).map(response => (
                <div 
                  key={response.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => handleViewResponse(ad, response)}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {response.responderName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{response.responderName}</span>
                      <Badge variant={
                        response.status === 'accepted' ? 'default' :
                        response.status === 'rejected' ? 'destructive' :
                        'outline'
                      } className="text-xs">
                        {response.status === 'accepted' ? 'Принят' :
                         response.status === 'rejected' ? 'Отклонен' :
                         'Новый'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{response.message}</p>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </div>
              ))}
              {ad.responses.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full">
                  Показать все ({ad.responses.length})
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Пока нет откликов
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageBreadcrumb 
        currentPage="my-ads" 
        setCurrentPage={setCurrentPage}
        customBreadcrumbs={[
          { label: 'Главная', page: 'home' },
          { label: 'Профиль', page: 'profile' },
          { label: 'Мои объявления' },
        ]}
      />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Мои объявления</h1>
          <p className="text-sm text-muted-foreground">
            {profile.role === 'seller' ? 'Предлагайте свои услуги' : 'Размещайте запросы услуг'}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Icon name="Plus" size={18} />
          Создать
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active" className="gap-2">
            <Icon name="FileText" size={16} />
            Активные ({activeAds.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <Icon name="CheckCircle" size={16} />
            Завершённые ({completedAds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeAds.length > 0 ? (
            activeAds.map(ad => renderAdCard(ad))
          ) : (
            <Card className="p-8 text-center">
              <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">Нет активных объявлений</h3>
              <p className="text-muted-foreground mb-4">
                {profile.role === 'seller' 
                  ? 'Создайте объявление с предложением своих услуг'
                  : 'Создайте запрос и девушки смогут откликнуться на него'
                }
              </p>
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Icon name="Plus" size={18} />
                Создать объявление
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAds.length > 0 ? (
            completedAds.map(ad => renderAdCard(ad))
          ) : (
            <Card className="p-8 text-center">
              <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">Нет завершённых объявлений</h3>
              <p className="text-muted-foreground">
                Здесь будут отображаться завершённые объявления
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {showCreateModal && (
        <CreateAdModal
          profile={profile}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateAd}
        />
      )}

      <AdPromotionModal
        isOpen={showPromotionModal}
        onClose={() => {
          setShowPromotionModal(false);
          setAdToPromote(null);
        }}
        adTitle={adToPromote?.title || ''}
        onPurchase={handlePromotionPurchase}
      />

      {showResponseModal && selectedAd && selectedResponse && (
        <AdResponseModal
          ad={selectedAd}
          response={selectedResponse}
          onClose={() => {
            setShowResponseModal(false);
            setSelectedAd(null);
            setSelectedResponse(null);
          }}
          onAccept={() => {
            handleResponseAction(selectedAd.id, selectedResponse.id, 'accept');
            setShowResponseModal(false);
          }}
          onReject={() => {
            handleResponseAction(selectedAd.id, selectedResponse.id, 'reject');
            setShowResponseModal(false);
          }}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default MyAdsPage;