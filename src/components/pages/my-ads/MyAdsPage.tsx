import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAd, AdResponse, Profile, Page } from '@/types';
import { CreateAdModal } from './CreateAdModal';
import { AdResponseModal } from './AdResponseModal';
import { MyAdsHeader } from './MyAdsHeader';
import { MyAdsTabContent } from './MyAdsTabContent';
import { useToast } from '@/hooks/use-toast';
import { AdPromotionModal } from '@/components/ads/AdPromotionModal';

// Catalog context stub
const useCatalog = () => ({
  catalogItems: [],
  deleteCatalogItem: async () => {},
  updateCatalogItem: async () => {},
  refreshCatalog: async () => {}
});

interface MyAdsPageProps {
  profile: Profile;
  setCurrentPage: (page: Page) => void;
}

const MyAdsPage = ({ profile, setCurrentPage }: MyAdsPageProps) => {
  const catalogItems: any[] = [];
  const deleteCatalogItem = async () => {};
  const updateCatalogItem = async () => {};
  const refreshCatalog = async () => {};
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <MyAdsHeader 
          setCurrentPage={setCurrentPage}
          onCreateClick={() => setShowCreateModal(true)}
        />

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Активные ({activeAds.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Завершенные ({completedAds.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <MyAdsTabContent
              ads={activeAds}
              emptyIcon="Inbox"
              emptyTitle="Нет активных объявлений"
              emptyDescription="Создайте свое первое объявление, чтобы начать получать отклики"
              onDelete={handleDeleteAd}
              onRenew={handleRenewAd}
              onComplete={handleCompleteAd}
              onBoost={handleBoostAd}
              onViewResponse={handleViewResponse}
            />
          </TabsContent>

          <TabsContent value="completed">
            <MyAdsTabContent
              ads={completedAds}
              emptyIcon="CheckCircle"
              emptyTitle="Нет завершенных объявлений"
              emptyDescription="Здесь будут отображаться ваши завершенные объявления"
              onDelete={handleDeleteAd}
              onRenew={handleRenewAd}
              onComplete={handleCompleteAd}
              onBoost={handleBoostAd}
              onViewResponse={handleViewResponse}
            />
          </TabsContent>
        </Tabs>

        {showCreateModal && (
          <CreateAdModal
            profile={profile}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateAd}
          />
        )}

        {showResponseModal && selectedAd && selectedResponse && (
          <AdResponseModal
            ad={selectedAd}
            response={selectedResponse}
            onClose={() => {
              setShowResponseModal(false);
              setSelectedAd(null);
              setSelectedResponse(null);
            }}
            onAction={handleResponseAction}
          />
        )}

        {showPromotionModal && adToPromote && (
          <AdPromotionModal
            isOpen={showPromotionModal}
            onClose={() => {
              setShowPromotionModal(false);
              setAdToPromote(null);
            }}
            onPurchase={handlePromotionPurchase}
            adTitle={adToPromote.title}
          />
        )}
      </div>
    </div>
  );
};

export default MyAdsPage;
