import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Seller {
  id: number;
  name: string;
  email: string;
  balance: number;
  commission: number;
  status: 'active' | 'blocked';
  registeredAt: string;
  totalEarnings: number;
}

interface AdminSellersTabProps {
  sellers: Seller[];
  onBlockSeller: (sellerId: number) => void;
  onUpdateBalance: (sellerId: number, newBalance: number) => void;
}

export const AdminSellersTab = ({ sellers, onBlockSeller, onUpdateBalance }: AdminSellersTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBalance, setEditingBalance] = useState<number | null>(null);
  const [newBalance, setNewBalance] = useState('');
  const { toast } = useToast();

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBalanceEdit = (seller: Seller) => {
    setEditingBalance(seller.id);
    setNewBalance(seller.balance.toString());
  };

  const handleBalanceSave = (sellerId: number) => {
    const amount = parseFloat(newBalance);
    if (isNaN(amount)) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректную сумму',
        variant: 'destructive',
      });
      return;
    }
    onUpdateBalance(sellerId, amount);
    setEditingBalance(null);
    toast({
      title: 'Баланс обновлен',
      description: `Новый баланс: ${amount} ₽`,
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-500">Активен</Badge>;
    }
    return <Badge variant="destructive">Заблокирован</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по нику или email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSellers.map((seller) => (
          <Card key={seller.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {seller.name}
                    {getStatusBadge(seller.status)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{seller.email}</p>
                </div>
                <Button
                  variant={seller.status === 'blocked' ? 'outline' : 'destructive'}
                  size="sm"
                  onClick={() => onBlockSeller(seller.id)}
                >
                  <Icon name={seller.status === 'blocked' ? 'Unlock' : 'Lock'} size={16} className="mr-2" />
                  {seller.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Баланс</p>
                  {editingBalance === seller.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        className="w-32"
                      />
                      <Button size="sm" onClick={() => handleBalanceSave(seller.id)}>
                        <Icon name="Check" size={16} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingBalance(null)}>
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">{seller.balance.toLocaleString()} ₽</p>
                      <Button size="sm" variant="ghost" onClick={() => handleBalanceEdit(seller)}>
                        <Icon name="Edit" size={14} />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Комиссия площадки</p>
                  <p className="text-lg font-semibold text-primary">{seller.commission.toLocaleString()} ₽</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Общий заработок</p>
                  <p className="text-lg font-semibold">{seller.totalEarnings.toLocaleString()} ₽</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Дата регистрации</p>
                  <p className="text-sm">{new Date(seller.registeredAt).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSellers.length === 0 && (
        <div className="text-center py-12">
          <Icon name="UserX" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Продавцы не найдены</p>
        </div>
      )}
    </div>
  );
};
