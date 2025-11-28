import { useState } from 'react';
import { PaidAd } from '@/types';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PaidAdModalProps {
  ad: PaidAd;
  onClose: () => void;
}

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  };
  return symbols[currency] || currency;
};

export const PaidAdModal = ({ ad, onClose }: PaidAdModalProps) => {
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleContact = () => {
    toast({
      title: 'Контакт скопирован',
      description: `${ad.contactInfo} скопирован в буфер обмена`,
    });
    navigator.clipboard.writeText(ad.contactInfo);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % ad.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + ad.images.length) % ad.images.length);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <div className="relative h-96 overflow-hidden bg-black">
            <img
              src={ad.images[currentImageIndex]}
              alt={ad.title}
              className="w-full h-full object-contain"
            />
            
            {ad.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <Icon name="ChevronLeft" size={24} className="text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <Icon name="ChevronRight" size={24} className="text-white" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {ad.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <Icon name="X" size={20} className="text-white" />
          </button>

          {ad.isPremium && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              <Icon name="Crown" size={18} />
              PREMIUM ОБЪЯВЛЕНИЕ
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Badge className="mb-2">{ad.category}</Badge>
              <h2 className="text-3xl font-bold mb-2">{ad.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={14} />
                  {new Date(ad.postedDate).toLocaleDateString('ru-RU')}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Eye" size={14} />
                  {ad.views} просмотров
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="MapPin" size={14} />
                  {ad.location}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">
                {ad.price.toLocaleString()} {getCurrencySymbol(ad.currency)}
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold flex items-center gap-2">
                {ad.sellerName}
                {ad.sellerVerified && (
                  <Badge variant="secondary" className="text-xs">
                    <Icon name="ShieldCheck" size={12} className="mr-1" />
                    Проверен
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Icon name="Star" size={14} className="text-primary fill-primary" />
                <span>{ad.sellerRating} рейтинг</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Icon name="FileText" size={20} />
              Описание
            </h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {ad.description}
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={handleContact} className="flex-1 gap-2" size="lg">
              <Icon name="MessageCircle" size={18} />
              Связаться: {ad.contactInfo}
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Icon name="Heart" size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
