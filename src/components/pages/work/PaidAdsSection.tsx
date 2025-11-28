import { useState } from 'react';
import { PaidAd } from '@/types';
import { paidAds } from '@/data/workOpportunities';
import { PaidAdCard } from './PaidAdCard';
import { PaidAdModal } from './PaidAdModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

export const PaidAdsSection = () => {
  const [selectedAd, setSelectedAd] = useState<PaidAd | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'views'>('date');

  const filteredAds = paidAds
    .filter(ad => 
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'views') return b.views - a.views;
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Megaphone" size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">Разместите свое объявление</h2>
            <p className="text-muted-foreground mb-4">
              Предлагаете услуги или товары? Разместите платное объявление и получайте больше клиентов!
            </p>
            <Button className="gap-2">
              <Icon name="Plus" size={18} />
              Создать объявление
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск объявлений..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">По дате</SelectItem>
            <SelectItem value="price">По цене</SelectItem>
            <SelectItem value="views">По популярности</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAds.map((ad) => (
          <PaidAdCard
            key={ad.id}
            ad={ad}
            onSelect={() => setSelectedAd(ad)}
          />
        ))}
      </div>

      {filteredAds.length === 0 && (
        <div className="text-center py-16">
          <Icon name="SearchX" size={64} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">
            Объявления не найдены
          </p>
        </div>
      )}

      {selectedAd && (
        <PaidAdModal
          ad={selectedAd}
          onClose={() => setSelectedAd(null)}
        />
      )}
    </div>
  );
};
