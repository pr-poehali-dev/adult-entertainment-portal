import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Party {
  id: string;
  title: string;
  description: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  maxGuests: number;
  currentGuests: number;
  price: number;
  currency: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  moderationStatus: 'pending' | 'approved' | 'rejected';
  category: string;
  rating: number;
  reviewsCount: number;
  revenue: number;
  createdAt: string;
}

const mockParties: Party[] = [
  {
    id: '1',
    title: 'Приватная вечеринка VIP',
    description: 'Эксклюзивная закрытая вечеринка для избранных гостей',
    organizer: 'Elite Events',
    date: '2024-02-15',
    time: '21:00',
    location: 'Москва, центр',
    maxGuests: 30,
    currentGuests: 18,
    price: 5000,
    currency: 'RUB',
    status: 'upcoming',
    moderationStatus: 'approved',
    category: 'vip',
    rating: 4.8,
    reviewsCount: 12,
    revenue: 90000,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    title: 'Тематическая вечеринка 80-х',
    description: 'Ностальгическая вечеринка с музыкой и атмосферой 80-х годов',
    organizer: 'Retro Party Team',
    date: '2024-02-20',
    time: '20:00',
    location: 'Санкт-Петербург',
    maxGuests: 50,
    currentGuests: 35,
    price: 2000,
    currency: 'RUB',
    status: 'upcoming',
    moderationStatus: 'approved',
    category: 'theme',
    rating: 4.5,
    reviewsCount: 8,
    revenue: 70000,
    createdAt: '2024-01-12',
  },
  {
    id: '3',
    title: 'Свинг вечеринка для пар',
    description: 'Закрытая вечеринка для пар, строгий фейс-контроль',
    organizer: 'Couples Club',
    date: '2024-02-18',
    time: '22:00',
    location: 'Москва, загородный клуб',
    maxGuests: 20,
    currentGuests: 0,
    price: 8000,
    currency: 'RUB',
    status: 'upcoming',
    moderationStatus: 'pending',
    category: 'adult',
    rating: 0,
    reviewsCount: 0,
    revenue: 0,
    createdAt: '2024-01-18',
  },
  {
    id: '4',
    title: 'Бизнес-нетворкинг',
    description: 'Деловое мероприятие для предпринимателей и инвесторов',
    organizer: 'Business Connect',
    date: '2024-01-25',
    time: '19:00',
    location: 'Москва, Сити',
    maxGuests: 100,
    currentGuests: 100,
    price: 3000,
    currency: 'RUB',
    status: 'completed',
    moderationStatus: 'approved',
    category: 'business',
    rating: 4.9,
    reviewsCount: 45,
    revenue: 300000,
    createdAt: '2024-01-05',
  },
];

const categoryNames: Record<string, string> = {
  vip: 'VIP',
  theme: 'Тематическая',
  adult: 'Для взрослых',
  business: 'Бизнес',
  dating: 'Знакомства',
};

