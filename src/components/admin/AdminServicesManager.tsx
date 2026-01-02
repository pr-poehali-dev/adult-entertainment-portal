import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { ServiceCategory, ServiceTemplate, ServiceFormField, FormFieldType } from '@/types';
import { serviceTemplates } from '@/data/serviceTemplates';

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
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate | null>(null);

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

  const getFieldTypeLabel = (type: FormFieldType): string => {
    const labels: Record<FormFieldType, string> = {
      text: 'Текст',
      textarea: 'Многострочный текст',
      number: 'Число',
      select: 'Выбор из списка',
      multiselect: 'Множественный выбор',
      date: 'Дата',
      time: 'Время',
      datetime: 'Дата и время',
      price: 'Цена',
      duration: 'Длительность',
      phone: 'Телефон',
      address: 'Адрес',
      images: 'Изображения',
      checkbox: 'Чекбокс',
      radio: 'Радио-кнопки',
      programs: 'Программы услуг',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">
            <Icon name="FolderOpen" size={16} className="mr-2" />
            Категории услуг
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Icon name="FileText" size={16} className="mr-2" />
            Шаблоны форм
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-6">
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
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="FileText" size={24} />
                Шаблоны форм для услуг
              </CardTitle>
              <CardDescription>
                Готовые шаблоны с полями для разных типов услуг. Они автоматически применяются при создании объявлений бизнес-пользователями.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceTemplates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="FileX" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Нет доступных шаблонов</p>
                  </div>
                ) : (
                  serviceTemplates.map((template) => {
                    const category = categories.find(c => c.id === template.categoryId);
                    return (
                      <Card 
                        key={template.id} 
                        className={`cursor-pointer transition-all ${
                          selectedTemplate?.id === template.id 
                            ? 'border-2 border-pink-500 shadow-lg' 
                            : 'hover:border-pink-300'
                        }`}
                        onClick={() => setSelectedTemplate(
                          selectedTemplate?.id === template.id ? null : template
                        )}
                      >
                        <CardContent className="py-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 rounded-lg flex items-center justify-center">
                                  <Icon name={category?.icon as any || 'FileText'} size={20} className="text-purple-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{category?.name || 'Категория не найдена'}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {template.fields.length} {template.fields.length === 1 ? 'поле' : 'полей'}
                                  </p>
                                </div>
                              </div>
                              <Icon 
                                name={selectedTemplate?.id === template.id ? 'ChevronUp' : 'ChevronDown'} 
                                size={20} 
                                className="text-muted-foreground"
                              />
                            </div>

                            {selectedTemplate?.id === template.id && (
                              <div className="pt-3 border-t space-y-3">
                                <h4 className="font-medium text-sm text-muted-foreground">Поля формы:</h4>
                                <div className="space-y-2">
                                  {template.fields.map((field, index) => (
                                    <div 
                                      key={field.id} 
                                      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                                    >
                                      <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center text-xs font-medium">
                                        {index + 1}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <p className="font-medium text-sm">{field.label}</p>
                                          {field.required && (
                                            <span className="text-xs text-red-500">*</span>
                                          )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                          <span className="px-2 py-0.5 bg-background rounded">
                                            {getFieldTypeLabel(field.type)}
                                          </span>
                                          {field.placeholder && (
                                            <span className="italic">"{field.placeholder}"</span>
                                          )}
                                          {field.options && (
                                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 rounded text-blue-700 dark:text-blue-300">
                                              {field.options.length} вариантов
                                            </span>
                                          )}
                                        </div>
                                        {field.helpText && (
                                          <p className="text-xs text-muted-foreground mt-1 italic">
                                            💡 {field.helpText}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="pt-2 text-xs text-muted-foreground">
                                  <p>Создан: {new Date(template.createdAt).toLocaleDateString('ru-RU')}</p>
                                  <p>Обновлён: {new Date(template.updatedAt).toLocaleDateString('ru-RU')}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
