import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Agency {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  description: string;
  type: 'escort' | 'massage' | 'striptease' | 'virtual';
  status: 'pending' | 'verified' | 'rejected' | 'suspended';
  profilesCount: number;
  revenue: number;
  commission: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  verifiedAt?: string;
}

const mockAgencies: Agency[] = [
  {
    id: '1',
    name: 'VIP Escort Agency',
    owner: 'Анна Петрова',
    email: 'contact@vipescort.ru',
    phone: '+7 (900) 123-45-67',
    description: 'Премиальное агентство эскорт услуг с 10-летним опытом работы',
    type: 'escort',
    status: 'verified',
    profilesCount: 25,
    revenue: 1250000,
    commission: 187500,
    rating: 4.9,
    reviewsCount: 156,
    createdAt: '2023-06-15',
    verifiedAt: '2023-06-20',
  },
  {
    id: '2',
    name: 'Relax Massage Studio',
    owner: 'Дмитрий Иванов',
    email: 'info@relaxmassage.ru',
    phone: '+7 (911) 234-56-78',
    description: 'Сеть массажных салонов премиум класса',
    type: 'massage',
    status: 'verified',
    profilesCount: 18,
    revenue: 890000,
    commission: 133500,
    rating: 4.7,
    reviewsCount: 89,
    createdAt: '2023-08-10',
    verifiedAt: '2023-08-15',
  },
  {
    id: '3',
    name: 'Virtual Paradise',
    owner: 'Елена Смирнова',
    email: 'hello@virtualparadise.com',
    phone: '+7 (922) 345-67-89',
    description: 'Виртуальные развлечения и онлайн-общение',
    type: 'virtual',
    status: 'pending',
    profilesCount: 12,
    revenue: 0,
    commission: 0,
    rating: 0,
    reviewsCount: 0,
    createdAt: '2024-01-18',
  },
  {
    id: '4',
    name: 'Elite Striptease',
    owner: 'Сергей Волков',
    email: 'booking@elitestriptease.ru',
    phone: '+7 (933) 456-78-90',
    description: 'Профессиональные стриптиз шоу и частные выступления',
    type: 'striptease',
    status: 'suspended',
    profilesCount: 8,
    revenue: 340000,
    commission: 51000,
    rating: 3.8,
    reviewsCount: 23,
    createdAt: '2023-11-05',
    verifiedAt: '2023-11-10',
  },
];

const agencyTypeNames = {
  escort: 'Эскорт',
  massage: 'Массаж',
  striptease: 'Стриптиз',
  virtual: 'Виртуальные услуги',
};