export const AdminParties = () => {
  const [parties, setParties] = useState<Party[]>(mockParties);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterModeration, setFilterModeration] = useState<string>('all');
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const filteredParties = parties.filter(party => {
    const matchSearch = party.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       party.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || party.status === filterStatus;
    const matchModeration = filterModeration === 'all' || party.moderationStatus === filterModeration;
    return matchSearch && matchStatus && matchModeration;
  });

  const handleApprove = (id: string) => {
    setParties(parties.map(p =>
      p.id === id ? { ...p, moderationStatus: 'approved' as const } : p
    ));
  };

  const handleReject = (id: string) => {
    setParties(parties.map(p =>
      p.id === id ? { ...p, moderationStatus: 'rejected' as const } : p
    ));
  };

  const handleCancel = (id: string) => {
    if (confirm('Отменить вечеринку? Гости будут уведомлены.')) {
      setParties(parties.map(p =>
        p.id === id ? { ...p, status: 'cancelled' as const } : p
      ));
    }
  };

  const getStatusBadge = (status: Party['status']) => {
    const variants = {
      upcoming: { variant: 'default' as const, label: 'Предстоящая', color: 'text-blue-600' },
      active: { variant: 'default' as const, label: 'Активная', color: 'text-green-600' },
      completed: { variant: 'secondary' as const, label: 'Завершена', color: 'text-gray-600' },
      cancelled: { variant: 'destructive' as const, label: 'Отменена', color: 'text-red-600' },
    };
    return variants[status];
  };

  const getModerationBadge = (status: Party['moderationStatus']) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'На модерации' },
      approved: { variant: 'default' as const, label: 'Одобрено' },
      rejected: { variant: 'destructive' as const, label: 'Отклонено' },
    };
    return variants[status];
  };

  const stats = {
    total: parties.length,
    upcoming: parties.filter(p => p.status === 'upcoming').length,
    pending: parties.filter(p => p.moderationStatus === 'pending').length,
    completed: parties.filter(p => p.status === 'completed').length,
    totalRevenue: parties.reduce((sum, p) => sum + p.revenue, 0),
    totalGuests: parties.reduce((sum, p) => sum + p.currentGuests, 0),
  };

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего вечеринок</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Icon name="PartyPopper" size={32} className="text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Предстоящие</p>
                <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
              </div>
              <Icon name="Calendar" size={32} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">На модерации</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Icon name="Clock" size={32} className="text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Выручка</p>
                <p className="text-2xl font-bold text-green-600">
                  {(stats.totalRevenue / 1000).toFixed(0)}K ₽
                </p>
              </div>
              <Icon name="TrendingUp" size={32} className="text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Фильтры и поиск</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Поиск</Label>
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Название или организатор"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Статус</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="upcoming">Предстоящие</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="completed">Завершённые</SelectItem>
                  <SelectItem value="cancelled">Отменённые</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Модерация</Label>
              <Select value={filterModeration} onValueChange={setFilterModeration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="pending">На модерации</SelectItem>
                  <SelectItem value="approved">Одобренные</SelectItem>
                  <SelectItem value="rejected">Отклонённые</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список вечеринок */}
      <Card>
        <CardHeader>
          <CardTitle>Вечеринки ({filteredParties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredParties.map((party) => (
              <Card key={party.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="PartyPopper" size={32} className="text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{party.title}</h3>
                            <Badge variant={getStatusBadge(party.status).variant}>
                              {getStatusBadge(party.status).label}
                            </Badge>
                            <Badge variant={getModerationBadge(party.moderationStatus).variant}>
                              {getModerationBadge(party.moderationStatus).label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{party.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Дата и время</p>
                          <p className="font-medium">
                            {new Date(party.date).toLocaleDateString('ru')} {party.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Гости</p>
                          <p className="font-medium">{party.currentGuests} / {party.maxGuests}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Цена</p>
                          <p className="font-medium">{party.price.toLocaleString()} ₽</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Выручка</p>
                          <p className="font-medium">{(party.revenue / 1000).toFixed(0)}K ₽</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Icon name="User" size={16} />
                          <span>{party.organizer}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="MapPin" size={16} />
                          <span>{party.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Tag" size={16} />
                          <span>{categoryNames[party.category]}</span>
                        </div>
                        {party.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Icon name="Star" size={16} className="text-yellow-500" />
                            <span>{party.rating} ({party.reviewsCount})</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {party.moderationStatus === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => handleApprove(party.id)}>
                              <Icon name="Check" size={16} className="mr-1" />
                              Одобрить
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(party.id)}>
                              <Icon name="X" size={16} className="mr-1" />
                              Отклонить
                            </Button>
                          </>
                        )}
                        {party.status === 'upcoming' && party.moderationStatus === 'approved' && (
                          <Button size="sm" variant="outline" onClick={() => handleCancel(party.id)}>
                            <Icon name="Ban" size={16} className="mr-1" />
                            Отменить
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedParty(party);
                          setShowDetailsDialog(true);
                        }}>
                          <Icon name="Eye" size={16} className="mr-1" />
                          Подробнее
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Диалог детальной информации */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Детали вечеринки</DialogTitle>
            <DialogDescription>
              Полная информация о мероприятии
            </DialogDescription>
          </DialogHeader>
          {selectedParty && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Название</Label>
                  <p className="text-lg font-semibold">{selectedParty.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Описание</Label>
                  <p>{selectedParty.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Организатор</Label>
                    <p>{selectedParty.organizer}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Категория</Label>
                    <p>{categoryNames[selectedParty.category]}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Дата</Label>
                    <p>{new Date(selectedParty.date).toLocaleDateString('ru')}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Время</Label>
                    <p>{selectedParty.time}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Место проведения</Label>
                  <p>{selectedParty.location}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Цена</Label>
                    <p className="text-lg font-semibold">{selectedParty.price.toLocaleString()} ₽</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Гости</Label>
                    <p className="text-lg font-semibold">{selectedParty.currentGuests} / {selectedParty.maxGuests}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Выручка</Label>
                    <p className="text-lg font-semibold">{selectedParty.revenue.toLocaleString()} ₽</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
