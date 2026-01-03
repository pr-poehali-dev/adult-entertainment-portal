import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { VIPPlan } from '@/types';
import { VIPBadge } from './VIPBadge';
import Icon from '@/components/ui/icon';

interface VIPUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVipExpiry: string | null;
  onPurchase: (plan: VIPPlan) => void;
}

const vipPlans: VIPPlan[] = [
  { id: 'month', duration: 30, price: 999 },
  { id: 'threeMonths', duration: 90, price: 2499, discount: 17 },
  { id: 'sixMonths', duration: 180, price: 4499, discount: 25 },
  { id: 'year', duration: 365, price: 7999, discount: 33 },
];

export const VIPUpgradeModal = ({ isOpen, onClose, currentVipExpiry, onPurchase }: VIPUpgradeModalProps) => {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<VIPPlan | null>(null);
  
  const handlePurchase = () => {
    if (selectedPlan) {
      onPurchase(selectedPlan);
      onClose();
    }
  };
  
  const isExtension = currentVipExpiry && new Date(currentVipExpiry) > new Date();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <VIPBadge size="lg" />
            {isExtension ? t.vip.extend : t.vip.upgrade}
          </DialogTitle>
          <DialogDescription>{t.vip.benefits}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">Преимущества VIP-статуса:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Приоритет в поиске</p>
                  <p className="text-sm text-gray-600">Ваша анкета показывается первой в результатах</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">VIP-значок в профиле</p>
                  <p className="text-sm text-gray-600">Выделяйтесь среди других пользователей золотым значком</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Увеличенная видимость</p>
                  <p className="text-sm text-gray-600">На 300% больше просмотров вашей анкеты</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Подробная статистика</p>
                  <p className="text-sm text-gray-600">Просмотры, лайки и аналитика вашего профиля</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Приоритетная поддержка</p>
                  <p className="text-sm text-gray-600">Ваши обращения обрабатываются в первую очередь</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Без рекламы</p>
                  <p className="text-sm text-gray-600">Пользуйтесь платформой без отвлечений</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Выберите план:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {vipPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedPlan?.id === plan.id 
                      ? 'border-yellow-500 ring-2 ring-yellow-500' 
                      : 'border-border'
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold">{t.vip.plans[plan.id as keyof typeof t.vip.plans]}</h4>
                      {plan.discount && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                          -{plan.discount}%
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {plan.price} ₽
                    </div>
                    {plan.discount && (
                      <div className="text-xs text-muted-foreground line-through">
                        {Math.round(plan.price / (1 - plan.discount / 100))} ₽
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {Math.round(plan.price / (plan.duration / 30))} ₽/месяц
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button 
              onClick={handlePurchase} 
              disabled={!selectedPlan}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
            >
              <Icon name="CreditCard" size={18} />
              Оплатить {selectedPlan ? `${selectedPlan.price} ₽` : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};