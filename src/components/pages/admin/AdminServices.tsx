import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  provider: string;
  price: number;
  currency: string;
  status: 'active' | 'pending' | 'rejected';
  views: number;
  bookings: number;
  rating: number;
  createdAt: string;
  image?: string;
}

const mockServices: Service[] = [
  {
    id: '1',
    title: 'Массаж расслабляющий',
    description: 'Профессиональный расслабляющий массаж всего тела',
    category: 'massage',
    provider: 'Анна К.',
    price: 3500,
    currency: 'RUB',
    status: 'active',
    views: 234,
    bookings: 12,
    rating: 4.8,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Эскорт на мероприятие',
    description: 'Сопровождение на деловые и светские мероприятия',
    category: 'escort',
    provider: 'VIP Agency',
    price: 15000,
    currency: 'RUB',
    status: 'pending',
    views: 89,
    bookings: 3,
    rating: 5.0,
    createdAt: '2024-01-18',
  },
  {
    id: '3',
    title: 'Виртуальное общение',
    description: 'Приватный видеочат, дружеская беседа',
    category: 'virtual',
    provider: 'Мария В.',
    price: 1000,
    currency: 'RUB',
    status: 'active',
    views: 567,
    bookings: 45,
    rating: 4.5,
    createdAt: '2024-01-10',
  },
];

const categoryNames: Record<string, string> = {
  massage: 'Массаж',
  escort: 'Эскорт',
  virtual: 'Виртуальные услуги',
  striptease: 'Стриптиз',
  dating: 'Знакомства',
};

export const AdminServices = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const filteredServices = services.filter(service => {
    const matchSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || service.status === filterStatus;
    const matchCategory = filterCategory === 'all' || service.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const handleApprove = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, status: 'active' as const } : s
    ));
  };

  const handleReject = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, status: 'rejected' as const } : s
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить услугу?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const getStatusBadge = (status: Service['status']) => {
    const variants = {
      active: { variant: 'default' as const, label: 'Активна', color: 'bg-green-500' },
      pending: { variant: 'secondary' as const, label: 'На модерации', color: 'bg-yellow-500' },
      rejected: { variant: 'destructive' as const, label: 'Отклонена', color: 'bg-red-500' },
    };
    return variants[status];
  };

  const stats = {
    total: services.length,
    active: services.filter(s => s.status === 'active').length,
    pending: services.filter(s => s.status === 'pending').length,
    rejected: services.filter(s => s.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего услуг</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Icon name="Layers" size={32} className="text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активные</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Icon name="CheckCircle" size={32} className="text-green-600" />
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
                <p className="text-sm text-muted-foreground">Отклонено</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <Icon name="XCircle" size={32} className="text-red-600" />
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
                  placeholder="Название или провайдер"
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
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="pending">На модерации</SelectItem>
                  <SelectItem value="rejected">Отклонённые</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Категория</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {Object.entries(categoryNames).map(([key, name]) => (
                    <SelectItem key={key} value={key}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список услуг */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Услуги ({filteredServices.length})</CardTitle>
          <Button>
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить услугу
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Image" size={32} className="text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                        </div>
                        <Badge variant={getStatusBadge(service.status).variant}>
                          {getStatusBadge(service.status).label}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Icon name="Tag" size={16} />
                          <span>{categoryNames[service.category]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="User" size={16} />
                          <span>{service.provider}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Ruble" size={16} />
                          <span className="font-semibold">{service.price.toLocaleString()} ₽</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Eye" size={16} />
                          <span>{service.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="ShoppingBag" size={16} />
                          <span>{service.bookings}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={16} className="text-yellow-500" />
                          <span>{service.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {service.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => handleApprove(service.id)}>
                              <Icon name="Check" size={16} className="mr-1" />
                              Одобрить
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(service.id)}>
                              <Icon name="X" size={16} className="mr-1" />
                              Отклонить
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedService(service);
                          setShowEditDialog(true);
                        }}>
                          <Icon name="Edit" size={16} className="mr-1" />
                          Редактировать
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(service.id)}>
                          <Icon name="Trash2" size={16} className="mr-1" />
                          Удалить
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

      {/* Диалог редактирования */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактирование услуги</DialogTitle>
            <DialogDescription>
              Измените информацию об услуге
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input defaultValue={selectedService.title} />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea defaultValue={selectedService.description} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Категория</Label>
                  <Select defaultValue={selectedService.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryNames).map(([key, name]) => (
                        <SelectItem key={key} value={key}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Цена (₽)</Label>
                  <Input type="number" defaultValue={selectedService.price} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Отмена
                </Button>
                <Button onClick={() => setShowEditDialog(false)}>
                  Сохранить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
