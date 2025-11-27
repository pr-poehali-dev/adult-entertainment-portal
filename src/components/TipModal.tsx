import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  serviceName: string;
  bookingId: number;
}

export const TipModal = ({ isOpen, onClose, sellerName, serviceName, bookingId }: TipModalProps) => {
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [customTip, setCustomTip] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleTipSubmit = () => {
    if (tipAmount === 0) {
      toast({
        title: 'Ошибка',
        description: 'Выберите сумму чаевых',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Чаевые отправлены!',
      description: `${tipAmount.toLocaleString('ru-RU')} ₽ успешно переведены продавцу ${sellerName}`,
    });

    onClose();
    setTipAmount(0);
    setCustomTip('');
    setMessage('');
  };

  const quickTipAmounts = [500, 1000, 2000, 3000, 5000, 10000];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-lg bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Icon name="Heart" size={32} className="text-pink-500" />
                Чаевые продавцу
              </CardTitle>
              <CardDescription className="mt-2">
                {sellerName} • {serviceName}
              </CardDescription>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <Icon name="Sparkles" size={24} className="text-pink-500 mt-1" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Отблагодарите продавца</p>
                  <p className="text-muted-foreground">
                    Чаевые поступают напрямую продавцу и помогают поддержать качественный сервис
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Icon name="CreditCard" size={18} />
              Выберите сумму
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {quickTipAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setTipAmount(amount);
                    setCustomTip('');
                  }}
                  className={`py-4 px-3 rounded-lg text-base font-semibold transition-all ${
                    tipAmount === amount && !customTip
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'bg-muted hover:bg-muted/80 text-foreground hover:scale-105'
                  }`}
                >
                  {amount.toLocaleString('ru-RU')} ₽
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon name="Edit" size={14} />
                Или укажите свою сумму
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Введите сумму"
                  value={customTip}
                  onChange={(e) => {
                    setCustomTip(e.target.value);
                    setTipAmount(parseInt(e.target.value) || 0);
                  }}
                  className="bg-background border-border text-lg py-6"
                  min="0"
                />
                {tipAmount > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setTipAmount(0);
                      setCustomTip('');
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="X" size={20} />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon name="MessageSquare" size={14} />
                Сообщение продавцу (необязательно)
              </label>
              <Input
                type="text"
                placeholder="Спасибо за отличный сервис!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>

          {tipAmount > 0 && (
            <>
              <Separator />
              <Card className="bg-muted/30 border-border">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-foreground/70">Сумма чаевых:</span>
                    <span className="font-semibold">{tipAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Итого к оплате:</span>
                    <span className="text-2xl font-bold text-primary">{tipAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border"
            >
              Отмена
            </Button>
            <Button
              onClick={handleTipSubmit}
              disabled={tipAmount === 0}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
            >
              <Icon name="Heart" className="mr-2" size={18} />
              Отправить {tipAmount > 0 ? `${tipAmount.toLocaleString('ru-RU')} ₽` : ''}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <Icon name="Lock" size={12} />
            Платёж защищён. Средства поступят напрямую продавцу
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TipModal;
