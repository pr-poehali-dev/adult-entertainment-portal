import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { UserAd, AdResponse } from '@/types';
import { MyAdCard } from './MyAdCard';

interface MyAdsTabContentProps {
  ads: UserAd[];
  emptyIcon: string;
  emptyTitle: string;
  emptyDescription: string;
  onDelete: (adId: number) => void;
  onRenew: (adId: number) => void;
  onComplete: (adId: number) => void;
  onBoost: (adId: number) => void;
  onViewResponse: (ad: UserAd, response: AdResponse) => void;
}

export const MyAdsTabContent = ({
  ads,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  onDelete,
  onRenew,
  onComplete,
  onBoost,
  onViewResponse
}: MyAdsTabContentProps) => {
  if (ads.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Icon name={emptyIcon as any} size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">{emptyTitle}</h3>
          <p className="text-muted-foreground text-center">{emptyDescription}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {ads.map((ad) => (
        <MyAdCard
          key={ad.id}
          ad={ad}
          onDelete={onDelete}
          onRenew={onRenew}
          onComplete={onComplete}
          onBoost={onBoost}
          onViewResponse={onViewResponse}
        />
      ))}
    </div>
  );
};
