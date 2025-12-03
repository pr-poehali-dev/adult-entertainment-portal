import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Message {
  id: number;
  userId: number;
  userName: string;
  message: string;
  timestamp: string;
  isFromAdmin: boolean;
}

interface AdminMessagingProps {
  users: User[];
  messages: Message[];
  onSendMessage: (userId: number, message: string) => void;
}

export const AdminMessaging = ({ users, messages, onSendMessage }: AdminMessagingProps) => {
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenMessageDialog = (user: User) => {
    setSelectedUser(user);
    setShowMessageDialog(true);
    setMessageText('');
  };

  const handleSendMessage = () => {
    if (!selectedUser || !messageText.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите сообщение',
        variant: 'destructive',
      });
      return;
    }

    onSendMessage(selectedUser.id, messageText);
    setMessageText('');
    setShowMessageDialog(false);
    
    toast({
      title: 'Сообщение отправлено',
      description: `Сообщение отправлено пользователю ${selectedUser.name}`,
    });
  };

  const getUserMessages = (userId: number) => {
    return messages.filter(m => m.userId === userId);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'seller':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500">Продавец</Badge>;
      case 'buyer':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500">Покупатель</Badge>;
      case 'dating':
        return <Badge variant="outline" className="bg-pink-500/10 text-pink-500 border-pink-500">Знакомства</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Сообщения пользователям</h3>
          <p className="text-sm text-muted-foreground">
            Отправляйте сообщения от имени АДМИНИСТРАТОРА
          </p>
        </div>
      </div>

      <div className="relative">
        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Поиск пользователей..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => {
          const userMessages = getUserMessages(user.id);
          const lastMessage = userMessages[userMessages.length - 1];
          
          return (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                      {user.name}
                      {getRoleBadge(user.role)}
                      {user.status === 'blocked' && <Badge variant="destructive">Заблокирован</Badge>}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    
                    {lastMessage && (
                      <div className="mt-2 p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          Последнее сообщение от {lastMessage.isFromAdmin ? 'АДМИНИСТРАТОРА' : user.name}:
                        </p>
                        <p className="text-sm">{lastMessage.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(lastMessage.timestamp).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleOpenMessageDialog(user)}
                    className="ml-4"
                  >
                    <Icon name="MessageSquare" size={16} className="mr-2" />
                    Написать
                  </Button>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Пользователи не найдены</p>
        </div>
      )}

      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Отправить сообщение от АДМИНИСТРАТОРА</DialogTitle>
            <DialogDescription>
              Сообщение пользователю: {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border-2 border-green-500">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Shield" size={16} className="text-green-500" />
                <span className="font-semibold text-green-600">АДМИНИСТРАТОР</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Это сообщение будет выделено зеленым цветом и отправитель будет указан как "АДМИНИСТРАТОР"
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Текст сообщения</Label>
              <Textarea
                id="message"
                placeholder="Введите ваше сообщение..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            {selectedUser && getUserMessages(selectedUser.id).length > 0 && (
              <div className="space-y-2">
                <Label>История сообщений</Label>
                <div className="max-h-[200px] overflow-y-auto space-y-2 p-3 rounded-lg bg-muted/30">
                  {getUserMessages(selectedUser.id).slice(-5).map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.isFromAdmin
                          ? 'bg-green-500/10 border-2 border-green-500'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.isFromAdmin ? (
                          <>
                            <Icon name="Shield" size={14} className="text-green-500" />
                            <span className="text-xs font-semibold text-green-600">АДМИНИСТРАТОР</span>
                          </>
                        ) : (
                          <span className="text-xs font-semibold">{msg.userName}</span>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(msg.timestamp).toLocaleString('ru-RU')}
                        </span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
              <Icon name="Send" size={16} className="mr-2" />
              Отправить от АДМИНИСТРАТОРА
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
