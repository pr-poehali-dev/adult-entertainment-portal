import { WorkOpportunity } from '@/types';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface WorkOpportunityCardProps {
  work: WorkOpportunity;
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

export const WorkOpportunityCard = ({ work, onSelect }: WorkOpportunityCardProps) => {
  return (
    <button
      onClick={onSelect}
      className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-all hover:shadow-lg text-left group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={work.image}
          alt={work.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {work.isVerified && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Icon name="ShieldCheck" size={14} />
            Проверено
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-white font-bold text-xl mb-1">{work.title}</div>
          {work.company && (
            <div className="text-white/80 text-sm">{work.company}</div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {work.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Оплата</div>
            <div className="text-lg font-bold text-primary">
              {work.paymentAmount.toLocaleString()} {getCurrencySymbol(work.currency)}+
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Длительность</div>
            <div className="text-sm font-semibold">{work.duration}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="MapPin" size={14} />
          <span>{work.location}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Опубликовано {new Date(work.postedDate).toLocaleDateString('ru-RU')}
          </div>
          <Badge variant="outline" className="text-xs">
            <Icon name="Eye" size={12} className="mr-1" />
            Подробнее
          </Badge>
        </div>
      </div>
    </button>
  );
};
