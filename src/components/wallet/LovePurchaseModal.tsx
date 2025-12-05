import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface LovePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (rubAmount: number, loveAmount: number) => void;
  rubBalance: number;
}

const LOVE_PACKAGES = [
  { rub: 500, love: 35, badge: '' },
  { rub: 1000, love: 75, badge: '+5 бонус' },
  { rub: 2500, love: 188, badge: '+13 бонус' },
  { rub: 5000, love: 390, badge: '+40 бонус' },
  { rub: 10000, love: 1000, badge: 'Лучшее предложение!' },
];

export const LovePurchaseModal = ({ isOpen, onClose, onPurchase, rubBalance }: LovePurchaseModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const handlePurchase = () => {
    if (selectedPackage === null) return;
    
    const pkg = LOVE_PACKAGES[selectedPackage];
    
    if (rubBalance < pkg.rub) {
      return;
    }
    
    onPurchase(pkg.rub, pkg.love);
    setSelectedPackage(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Heart" size={28} className="text-pink-500" />
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Купить LOVE токены
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border border-pink-300 dark:border-pink-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Wallet" size={20} className="text-pink-600 dark:text-pink-400" />
                <span className="font-medium text-pink-600 dark:text-pink-400">Ваш баланс:</span>
              </div>
              <span className="text-xl font-bold text-pink-600 dark:text-pink-400">
                {rubBalance.toLocaleString()} ₽
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LOVE_PACKAGES.map((pkg, index) => {
              const isSelected = selectedPackage === index;
              const canAfford = rubBalance >= pkg.rub;
              const baseRate = 500 / 35;
              const discount = Math.round((1 - (pkg.rub / pkg.love) / baseRate) * 100);
              
              return (
                <Card
                  key={index}
                  onClick={() => canAfford && setSelectedPackage(index)}
                  className={`relative cursor-pointer transition-all p-4 ${
                    isSelected
                      ? 'border-2 border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 shadow-lg scale-105'
                      : canAfford
                      ? 'border border-pink-300 dark:border-pink-800 hover:border-pink-500 hover:shadow-md'
                      : 'border border-gray-300 dark:border-gray-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      {pkg.badge}
                    </div>
                  )}
                  
                  {!canAfford && (
                    <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      Недостаточно ₽
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <Icon name="Heart" size={32} className="text-white" />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                        {pkg.love} 💗
                      </div>
                      <div className="text-sm text-muted-foreground">LOVE токенов</div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent my-2" />

                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {pkg.rub.toLocaleString()} ₽
                      </div>
                      {discount > 0 && (
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Экономия {discount}%
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-600 dark:text-blue-400">
                <p className="font-medium mb-1">Как использовать LOVE:</p>
                <ul className="space-y-1 opacity-90">
                  <li>• Оплата услуг на платформе (1 LOVE = 10 ₽)</li>
                  <li>• Открытие агентства</li>
                  <li>• VIP подписка</li>
                  <li>• Доступ к премиум функциям</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handlePurchase}
              disabled={selectedPackage === null || (selectedPackage !== null && rubBalance < LOVE_PACKAGES[selectedPackage].rub)}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-6 text-lg disabled:opacity-50"
            >
              <Icon name="ShoppingCart" size={20} />
              {selectedPackage !== null ? `Купить за ${LOVE_PACKAGES[selectedPackage].rub.toLocaleString()} ₽` : 'Выберите пакет'}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6 py-6"
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
