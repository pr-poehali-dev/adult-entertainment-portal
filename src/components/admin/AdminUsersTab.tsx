import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'dating';
  status: 'active' | 'blocked';
  registeredAt: string;
  balance: number;
  lastActivity: string;
  isOnline: boolean;
}

interface AdminUsersTabProps {
  users: User[];
  blockUser: (userId: number) => void;
}

export const AdminUsersTab = ({ users, blockUser }: AdminUsersTabProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление пользователями</CardTitle>
        <CardDescription>Список всех зарегистрированных пользователей</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {user.isOnline && (
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    )}
                    <h3 className="font-semibold">{user.name}</h3>
                  </div>
                  <Badge variant={user.role === 'seller' ? 'default' : user.role === 'buyer' ? 'secondary' : 'outline'}>
                    {user.role === 'seller' ? 'Девушка' : user.role === 'buyer' ? 'Мужчина' : 'Знакомства'}
                  </Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                    {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Регистрация: {user.registeredAt}</span>
                  <span>Баланс: {user.balance} ₽</span>
                  {user.isOnline ? (
                    <Badge className="bg-green-500 text-white text-xs px-2 py-0">
                      <Icon name="Circle" size={6} className="mr-1 fill-current" />
                      Онлайн
                    </Badge>
                  ) : (
                    <span>{getLastSeenText(user.lastActivity, user.isOnline)}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Icon name="Eye" size={16} className="mr-2" />
                  Просмотр
                </Button>
                {user.status === 'active' ? (
                  <Button variant="destructive" size="sm" onClick={() => blockUser(user.id)}>
                    <Icon name="Ban" size={16} className="mr-2" />
                    Блокировать
                  </Button>
                ) : (
                  <Button variant="default" size="sm">
                    <Icon name="Check" size={16} className="mr-2" />
                    Разблокировать
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};