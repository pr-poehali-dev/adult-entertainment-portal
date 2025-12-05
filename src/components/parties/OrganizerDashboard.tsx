import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { PrivateParty, PartyApplication } from '@/types';

interface OrganizerDashboardProps {
  organizerId: number;
  onBack: () => void;
  onViewParty: (partyId: number) => void;
  onOpenChat: (applicationId: number) => void;
}

const OrganizerDashboard = ({ organizerId, onBack, onViewParty, onOpenChat }: OrganizerDashboardProps) => {
  const [myParties] = useState<PrivateParty[]>([
    {
      id: 1,
      organizerId: organizerId,
      organizerName: 'Вы',
      organizerAvatar: '',
      organizerRating: 4.9,
      title: 'Закрытая вечеринка для избранных',
      description: 'Эксклюзивная вечеринка в стиле 90-х.',
      city: 'Москва',
      date: '2024-12-15',
      time: '22:00',
      theme: 'Ретро 90-е',
      maxTickets: 30,
      soldTickets: 12,
      ticketPrices: {
        female: 3000,
        couple: 8000,
        male: 6000,
      },
      currency: 'RUB',
      coverImage: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
      images: [],
      rules: ['Строгий фейс-контроль', 'Дресс-код: стиль 90-х', 'Полная конфиденциальность'],
      dresscode: 'Стиль 90-х',
      ageRestriction: '21+',
      isVerified: true,
      createdAt: '2024-12-01T10:00:00Z',
      applications: [
        {
          id: 1,
          partyId: 1,
          userId: 101,
          userName: 'Александр',
          userAvatar: '',
          userGender: 'male',
          status: 'pending',
          appliedAt: '2024-12-05T10:00:00Z',
        },
        {
          id: 2,
          partyId: 1,
          userId: 102,
          userName: 'Мария',
          userAvatar: '',
          userGender: 'female',
          status: 'interview',
          appliedAt: '2024-12-05T11:30:00Z',
          chatId: 1,
        },
        {
          id: 3,
          partyId: 1,
          userId: 103,
          userName: 'Дмитрий и Анна',
          userAvatar: '',
          userGender: 'couple',
          status: 'approved',
          appliedAt: '2024-12-04T15:00:00Z',
          approvedAt: '2024-12-04T16:00:00Z',
        },
        {
          id: 4,
          partyId: 1,
          userId: 104,
          userName: 'Елена',
          userAvatar: '',
          userGender: 'female',
          status: 'paid',
          appliedAt: '2024-12-04T12:00:00Z',
          approvedAt: '2024-12-04T13:00:00Z',
          paidAt: '2024-12-04T13:30:00Z',
        },
        {
          id: 5,
          partyId: 1,
          userId: 105,
          userName: 'Игорь',
          userAvatar: '',
          userGender: 'male',
          status: 'rejected',
          appliedAt: '2024-12-03T18:00:00Z',
        },
      ],
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Новая заявка</Badge>;
      case 'interview':
        return <Badge className="bg-blue-500">Собеседование</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Одобрено</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Отклонено</Badge>;
      case 'paid':
        return <Badge className="bg-purple-500">Оплачено</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male': return 'Мужчина';
      case 'female': return 'Девушка';
      case 'couple': return 'Пара';
      default: return gender;
    }
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male': return 'User';
      case 'female': return 'UserCircle';
      case 'couple': return 'Users';
      default: return 'User';
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'RUB': return '₽';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  const getTotalRevenue = (party: PrivateParty) => {
    const paidApplications = party.applications?.filter(app => app.status === 'paid') || [];
    return paidApplications.reduce((sum, app) => {
      const price = party.ticketPrices[app.userGender];
      return sum + price;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Личный кабинет организатора</h1>
            <p className="text-muted-foreground">Управление вашими вечеринками и заявками</p>
          </div>
          <Button size="lg">
            <Icon name="Plus" size={20} className="mr-2" />
            Создать вечеринку
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Icon name="PartyPopper" size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Всего вечеринок</p>
                  <p className="text-2xl font-bold">{myParties.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Продано билетов</p>
                  <p className="text-2xl font-bold">
                    {myParties.reduce((sum, party) => sum + (party.applications?.filter(a => a.status === 'paid').length || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Icon name="DollarSign" size={24} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Общий доход</p>
                  <p className="text-2xl font-bold">
                    {myParties.reduce((sum, party) => sum + getTotalRevenue(party), 0).toLocaleString()} ₽
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {myParties.map((party) => (
          <Card key={party.id} className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <img
                    src={party.coverImage}
                    alt={party.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <CardTitle className="mb-2">{party.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="Calendar" size={16} />
                        {new Date(party.date).toLocaleDateString('ru-RU')} в {party.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="MapPin" size={16} />
                        {party.city}
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Users" size={16} />
                        {party.soldTickets}/{party.maxTickets} мест
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={() => onViewParty(party.id)}>
                  <Icon name="Eye" size={16} className="mr-2" />
                  Посмотреть
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="pending" className="flex items-center gap-1">
                    <Icon name="Clock" size={14} />
                    <span className="hidden sm:inline">Новые</span>
                    <Badge variant="secondary" className="ml-1">
                      {party.applications?.filter(a => a.status === 'pending').length || 0}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="interview" className="flex items-center gap-1">
                    <Icon name="MessageCircle" size={14} />
                    <span className="hidden sm:inline">Собеседование</span>
                    <Badge variant="secondary" className="ml-1">
                      {party.applications?.filter(a => a.status === 'interview').length || 0}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="flex items-center gap-1">
                    <Icon name="Check" size={14} />
                    <span className="hidden sm:inline">Одобрено</span>
                    <Badge variant="secondary" className="ml-1">
                      {party.applications?.filter(a => a.status === 'approved').length || 0}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="paid" className="flex items-center gap-1">
                    <Icon name="CreditCard" size={14} />
                    <span className="hidden sm:inline">Оплачено</span>
                    <Badge variant="secondary" className="ml-1">
                      {party.applications?.filter(a => a.status === 'paid').length || 0}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="flex items-center gap-1">
                    <Icon name="X" size={14} />
                    <span className="hidden sm:inline">Отклонено</span>
                    <Badge variant="secondary" className="ml-1">
                      {party.applications?.filter(a => a.status === 'rejected').length || 0}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                {['pending', 'interview', 'approved', 'paid', 'rejected'].map((statusFilter) => (
                  <TabsContent key={statusFilter} value={statusFilter} className="space-y-3">
                    {party.applications?.filter(app => app.status === statusFilter).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Нет заявок в этом статусе</p>
                      </div>
                    ) : (
                      party.applications?.filter(app => app.status === statusFilter).map((application) => (
                        <Card key={application.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    {application.userName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-semibold">{application.userName}</div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Icon name={getGenderIcon(application.userGender) as any} size={14} />
                                    <span>{getGenderLabel(application.userGender)}</span>
                                    <span>•</span>
                                    <span>
                                      {party.ticketPrices[application.userGender].toLocaleString()} {getCurrencySymbol(party.currency)}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Подал заявку: {new Date(application.appliedAt).toLocaleString('ru-RU')}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {getStatusBadge(application.status)}
                                {(application.status === 'interview' || application.status === 'pending') && (
                                  <Button
                                    size="sm"
                                    onClick={() => onOpenChat(application.id)}
                                  >
                                    <Icon name="MessageCircle" size={16} className="mr-1" />
                                    {application.status === 'pending' ? 'Начать' : 'Открыть'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
