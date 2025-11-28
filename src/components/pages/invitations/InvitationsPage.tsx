import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { DinnerInvitation, Page } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface InvitationsPageProps {
  setCurrentPage: (page: Page) => void;
}

export const InvitationsPage = ({ setCurrentPage }: InvitationsPageProps) => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<DinnerInvitation[]>([
    {
      id: 1,
      providerId: 1,
      providerName: 'Анна Романова',
      providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      buyerId: 10,
      buyerName: 'Дмитрий Иванов',
      buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
      scheduleId: 1,
      date: '2024-12-01',
      time: '19:00',
      restaurant: 'White Rabbit',
      location: 'Смоленская площадь, 3',
      status: 'pending',
      createdAt: '2024-11-28T10:00:00Z',
      expiresAt: '2024-11-29T10:00:00Z',
      message: 'Буду рад познакомиться и провести приятный вечер',
    },
    {
      id: 2,
      providerId: 1,
      providerName: 'Анна Романова',
      providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      buyerId: 11,
      buyerName: 'Алексей Смирнов',
      buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      scheduleId: 1,
      date: '2024-12-01',
      time: '19:00',
      restaurant: 'White Rabbit',
      location: 'Смоленская площадь, 3',
      status: 'pending',
      createdAt: '2024-11-28T11:30:00Z',
      expiresAt: '2024-11-29T11:30:00Z',
      message: 'Хотел бы пригласить вас на ужин',
    },
    {
      id: 3,
      providerId: 1,
      providerName: 'Анна Романова',
      providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      buyerId: 12,
      buyerName: 'Сергей Петров',
      buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sergey',
      scheduleId: 2,
      date: '2024-12-07',
      time: '20:00',
      restaurant: 'Turandot',
      location: 'Тверской бульвар, 26',
      status: 'pending',
      createdAt: '2024-11-28T12:00:00Z',
      expiresAt: '2024-11-29T12:00:00Z',
    },
    {
      id: 4,
      providerId: 1,
      providerName: 'Анна Романова',
      providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      buyerId: 13,
      buyerName: 'Михаил Козлов',
      buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mikhail',
      scheduleId: 1,
      date: '2024-12-01',
      time: '19:00',
      restaurant: 'White Rabbit',
      location: 'Смоленская площадь, 3',
      status: 'pending',
      createdAt: '2024-11-28T09:00:00Z',
      expiresAt: '2024-11-29T09:00:00Z',
      message: 'С удовольствием познакомлюсь',
    },
    {
      id: 5,
      providerId: 1,
      providerName: 'Анна Романова',
      providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      buyerId: 14,
      buyerName: 'Владимир Николаев',
      buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vladimir',
      scheduleId: 1,
      date: '2024-12-01',
      time: '19:00',
      restaurant: 'White Rabbit',
      location: 'Смоленская площадь, 3',
      status: 'pending',
      createdAt: '2024-11-28T13:00:00Z',
      expiresAt: '2024-11-29T13:00:00Z',
    },
  ]);

  const [timeRemaining, setTimeRemaining] = useState<Record<number, string>>({});

  useEffect(() => {
    const updateTimers = () => {
      const now = new Date().getTime();
      const remaining: Record<number, string> = {};

      invitations.forEach((inv) => {
        if (inv.status === 'pending') {
          const expires = new Date(inv.expiresAt).getTime();
          const diff = expires - now;

          if (diff <= 0) {
            remaining[inv.id] = 'Истекло';
          } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            remaining[inv.id] = `${hours}ч ${minutes}м`;
          }
        }
      });

      setTimeRemaining(remaining);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 60000);

    return () => clearInterval(interval);
  }, [invitations]);

  const groupedInvitations = invitations.reduce((acc, inv) => {
    const key = `${inv.date}-${inv.time}-${inv.restaurant}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(inv);
    return acc;
  }, {} as Record<string, DinnerInvitation[]>);

  const handleAccept = (invitationId: number, groupKey: string) => {
    const group = groupedInvitations[groupKey];
    const acceptedInvitation = group.find((inv) => inv.id === invitationId);

    if (!acceptedInvitation) return;

    setInvitations((prev) =>
      prev.map((inv) => {
        if (inv.id === invitationId) {
          return { ...inv, status: 'accepted' as const };
        }
        if (group.some((g) => g.id === inv.id) && inv.id !== invitationId) {
          return { ...inv, status: 'rejected' as const };
        }
        return inv;
      })
    );

    toast({
      title: 'Приглашение принято!',
      description: `Вы подтвердили встречу с ${acceptedInvitation.buyerName}`,
    });
  };

  const handleReject = (invitationId: number) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: 'rejected' as const } : inv
      )
    );

    toast({
      title: 'Приглашение отклонено',
      description: 'Кандидат получит уведомление',
      variant: 'destructive',
    });
  };

  const handleRejectAll = () => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.status === 'pending' ? { ...inv, status: 'rejected' as const } : inv
      )
    );

    toast({
      title: 'Все приглашения отклонены',
      description: `Отклонено ${invitations.filter((i) => i.status === 'pending').length} приглашений`,
      variant: 'destructive',
    });
  };

  const pendingCount = invitations.filter((i) => i.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-wide mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('profile')}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад в профиль
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                Приглашения на ужин
                {pendingCount > 0 && (
                  <Badge className="bg-primary text-lg px-3 py-1">
                    {pendingCount}
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground text-lg">
                Выберите одного человека на каждую дату
              </p>
            </div>
            
            {pendingCount > 3 && (
              <Button
                variant="destructive"
                onClick={handleRejectAll}
                className="flex items-center gap-2"
              >
                <Icon name="XCircle" size={20} />
                Отклонить все ({pendingCount})
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedInvitations).map(([groupKey, group]) => {
            const pending = group.filter((inv) => inv.status === 'pending');
            const accepted = group.find((inv) => inv.status === 'accepted');
            const firstInv = group[0];

            if (pending.length === 0 && !accepted) return null;

            return (
              <Card key={groupKey} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/20 p-3 rounded-lg">
                        <Icon name="Calendar" size={24} className="text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {new Date(firstInv.date).toLocaleDateString('ru-RU', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                          })}
                          {' в '}
                          {firstInv.time}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Icon name="UtensilsCrossed" size={16} />
                          <span className="font-medium">{firstInv.restaurant}</span>
                          <span>•</span>
                          <span>{firstInv.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    {pending.length > 0 && (
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {pending.length} {pending.length === 1 ? 'кандидат' : 'кандидата'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {accepted ? (
                    <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-500/20 p-3 rounded-full">
                          <Icon name="CheckCircle2" size={32} className="text-green-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">Встреча подтверждена</h3>
                          <p className="text-muted-foreground">
                            Вы приняли приглашение от <span className="font-semibold">{accepted.buyerName}</span>
                          </p>
                        </div>
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                            {accepted.buyerName.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pending.map((invitation) => (
                        <div
                          key={invitation.id}
                          className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/20 text-primary">
                                {invitation.buyerName.split(' ').map((n) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-lg">{invitation.buyerName}</h4>
                                <div className="flex items-center gap-2">
                                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {timeRemaining[invitation.id] || 'Загрузка...'}
                                  </span>
                                </div>
                              </div>
                              
                              {invitation.message && (
                                <p className="text-sm text-muted-foreground mb-3 italic">
                                  "{invitation.message}"
                                </p>
                              )}
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleAccept(invitation.id, groupKey)}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  <Icon name="Check" size={16} className="mr-1" />
                                  Принять
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(invitation.id)}
                                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                >
                                  <Icon name="X" size={16} className="mr-1" />
                                  Отклонить
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {pendingCount === 0 && (
          <Card className="p-12 text-center">
            <Icon name="Inbox" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-2xl font-bold mb-2">Нет новых приглашений</h3>
            <p className="text-muted-foreground">
              Когда кто-то пригласит вас на ужин, приглашение появится здесь
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};