import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface PromotionService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number; // в днях
  icon: string;
  color: string;
}

const promotionServices: PromotionService[] = [
  {
    id: 'raise',
    name: 'Поднять объявление',
    description: 'Поднимите объявление в топ списка на 24 часа',
    price: 199,
    duration: 1,
    icon: 'TrendingUp',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'highlight',
    name: 'Выделить цветом',
    description: 'Яркая цветная рамка привлечет внимание на 7 дней',
    price: 399,
    duration: 7,
    icon: 'Palette',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'pin',
    name: 'Закрепить в топ-10',
    description: 'Гарантированное место в топ-10 на 3 дня',
    price: 899,
    duration: 3,
    icon: 'Pin',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'premium',
    name: 'VIP размещение',
    description: 'Максимальная видимость: топ-3 + рамка + значок на 7 дней',
    price: 1499,
    duration: 7,
    icon: 'Crown',
    color: 'from-yellow-500 to-amber-600'
  }
];

interface AdPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  adTitle: string;
  onPurchase: (serviceId: string, price: number) => void;
}

export const AdPromotionModal = ({ isOpen, onClose, adTitle, onPurchase }: AdPromotionModalProps) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handlePurchase = () => {
    if (selectedService) {
      const service = promotionServices.find(s => s.id === selectedService);
      if (service) {
        onPurchase(service.id, service.price);
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Продвижение объявления
          </DialogTitle>
          <DialogDescription>
            Увеличьте видимость: "{adTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {promotionServices.map((service) => (
            <Card
              key={service.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedService === service.id 
                  ? 'border-primary ring-2 ring-primary' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedService(service.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon name={service.icon as any} size={24} className="text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg">{service.name}</h4>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{service.price} ₽</div>
                      {service.duration && (
                        <div className="text-sm text-muted-foreground">
                          на {service.duration} {service.duration === 1 ? 'день' : service.duration < 5 ? 'дня' : 'дней'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {service.id === 'raise' && (
                      <>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          📈 +200% просмотров
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          ⚡ Быстрый эффект
                        </span>
                      </>
                    )}
                    {service.id === 'highlight' && (
                      <>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          🎨 Яркое выделение
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          👀 Привлекает внимание
                        </span>
                      </>
                    )}
                    {service.id === 'pin' && (
                      <>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          📌 Топ-10 гарантия
                        </span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          🔥 Максимум кликов
                        </span>
                      </>
                    )}
                    {service.id === 'premium' && (
                      <>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          👑 VIP статус
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          ⭐ Топ-3 место
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          💎 Золотая рамка
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Информация */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <div className="flex gap-2">
              <Icon name="Info" size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-blue-900">Как это работает:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Услуги активируются сразу после оплаты</li>
                  <li>• Можно комбинировать несколько услуг для одного объявления</li>
                  <li>• Оплата списывается с баланса Love Is (💗)</li>
                  <li>• Эффект виден сразу после активации</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button 
              onClick={handlePurchase} 
              disabled={!selectedService}
              className="bg-gradient-to-r from-primary to-primary/90"
            >
              <Icon name="Sparkles" size={18} />
              {selectedService 
                ? `Активировать за ${promotionServices.find(s => s.id === selectedService)?.price} ₽`
                : 'Выберите услугу'
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
