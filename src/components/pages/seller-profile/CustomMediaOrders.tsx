import { useState } from 'react';
import { CustomMediaOrder, Currency, Wallet } from '@/types';
import Icon from '@/components/ui/icon';
import { CustomOrderModal } from './CustomOrderModal';

interface CustomMediaOrdersProps {
  orders: CustomMediaOrder[];
  wallet: Wallet;
  sellerName: string;
  onOrderSubmit: (order: CustomMediaOrder, requirements: string) => void;
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

const getMediaIcon = (type: CustomMediaOrder['type']) => {
  switch (type) {
    case 'photo': return 'Camera';
    case 'video': return 'Video';
    case 'audio': return 'Mic';
  }
};

const getMediaName = (type: CustomMediaOrder['type']) => {
  switch (type) {
    case 'photo': return 'Фото';
    case 'video': return 'Видео';
    case 'audio': return 'Аудио';
  }
};

export default function CustomMediaOrders({ orders, wallet, sellerName, onOrderSubmit }: CustomMediaOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<CustomMediaOrder | null>(null);

  if (!orders || orders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Icon name="FileText" size={24} className="text-primary" />
        <h2 className="text-2xl font-bold">Контент на заказ</h2>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="bg-card border border-border rounded-lg p-4 text-left hover:border-primary transition-colors group"
          >
            <div className="flex gap-4">
              {order.exampleImage && (
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={order.exampleImage}
                    alt={order.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={getMediaIcon(order.type)} size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {order.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">{getMediaName(order.type)}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-primary">
                      {order.price.toLocaleString()} {getCurrencySymbol(order.currency)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                      <Icon name="Clock" size={12} />
                      {order.deliveryTime}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {order.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedOrder && (
        <CustomOrderModal
          order={selectedOrder}
          wallet={wallet}
          sellerName={sellerName}
          onClose={() => setSelectedOrder(null)}
          onSubmit={(requirements) => {
            onOrderSubmit(selectedOrder, requirements);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
