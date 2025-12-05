import { useState } from 'react';
import { testUsers } from '@/data/testDatabase';
import { AdminUser } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export const AdminUsers = () => {
  const { toast } = useToast();
  const [users] = useState<AdminUser[]>(testUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'seller' | 'buyer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (userId: number, action: string) => {
    toast({
      title: 'Действие выполнено',
      description: `Действие "${action}" применено к пользователю #${userId}`,
    });
  };

  const getStatusBadge = (status: AdminUser['status']) => {
    const variants = {
      active: { variant: 'default' as const, label: 'Активен', icon: 'CheckCircle' },
      suspended: { variant: 'secondary' as const, label: 'Приостановлен', icon: 'Pause' },
      banned: { variant: 'destructive' as const, label: 'Заблокирован', icon: 'Ban' }
    };
    const config = variants[status];
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon name={config.icon as any} size={12} />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Управление пользователями</h2>
        <p className="text-muted-foreground">Всего пользователей: {users.length}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все роли</SelectItem>
            <SelectItem value="seller">Продавцы</SelectItem>
            <SelectItem value="buyer">Покупатели</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="suspended">Приостановленные</SelectItem>
            <SelectItem value="banned">Заблокированные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold">ID</th>
                <th className="text-left p-4 font-semibold">Пользователь</th>
                <th className="text-left p-4 font-semibold">Роль</th>
                <th className="text-left p-4 font-semibold">Статус</th>
                <th className="text-left p-4 font-semibold">Бронирований</th>
                <th className="text-left p-4 font-semibold">Потрачено</th>
                <th className="text-left p-4 font-semibold">Последняя активность</th>
                <th className="text-left p-4 font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">#{user.id}</td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {user.name}
                        {user.verified && <Icon name="CheckCircle" size={14} className="text-primary" />}
                        {user.vipStatus === 'vip' && <Icon name="Crown" size={14} className="text-amber-500" />}
                      </div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">
                      {user.role === 'seller' ? 'Продавец' : 'Покупатель'}
                    </Badge>
                  </td>
                  <td className="p-4">{getStatusBadge(user.status)}</td>
                  <td className="p-4">{user.totalBookings}</td>
                  <td className="p-4">
                    {user.totalSpent > 0 ? `${user.totalSpent.toLocaleString()} ₽` : '—'}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(user.lastActive).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleUserAction(user.id, 'просмотр')}
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleUserAction(user.id, 'редактирование')}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleUserAction(user.id, user.status === 'active' ? 'блокировка' : 'разблокировка')}
                      >
                        <Icon name={user.status === 'active' ? 'Ban' : 'CheckCircle'} size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-border">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-medium flex items-center gap-2">
                    {user.name}
                    {user.verified && <Icon name="CheckCircle" size={14} className="text-primary" />}
                    {user.vipStatus === 'vip' && <Icon name="Crown" size={14} className="text-amber-500" />}
                  </div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <div className="text-xs text-muted-foreground">ID: #{user.id}</div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleUserAction(user.id, 'просмотр')}>
                    <Icon name="Eye" size={16} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleUserAction(user.id, user.status === 'active' ? 'блокировка' : 'разблокировка')}>
                    <Icon name={user.status === 'active' ? 'Ban' : 'CheckCircle'} size={16} />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Роль:</span>
                  <Badge variant="outline" className="ml-2">
                    {user.role === 'seller' ? 'Продавец' : 'Покупатель'}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Статус:</span>
                  <span className="ml-2">{getStatusBadge(user.status)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Бронирований:</span>
                  <span className="ml-2 font-medium">{user.totalBookings}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Потрачено:</span>
                  <span className="ml-2 font-medium">{user.totalSpent > 0 ? `${user.totalSpent.toLocaleString()} ₽` : '—'}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Последняя активность: {new Date(user.lastActive).toLocaleDateString('ru-RU')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={64} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">Пользователи не найдены</p>
        </div>
      )}
    </div>
  );
};