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
}

interface AdminUsersTabProps {
  users: User[];
  blockUser: (userId: number) => void;
}

export const AdminUsersTab = ({ users, blockUser }: AdminUsersTabProps) => {
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
                  <h3 className="font-semibold">{user.name}</h3>
                  <Badge variant={user.role === 'seller' ? 'default' : user.role === 'buyer' ? 'secondary' : 'outline'}>
                    {user.role === 'seller' ? 'Продавец' : user.role === 'buyer' ? 'Покупатель' : 'Знакомства'}
                  </Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                    {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Регистрация: {user.registeredAt}</span>
                  <span>Баланс: {user.balance} ₽</span>
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
