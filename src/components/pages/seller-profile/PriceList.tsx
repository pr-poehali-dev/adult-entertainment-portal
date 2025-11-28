import { PriceListItem, Currency } from '@/types';
import Icon from '@/components/ui/icon';

interface PriceListProps {
  items: PriceListItem[];
  onItemClick: (item: PriceListItem) => void;
}

const getCurrencySymbol = (currency: Currency): string => {
  const symbols: Record<Currency, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
    BTC: '₿',
    ETH: 'Ξ',
    USDT: '₮'
  };
  return symbols[currency] || currency;
};

export default function PriceList({ items, onItemClick }: PriceListProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const groupedByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PriceListItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Icon name="DollarSign" size={24} className="text-primary" />
        <h2 className="text-2xl font-bold">Прайс-лист</h2>
      </div>

      {Object.entries(groupedByCategory).map(([category, categoryItems]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-muted-foreground">{category}</h3>
          <div className="grid gap-3">
            {categoryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item)}
                className="bg-card border border-border rounded-lg p-4 text-left hover:border-primary transition-colors group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Icon name="Clock" size={16} />
                      <span>{item.duration} ч</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-2xl font-bold text-primary">
                      {item.price.toLocaleString()} {getCurrencySymbol(item.currency)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(item.price / item.duration).toLocaleString()} {getCurrencySymbol(item.currency)}/ч
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
