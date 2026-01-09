import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  servicesCount: number;
  isActive: boolean;
  order: number;
  color: string;
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Массаж',
    slug: 'massage',
    description: 'Профессиональные массажные услуги',
    icon: 'Sparkles',
    servicesCount: 45,
    isActive: true,
    order: 1,
    color: '#10b981',
  },
  {
    id: '2',
    name: 'Эскорт',
    slug: 'escort',
    description: 'Сопровождение на мероприятия',
    icon: 'Users',
    servicesCount: 28,
    isActive: true,
    order: 2,
    color: '#8b5cf6',
  },
  {
    id: '3',
    name: 'Виртуальные услуги',
    slug: 'virtual',
    description: 'Онлайн общение и видеочат',
    icon: 'Video',
    servicesCount: 67,
    isActive: true,
    order: 3,
    color: '#3b82f6',
  },
  {
    id: '4',
    name: 'Стриптиз',
    slug: 'striptease',
    description: 'Приватные шоу и выступления',
    icon: 'Music',
    servicesCount: 12,
    isActive: true,
    order: 4,
    color: '#f59e0b',
  },
  {
    id: '5',
    name: 'Знакомства',
    slug: 'dating',
    description: 'Романтические встречи',
    icon: 'Heart',
    servicesCount: 89,
    isActive: false,
    order: 5,
    color: '#ec4899',
  },
];

export const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleActive = (id: string) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const handleDelete = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category && category.servicesCount > 0) {
      alert(`Невозможно удалить категорию "${category.name}". В ней ${category.servicesCount} услуг.`);
      return;
    }
    if (confirm('Удалить категорию?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleMoveUp = (id: string) => {
    const index = categories.findIndex(c => c.id === id);
    if (index > 0) {
      const newCategories = [...categories];
      [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];
      setCategories(newCategories.map((cat, i) => ({ ...cat, order: i + 1 })));
    }
  };

  const handleMoveDown = (id: string) => {
    const index = categories.findIndex(c => c.id === id);
    if (index < categories.length - 1) {
      const newCategories = [...categories];
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
      setCategories(newCategories.map((cat, i) => ({ ...cat, order: i + 1 })));
    }
  };

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length,
    totalServices: categories.reduce((sum, cat) => sum + cat.servicesCount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего категорий</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Icon name="FolderTree" size={32} className="text-primary" />
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
                <p className="text-sm text-muted-foreground">Неактивные</p>
                <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <Icon name="Circle" size={32} className="text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего услуг</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalServices}</p>
              </div>
              <Icon name="Layers" size={32} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Поиск и создание */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск категорий..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Icon name="Plus" size={18} className="mr-2" />
              Создать категорию
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Список категорий */}
      <Card>
        <CardHeader>
          <CardTitle>Категории ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCategories.map((category, index) => (
              <Card key={category.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Иконка */}
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <Icon 
                        name={category.icon as any} 
                        size={32} 
                        style={{ color: category.color }}
                      />
                    </div>
                    
                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <Badge variant={category.isActive ? 'default' : 'secondary'}>
                          {category.isActive ? 'Активна' : 'Неактивна'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          /{category.slug}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Icon name="Layers" size={16} />
                          <span>{category.servicesCount} услуг</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Hash" size={16} />
                          <span>Позиция: {category.order}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Управление */}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMoveUp(category.id)}
                          disabled={index === 0}
                        >
                          <Icon name="ChevronUp" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMoveDown(category.id)}
                          disabled={index === filteredCategories.length - 1}
                        >
                          <Icon name="ChevronDown" size={16} />
                        </Button>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(category.id)}
                        >
                          <Icon name={category.isActive ? "EyeOff" : "Eye"} size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowEditDialog(true);
                          }}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Icon name="Trash2" size={16} />
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

      {/* Диалог создания */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создание категории</DialogTitle>
            <DialogDescription>
              Добавьте новую категорию услуг
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input placeholder="Например: Массаж" />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input placeholder="massage" />
            </div>
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea placeholder="Краткое описание категории" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Иконка</Label>
                <Input placeholder="Heart" />
              </div>
              <div className="space-y-2">
                <Label>Цвет</Label>
                <Input type="color" defaultValue="#3b82f6" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Отмена
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>
                Создать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактирование категории</DialogTitle>
            <DialogDescription>
              Измените информацию о категории
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input defaultValue={selectedCategory.name} />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input defaultValue={selectedCategory.slug} />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea defaultValue={selectedCategory.description} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Иконка</Label>
                  <Input defaultValue={selectedCategory.icon} />
                </div>
                <div className="space-y-2">
                  <Label>Цвет</Label>
                  <Input type="color" defaultValue={selectedCategory.color} />
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
