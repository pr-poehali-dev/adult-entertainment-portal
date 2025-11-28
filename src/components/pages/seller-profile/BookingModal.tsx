import { useState } from 'react';
import { PriceListItem, Currency, Wallet } from '@/types';
import Icon from '@/components/ui/icon';

interface BookingModalProps {
  item: PriceListItem;
  sellerName: string;
  sellerAvatar: string;
  wallet: Wallet;
  onClose: () => void;
  onConfirm: (item: PriceListItem, duration: number, totalPrice: number) => void;
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

export default function BookingModal({ 
  item, 
  sellerName, 
  sellerAvatar, 
  wallet, 
  onClose, 
  onConfirm 
}: BookingModalProps) {
  const [duration, setDuration] = useState(item.duration);
  const pricePerHour = item.price / item.duration;
  const totalPrice = pricePerHour * duration;

  const userBalance = wallet.balances.find(b => b.currency === item.currency);
  const hasEnoughFunds = userBalance && userBalance.amount >= totalPrice;

  const handleConfirm = () => {
    if (hasEnoughFunds) {
      onConfirm(item, duration, totalPrice);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Оформление заказа</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src={sellerAvatar} 
              alt={sellerName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold">{sellerName}</div>
              <div className="text-sm text-muted-foreground">{item.category}</div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg p-4 space-y-2">
            <div className="font-semibold text-lg">{item.title}</div>
            {item.description && (
              <p className="text-sm text-muted-foreground">{item.description}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="block">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Длительность</span>
                <span className="text-sm text-muted-foreground">
                  {pricePerHour.toLocaleString()} {getCurrencySymbol(item.currency)}/ч
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDuration(Math.max(0.5, duration - 0.5))}
                  className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
                  disabled={duration <= 0.5}
                >
                  <Icon name="Minus" size={20} />
                </button>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  step="0.5"
                  min="0.5"
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-center font-semibold"
                />
                <button
                  onClick={() => setDuration(duration + 0.5)}
                  className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
                >
                  <Icon name="Plus" size={20} />
                </button>
              </div>
              <div className="text-sm text-muted-foreground mt-1 text-center">
                {duration} {duration === 1 ? 'час' : duration < 5 ? 'часа' : 'часов'}
              </div>
            </label>

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Цена за час</span>
                <span>{pricePerHour.toLocaleString()} {getCurrencySymbol(item.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Длительность</span>
                <span>{duration} ч</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Итого</span>
                <span className="text-primary">
                  {totalPrice.toLocaleString()} {getCurrencySymbol(item.currency)}
                </span>
              </div>
            </div>

            <div className="bg-accent/50 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Wallet" size={16} />
                <span className="font-medium">Ваш баланс</span>
              </div>
              {userBalance ? (
                <div className="text-lg font-semibold">
                  {userBalance.amount.toLocaleString()} {getCurrencySymbol(item.currency)}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Нет средств в {item.currency}
                </div>
              )}
              {!hasEnoughFunds && (
                <div className="text-sm text-destructive flex items-center gap-1">
                  <Icon name="AlertCircle" size={14} />
                  Недостаточно средств
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-accent hover:bg-accent/80 rounded-lg font-semibold transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleConfirm}
              disabled={!hasEnoughFunds}
              className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Забронировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