export const AdminAgencies = () => {
  const [agencies, setAgencies] = useState<Agency[]>(mockAgencies);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const filteredAgencies = agencies.filter(agency => {
    const matchSearch = agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       agency.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || agency.status === filterStatus;
    const matchType = filterType === 'all' || agency.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const handleVerify = (id: string) => {
    setAgencies(agencies.map(a =>
      a.id === id ? { ...a, status: 'verified' as const, verifiedAt: new Date().toISOString().split('T')[0] } : a
    ));
  };

  const handleReject = (id: string) => {
    setAgencies(agencies.map(a =>
      a.id === id ? { ...a, status: 'rejected' as const } : a
    ));
  };

  const handleSuspend = (id: string) => {
    setAgencies(agencies.map(a =>
      a.id === id ? { ...a, status: 'suspended' as const } : a
    ));
  };

  const handleActivate = (id: string) => {
    setAgencies(agencies.map(a =>
      a.id === id ? { ...a, status: 'verified' as const } : a
    ));
  };

  const getStatusBadge = (status: Agency['status']) => {
    const variants = {
      verified: { variant: 'default' as const, label: 'Верифицировано', icon: 'CheckCircle', color: 'text-green-600' },
      pending: { variant: 'secondary' as const, label: 'На проверке', icon: 'Clock', color: 'text-yellow-600' },
      rejected: { variant: 'destructive' as const, label: 'Отклонено', icon: 'XCircle', color: 'text-red-600' },
      suspended: { variant: 'outline' as const, label: 'Заблокировано', icon: 'Ban', color: 'text-gray-600' },
    };
    return variants[status];
  };

  const stats = {
    total: agencies.length,
    verified: agencies.filter(a => a.status === 'verified').length,
    pending: agencies.filter(a => a.status === 'pending').length,
    suspended: agencies.filter(a => a.status === 'suspended').length,
    totalRevenue: agencies.reduce((sum, a) => sum + a.revenue, 0),
    totalCommission: agencies.reduce((sum, a) => sum + a.commission, 0),
    totalProfiles: agencies.reduce((sum, a) => sum + a.profilesCount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего агентств</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Icon name="Building2" size={32} className="text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Верифицировано</p>
                <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
              </div>
              <Icon name="CheckCircle" size={32} className="text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">На проверке</p>
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
                <p className="text-sm text-muted-foreground">Комиссия (15%)</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(stats.totalCommission / 1000).toFixed(0)}K ₽
                </p>
              </div>
              <Icon name="TrendingUp" size={32} className="text-blue-600" />
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
                  placeholder="Название или владелец"
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
                  <SelectItem value="verified">Верифицированные</SelectItem>
                  <SelectItem value="pending">На проверке</SelectItem>
                  <SelectItem value="suspended">Заблокированные</SelectItem>
                  <SelectItem value="rejected">Отклонённые</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Тип</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  {Object.entries(agencyTypeNames).map(([key, name]) => (
                    <SelectItem key={key} value={key}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список агентств */}
      <Card>
        <CardHeader>
          <CardTitle>Агентства ({filteredAgencies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAgencies.map((agency) => (
              <Card key={agency.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 flex-shrink-0">
                      <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-secondary text-white">
                        {agency.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{agency.name}</h3>
                            <Badge variant={getStatusBadge(agency.status).variant}>
                              <Icon name={getStatusBadge(agency.status).icon as any} size={14} className="mr-1" />
                              {getStatusBadge(agency.status).label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{agency.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Владелец</p>
                          <p className="text-sm font-medium">{agency.owner}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Тип</p>
                          <p className="text-sm font-medium">{agencyTypeNames[agency.type]}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Профилей</p>
                          <p className="text-sm font-medium">{agency.profilesCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Выручка</p>
                          <p className="text-sm font-medium">{(agency.revenue / 1000).toFixed(0)}K ₽</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {agency.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => handleVerify(agency.id)}>
                              <Icon name="CheckCircle" size={16} className="mr-1" />
                              Верифицировать
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(agency.id)}>
                              <Icon name="XCircle" size={16} className="mr-1" />
                              Отклонить
                            </Button>
                          </>
                        )}
                        {agency.status === 'verified' && (
                          <Button size="sm" variant="outline" onClick={() => handleSuspend(agency.id)}>
                            <Icon name="Ban" size={16} className="mr-1" />
                            Заблокировать
                          </Button>
                        )}
                        {agency.status === 'suspended' && (
                          <Button size="sm" onClick={() => handleActivate(agency.id)}>
                            <Icon name="Play" size={16} className="mr-1" />
                            Активировать
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedAgency(agency);
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Информация об агентстве</DialogTitle>
          </DialogHeader>
          {selectedAgency && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Информация</TabsTrigger>
                <TabsTrigger value="finance">Финансы</TabsTrigger>
                <TabsTrigger value="profiles">Профили</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Название</Label>
                    <p className="text-lg font-semibold">{selectedAgency.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Описание</Label>
                    <p>{selectedAgency.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Владелец</Label>
                      <p>{selectedAgency.owner}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Тип</Label>
                      <p>{agencyTypeNames[selectedAgency.type]}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p>{selectedAgency.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Телефон</Label>
                      <p>{selectedAgency.phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Дата создания</Label>
                      <p>{new Date(selectedAgency.createdAt).toLocaleDateString('ru')}</p>
                    </div>
                    {selectedAgency.verifiedAt && (
                      <div>
                        <Label className="text-muted-foreground">Дата верификации</Label>
                        <p>{new Date(selectedAgency.verifiedAt).toLocaleDateString('ru')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="finance" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Общая выручка</p>
                      <p className="text-2xl font-bold">{selectedAgency.revenue.toLocaleString()} ₽</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Комиссия платформы (15%)</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedAgency.commission.toLocaleString()} ₽</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="profiles" className="space-y-4 mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Users" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Профилей в агентстве: {selectedAgency.profilesCount}</p>
                  <p className="text-sm">Детальный список профилей будет доступен в следующей версии</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
