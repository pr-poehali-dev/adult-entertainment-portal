import { useState } from 'react';
import { CustomMediaOrder, Currency, Wallet } from '@/types';
import Icon from '@/components/ui/icon';

interface CustomOrderModalProps {
  order: CustomMediaOrder;
  wallet: Wallet;
  sellerName: string;
  onClose: () => void;
  onSubmit: (requirements: string) => void;
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

const getMediaName = (type: CustomMediaOrder['type']) => {
  switch (type) {
    case 'photo': return 'фото';
    case 'video': return 'видео';
    case 'audio': return 'аудио';
  }
};

export function CustomOrderModal({ order, wallet, sellerName, onClose, onSubmit }: CustomOrderModalProps) {
  const [requirements, setRequirements] = useState('');
  const userBalance = wallet.balances.find(b => b.currency === order.currency);
  const hasEnoughFunds = userBalance && userBalance.amount >= order.price;

  const handleSubmit = () => {
    if (hasEnoughFunds && requirements.trim()) {
      onSubmit(requirements);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Оформить заказ</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-accent/50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              {order.exampleImage && (
                <img
                  src={order.exampleImage}
                  alt={order.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{order.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{order.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Icon name="User" size={14} />
                    {sellerName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={14} />
                    {order.deliveryTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Ваши пожелания и требования</span>
                <span className="text-xs text-muted-foreground">
                  {requirements.length}/1000
                </span>
              </div>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value.slice(0, 1000))}
                placeholder={`Опишите, какое ${getMediaName(order.type)} вы хотите получить. Укажите детали, пожелания по стилю, обстановке, одежде и другие важные для вас моменты...`}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 min-h-[150px] resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>

            {!requirements.trim() && (
              <div className="text-sm text-muted-foreground flex items-start gap-2">
                <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
                <span>Обязательно опишите ваши пожелания, чтобы продавец понял, что именно вы хотите получить</span>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Стоимость заказа</span>
              <span className="font-semibold">{order.price.toLocaleString()} {getCurrencySymbol(order.currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Срок выполнения</span>
              <span className="font-semibold">{order.deliveryTime}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>Итого к оплате</span>
              <span className="text-primary">{order.price.toLocaleString()} {getCurrencySymbol(order.currency)}</span>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Icon name="Wallet" size={16} />
              <span className="font-medium">Ваш баланс</span>
            </div>
            {userBalance ? (
              <div className="text-lg font-semibold">
                {userBalance.amount.toLocaleString()} {getCurrencySymbol(order.currency)}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Нет средств в {order.currency}
              </div>
            )}
            {!hasEnoughFunds && (
              <div className="text-sm text-destructive flex items-center gap-1">
                <Icon name="AlertCircle" size={14} />
                Недостаточно средств
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-accent hover:bg-accent/80 rounded-lg font-semibold transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={!hasEnoughFunds || !requirements.trim()}
              className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
