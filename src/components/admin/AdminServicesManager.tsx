import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { ServiceCategory } from '@/types';

interface AdminServicesManagerProps {
  categories: ServiceCategory[];
  onAddCategory: (category: Omit<ServiceCategory, 'id'>) => void;
  onEditCategory: (id: string, category: Omit<ServiceCategory, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
}

export const AdminServicesManager = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: AdminServicesManagerProps) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'Briefcase',
  });

  const availableIcons = [
    'Briefcase', 'Hand', 'Sparkles', 'Scissors', 'PaintBucket', 'Dumbbell',
    'Brain', 'GraduationCap', 'Camera', 'Video', 'Home', 'Wrench',
    'Truck', 'ChefHat', 'Languages', 'Scale', 'Calculator', 'Code',
    'TrendingUp', 'PartyPopper', 'Heart', 'Star', 'Zap', 'Coffee',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название категории',
        variant: 'destructive',
      });
      return;
    }

    if (editingCategory) {
      onEditCategory(editingCategory.id, formData);
      toast({
        title: 'Категория обновлена',
        description: 'Изменения успешно сохранены',
      });
    } else {
      onAddCategory(formData);
      toast({
        title: 'Категория создана',
        description: 'Новая категория услуг добавлена',
      });
    }

    setFormData({ name: '', icon: 'Briefcase' });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category: ServiceCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту категорию? Все связанные объявления также будут удалены.')) {
      onDeleteCategory(id);
      toast({
        title: 'Категория удалена',
        description: 'Категория и все связанные объявления удалены',
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', icon: 'Briefcase' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Settings" size={24} />
            Управление категориями услуг
          </CardTitle>
          <CardDescription>
            Категории услуг доступны бизнес-пользователям для создания объявлений
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить категорию
              </Button>
            )}

            {showForm && (
              <Card className="border-2 border-pink-200 dark:border-pink-800">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Название категории *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Например: Массаж"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="icon">Иконка *</Label>
                      <Select
                        value={formData.icon}
                        onValueChange={(value) => setFormData({ ...formData, icon: value })}
                      >
                        <SelectTrigger id="icon">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIcons.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              <div className="flex items-center gap-2">
                                <Icon name={icon as any} size={16} />
                                {icon}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        <Icon name="Save" size={16} className="mr-2" />
                        {editingCategory ? 'Сохранить' : 'Создать'}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                        Отмена
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Package" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Пока нет категорий услуг</p>
                </div>
              ) : (
                categories.map((category) => (
                  <Card key={category.id} className="border-l-4 border-l-pink-500">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-pink-100 dark:bg-pink-950 rounded-lg flex items-center justify-center">
                            <Icon name={category.icon as any} size={20} className="text-pink-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">ID: {category.id}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(category)}
                          >
                            <Icon name="Edit" size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Icon name="Trash2" size={18} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
