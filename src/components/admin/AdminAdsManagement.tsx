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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Ad {
  id: number;
  title: string;
  category: string;
  price: number;
  seller: string;
  status: 'active' | 'moderation' | 'blocked';
  createdAt: string;
}

interface AdminAdsManagementProps {
  ads: Ad[];
  onCreateAd: (ad: Omit<Ad, 'id'>) => void;
  onDeleteAd: (adId: number) => void;
}

export const AdminAdsManagement = ({ ads, onCreateAd, onDeleteAd }: AdminAdsManagementProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { toast } = useToast();

  const [newAd, setNewAd] = useState({
    title: '',
    category: '',
    price: '',
    seller: '',
    status: 'active' as const,
  });

  const categories = [
    { value: 'massage', label: 'Массаж' },
    { value: 'escort', label: 'Эскорт услуги' },
    { value: 'dating', label: 'Знакомства' },
    { value: 'entertainment', label: 'Развлечения' },
    { value: 'beauty', label: 'Красота и уход' },
    { value: 'fitness', label: 'Фитнес' },
    { value: 'education', label: 'Обучение' },
    { value: 'other', label: 'Другое' },
  ];

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || ad.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateAd = () => {
    if (!newAd.title || !newAd.category || !newAd.price || !newAd.seller) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    onCreateAd({
      title: newAd.title,
      category: newAd.category,
      price: parseFloat(newAd.price),
      seller: newAd.seller,
      status: newAd.status,
      createdAt: new Date().toISOString(),
    });

    setNewAd({ title: '', category: '', price: '', seller: '', status: 'active' });
    setShowCreateDialog(false);
    
    toast({
      title: 'Объявление создано',
      description: `"${newAd.title}" успешно добавлено`,
    });
  };

  const handleDeleteAd = (ad: Ad) => {
    if (confirm(`Удалить объявление "${ad.title}"?`)) {
      onDeleteAd(ad.id);
      toast({
        title: 'Объявление удалено',
        description: `"${ad.title}" было удалено`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Активно</Badge>;
      case 'moderation':
        return <Badge className="bg-yellow-500">Модерация</Badge>;
      case 'blocked':
        return <Badge variant="destructive">Заблокировано</Badge>;
      default:
        return null;
    }
  };

  const getCategoryLabel = (categoryValue: string) => {
    return categories.find(c => c.value === categoryValue)?.label || categoryValue;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Управление объявлениями</h3>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Icon name="Plus" size={16} className="mr-2" />
          Создать объявление
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или девушке..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredAds.map((ad) => (
          <Card key={ad.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                    {ad.title}
                    {getStatusBadge(ad.status)}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Tag" size={14} />
                      {getCategoryLabel(ad.category)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={14} />
                      {ad.seller}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Banknote" size={14} />
                      {ad.price.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAd(ad)}
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Удалить
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {filteredAds.length === 0 && (
        <div className="text-center py-12">
          <Icon name="PackageOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Объявления не найдены</p>
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создать новое объявление</DialogTitle>
            <DialogDescription>
              Заполните информацию для создания объявления от имени администратора
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название объявления *</Label>
              <Input
                id="title"
                placeholder="Элитный массаж с выездом"
                value={newAd.title}
                onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория *</Label>
              <Select value={newAd.category} onValueChange={(val) => setNewAd({ ...newAd, category: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Цена (₽) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="5000"
                value={newAd.price}
                onChange={(e) => setNewAd({ ...newAd, price: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller">Девушка *</Label>
              <Input
                id="seller"
                placeholder="Имя девушки"
                value={newAd.seller}
                onChange={(e) => setNewAd({ ...newAd, seller: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select value={newAd.status} onValueChange={(val: 'active' | 'moderation' | 'blocked') => setNewAd({ ...newAd, status: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активно</SelectItem>
                  <SelectItem value="moderation">На модерации</SelectItem>
                  <SelectItem value="blocked">Заблокировано</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateAd}>
              Создать объявление
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};