import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller' | 'dating';
  balance: number;
  status: 'active' | 'blocked';
  registeredAt: string;
  lastActivity: string;
  totalSpent: number;
  isOnline: boolean;
}

interface AdminClientsTabProps {
  clients: Client[];
  onBlockClient: (clientId: number) => void;
  onUpdateBalance: (clientId: number, newBalance: number) => void;
}

export const AdminClientsTab = ({ clients, onBlockClient, onUpdateBalance }: AdminClientsTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingBalance, setEditingBalance] = useState<number | null>(null);
  const [newBalance, setNewBalance] = useState('');
  const { toast } = useToast();

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    
    const matchesRole = filterRole === 'all' || client.role === filterRole;
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleBalanceEdit = (client: Client) => {
    setEditingBalance(client.id);
    setNewBalance(client.balance.toString());
  };

  const handleBalanceSave = (clientId: number) => {
    const amount = parseFloat(newBalance);
    if (isNaN(amount)) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректную сумму',
        variant: 'destructive',
      });
      return;
    }
    onUpdateBalance(clientId, amount);
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

  const getLastSeenText = (lastActivity: string, isOnline: boolean) => {
    if (isOnline) return 'Онлайн';
    
    const lastSeen = new Date(lastActivity);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    
    return lastSeen.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'seller':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500">Девушка</Badge>;
      case 'buyer':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500">Мужчина</Badge>;
      case 'dating':
        return <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500">Знакомства</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени, email или телефону..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Роль" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все роли</SelectItem>
            <SelectItem value="buyer">Мужчины</SelectItem>
            <SelectItem value="seller">Девушки</SelectItem>
            <SelectItem value="dating">Знакомства</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="blocked">Заблокированные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        Найдено клиентов: <span className="font-semibold">{filteredClients.length}</span>
      </div>

      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {client.isOnline && (
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                      )}
                      {client.name}
                    </div>
                    {getStatusBadge(client.status)}
                    {getRoleBadge(client.role)}
                  </CardTitle>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Icon name="Mail" size={14} />
                      {client.email}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Icon name="Phone" size={14} />
                      {client.phone}
                    </p>
                  </div>
                </div>
                <Button
                  variant={client.status === 'blocked' ? 'outline' : 'destructive'}
                  size="sm"
                  onClick={() => onBlockClient(client.id)}
                >
                  <Icon name={client.status === 'blocked' ? 'Unlock' : 'Lock'} size={16} className="mr-2" />
                  {client.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Баланс</p>
                  {editingBalance === client.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        className="w-32"
                      />
                      <Button size="sm" onClick={() => handleBalanceSave(client.id)}>
                        <Icon name="Check" size={16} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingBalance(null)}>
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">{client.balance.toLocaleString()} ₽</p>
                      <Button size="sm" variant="ghost" onClick={() => handleBalanceEdit(client)}>
                        <Icon name="Edit" size={14} />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Всего потрачено</p>
                  <p className="text-lg font-semibold">{client.totalSpent.toLocaleString()} ₽</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Регистрация</p>
                  <p className="text-sm">{new Date(client.registeredAt).toLocaleDateString('ru-RU')}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Последняя активность</p>
                  <div className="flex items-center gap-2">
                    {client.isOnline ? (
                      <Badge className="bg-green-500 text-white">
                        <Icon name="Circle" size={8} className="mr-1 fill-current" />
                        Онлайн
                      </Badge>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {getLastSeenText(client.lastActivity, client.isOnline)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ID клиента</p>
                  <p className="text-sm font-mono">#{client.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Icon name="UserX" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Клиенты не найдены</p>
        </div>
      )}
    </div>
  );
};