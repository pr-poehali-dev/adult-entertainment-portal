import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Currency } from '@/types';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (duration: number, price: number, currency: Currency) => void;
}

export default function PremiumModal({ isOpen, onClose, onPurchase }: PremiumModalProps) {
  const plans = [
    { duration: 1, price: 990, label: '1 месяц' },
    { duration: 3, price: 2490, label: '3 месяца', discount: '15%' },
    { duration: 6, price: 4490, label: '6 месяцев', discount: '25%' },
    { duration: 12, price: 7990, label: '1 год', discount: '35%', popular: true },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Премиум подписка для бизнеса
            </span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Только для бизнес-аккаунтов
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Преимущества */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">Что входит в Premium для бизнеса:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Неограниченные объявления</p>
                  <p className="text-sm text-gray-600">Создавайте сколько угодно коммерческих объявлений в любых категориях</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Открытие агентства</p>
                  <p className="text-sm text-gray-600">Создавайте и управляйте своим агентством с неограниченным количеством сотрудников</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Приоритет в поиске</p>
                  <p className="text-sm text-gray-600">Ваши объявления показываются в топе результатов поиска</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Бизнес-аналитика</p>
                  <p className="text-sm text-gray-600">Детальная статистика по объявлениям, конверсиям и доходам</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Значок Premium Business</p>
                  <p className="text-sm text-gray-600">Подтвержденный бизнес-аккаунт с особым значком доверия</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Приоритетная поддержка</p>
                  <p className="text-sm text-gray-600">Персональный менеджер и техподдержка 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Тарифы */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.duration}
                className={`relative border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
                  plan.popular
                    ? 'border-purple-500 bg-gradient-to-br from-pink-50 to-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Популярный
                  </div>
                )}
                
                {plan.discount && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    -{plan.discount}
                  </div>
                )}

                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm mb-2">{plan.label}</p>
                  <p className="text-3xl font-bold">{plan.price} ₽</p>
                  <p className="text-sm text-gray-500 mt-1">
                    ≈ {Math.round(plan.price / plan.duration)} ₽/мес
                  </p>
                </div>

                <Button
                  onClick={() => onPurchase(plan.duration, plan.price, 'RUB')}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  Выбрать
                </Button>
              </div>
            ))}
          </div>

          {/* Информация */}
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-600">
            <div className="flex gap-2">
              <Icon name="Info" size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p>
                Подписка продлевается автоматически. Вы можете отменить продление в любой момент в настройках.
                Все средства списываются с вашего баланса Love Is.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}