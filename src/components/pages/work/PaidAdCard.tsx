import { PaidAd } from '@/types';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface PaidAdCardProps {
  ad: PaidAd;
  onSelect: () => void;
}

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  };
  return symbols[currency] || currency;
};

export const PaidAdCard = ({ ad, onSelect }: PaidAdCardProps) => {
  return (
    <button
      onClick={onSelect}
      className={`bg-card border rounded-lg overflow-hidden hover:shadow-lg text-left group transition-all ${
        ad.isPremium ? 'border-primary shadow-primary/20' : 'border-border hover:border-primary'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={ad.images[0]}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {ad.isPremium && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Icon name="Crown" size={14} />
            PREMIUM
          </div>
        )}

        {ad.sellerVerified && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground p-1.5 rounded-full">
            <Icon name="ShieldCheck" size={16} />
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <Badge variant="secondary" className="mb-2 text-xs">
            {ad.category}
          </Badge>
          <div className="text-white font-bold text-lg line-clamp-1">{ad.title}</div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {ad.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            {ad.price.toLocaleString()} {getCurrencySymbol(ad.currency)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icon name="Eye" size={14} />
            {ad.views}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={14} className="text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium flex items-center gap-1">
                {ad.sellerName}
                {ad.sellerVerified && <Icon name="Check" size={12} className="text-primary" />}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="Star" size={10} className="text-primary fill-primary" />
                {ad.sellerRating}
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            <Icon name="MapPin" size={12} className="inline mr-1" />
            {ad.location}
          </div>
        </div>
      </div>
    </button>
  );
};
