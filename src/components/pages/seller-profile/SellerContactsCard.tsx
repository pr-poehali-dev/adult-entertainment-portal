import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ProfileContacts, Wallet } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SellerContactsCardProps {
  contacts?: ProfileContacts;
  sellerName: string;
  wallet?: Wallet;
  onPurchase?: (contactType: 'instagram' | 'telegram' | 'phone', amount: number, currency: string) => void;
}

export const SellerContactsCard = ({ contacts, sellerName, wallet, onPurchase }: SellerContactsCardProps) => {
  const { toast } = useToast();
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<{
    type: 'instagram' | 'telegram' | 'phone';
    label: string;
    icon: string;
    price: { amount: number; currency: string };
  } | null>(null);
  const [purchasedContacts, setPurchasedContacts] = useState<Set<string>>(new Set());

  if (!contacts) return null;

  const availableContacts = [
    contacts.instagram && {
      type: 'instagram' as const,
      label: 'Instagram',
      icon: 'Instagram',
      value: contacts.instagram.value,
      forSale: contacts.instagram.forSale,
      price: contacts.instagram.price,
    },
    contacts.telegram && {
      type: 'telegram' as const,
      label: 'Telegram',
      icon: 'Send',
      value: contacts.telegram.value,
      forSale: contacts.telegram.forSale,
      price: contacts.telegram.price,
    },
    contacts.phone && {
      type: 'phone' as const,
      label: 'Телефон',
      icon: 'Phone',
      value: contacts.phone.value,
      forSale: contacts.phone.forSale,
      price: contacts.phone.price,
    },
  ].filter((contact): contact is NonNullable<typeof contact> => 
    contact !== null && contact !== undefined && Boolean(contact.value)
  );

  if (availableContacts.length === 0) return null;

  const handleBuyClick = (contact: typeof availableContacts[0]) => {
    if (!contact.forSale || !contact.price) return;

    setSelectedContact({
      type: contact.type,
      label: contact.label,
      icon: contact.icon,
      price: contact.price,
    });
    setShowPurchaseDialog(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedContact) return;

    const userBalance = wallet?.balances.find(b => b.currency === selectedContact.price.currency);
    
    if (!userBalance || userBalance.amount < selectedContact.price.amount) {
      toast({
        title: "Недостаточно средств",
        description: `На вашем балансе недостаточно ${selectedContact.price.currency}`,
        variant: "destructive",
      });
      setShowPurchaseDialog(false);
      return;
    }

    onPurchase?.(selectedContact.type, selectedContact.price.amount, selectedContact.price.currency);
    
    setPurchasedContacts(prev => new Set(prev).add(selectedContact.type));
    
    toast({
      title: "Контакт приобретен!",
      description: `${selectedContact.label} теперь доступен в вашем профиле`,
    });
    
    setShowPurchaseDialog(false);
    setSelectedContact(null);
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      RUB: '₽',
      USD: '$',
      TON: 'TON',
      USDT: 'USDT',
    };
    return symbols[currency] || currency;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="AtSign" size={20} className="text-primary" />
            Контакты
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableContacts.map((contact) => {
            const isPurchased = purchasedContacts.has(contact.type);
            const isFree = !contact.forSale;

            return (
              <div
                key={contact.type}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={contact.icon as any} size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{contact.label}</p>
                    {(isFree || isPurchased) ? (
                      <p className="text-sm text-muted-foreground">{contact.value}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Доступно после покупки</p>
                    )}
                  </div>
                </div>

                {isFree ? (
                  <Badge variant="secondary" className="ml-auto">
                    <Icon name="Check" size={12} className="mr-1" />
                    Бесплатно
                  </Badge>
                ) : isPurchased ? (
                  <Badge variant="default" className="ml-auto">
                    <Icon name="CheckCircle" size={12} className="mr-1" />
                    Куплено
                  </Badge>
                ) : contact.price ? (
                  <Button
                    size="sm"
                    onClick={() => handleBuyClick(contact)}
                    className="ml-auto"
                  >
                    <Icon name="ShoppingCart" size={14} className="mr-2" />
                    Купить за {contact.price.amount} {getCurrencySymbol(contact.price.currency)}
                  </Button>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение покупки</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите приобрести контакт?
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={selectedContact.icon as any} size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{selectedContact.label}</p>
                  <p className="text-sm text-muted-foreground">Продавец: {sellerName}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                <span className="font-semibold">Стоимость:</span>
                <span className="text-2xl font-bold text-primary">
                  {selectedContact.price.amount} {getCurrencySymbol(selectedContact.price.currency)}
                </span>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Контакт будет доступен сразу после оплаты</p>
                <p>• Средства спишутся с вашего баланса</p>
                <p>• Продавец получит уведомление о покупке</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleConfirmPurchase}>
              <Icon name="CreditCard" size={16} className="mr-2" />
              Подтвердить покупку
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
