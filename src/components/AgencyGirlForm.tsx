import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { CatalogItem, AgencyType } from '@/types';

interface AgencyGirlFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (girlData: Partial<CatalogItem>) => void;
  editingGirl?: CatalogItem | null;
  agencyId: number;
  agencyName: string;
  agencyType?: AgencyType;
}

const AgencyGirlForm = ({
  isOpen,
  onClose,
  onSubmit,
  editingGirl,
  agencyId,
  agencyName,
  agencyType,
}: AgencyGirlFormProps) => {
  const getDefaultCategory = () => {
    switch (agencyType) {
      case 'escort': return 'Эскорт';
      case 'massage': return 'Массаж';
      case 'striptease': return 'Стриптиз';
      case 'virtual': return 'Виртуальные услуги';
      case 'realestate': return 'Недвижимость';
      default: return 'Эскорт';
    }
  };

  const getFieldsConfig = () => {
    switch (agencyType) {
      case 'escort':
        return {
          nameLabel: 'Имя',
          namePlaceholder: 'Например: Анна',
          showAge: true,
          showHeight: true,
          showBodyType: true,
          priceLabel: 'Цена за час',
          priceSuffix: '₽/час',
          showLocation: true,
          locationLabel: 'Город',
        };
      case 'massage':
        return {
          nameLabel: 'Имя мастера',
          namePlaceholder: 'Например: Мария',
          showAge: true,
          showHeight: false,
          showBodyType: false,
          priceLabel: 'Стоимость сеанса',
          priceSuffix: '₽/сеанс',
          showLocation: true,
          locationLabel: 'Адрес салона',
          customFields: [{ name: 'specialization', label: 'Специализация', options: ['Классический', 'Тайский', 'Спортивный', 'Эротический', 'Лечебный'] }],
        };
      case 'striptease':
        return {
          nameLabel: 'Имя танцора',
          namePlaceholder: 'Например: Виктория',
          showAge: true,
          showHeight: true,
          showBodyType: true,
          priceLabel: 'Стоимость выступления',
          priceSuffix: '₽/выступление',
          showLocation: true,
          locationLabel: 'Город',
          customFields: [{ name: 'danceStyle', label: 'Стиль танца', options: ['Pole dance', 'Классический', 'Эротический', 'Go-go', 'Акробатика'] }],
        };
      case 'virtual':
        return {
          nameLabel: 'Имя модели',
          namePlaceholder: 'Например: София',
          showAge: true,
          showHeight: false,
          showBodyType: false,
          priceLabel: 'Стоимость в минуту',
          priceSuffix: '₽/мин',
          showLocation: false,
          customFields: [
            { name: 'services', label: 'Услуги', options: ['Видео-звонок', 'Аудио-звонок', 'Переписка', 'Контент на заказ'] },
            { name: 'platforms', label: 'Платформы', options: ['Telegram', 'WhatsApp', 'Skype', 'Zoom', 'Сайт'] }
          ],
        };
      case 'realestate':
        return {
          nameLabel: 'Название объекта',
          namePlaceholder: 'Например: 2-к квартира в центре',
          showAge: false,
          showHeight: false,
          showBodyType: false,
          priceLabel: 'Стоимость за сутки',
          priceSuffix: '₽/сутки',
          showLocation: true,
          locationLabel: 'Адрес',
          customFields: [
            { name: 'rooms', label: 'Количество комнат', options: ['1', '2', '3', '4', '5+'] },
            { name: 'amenities', label: 'Удобства', options: ['Джакузи', 'Сауна', 'Бассейн', 'Кондиционер', 'Паркинг'] }
          ],
        };
      default:
        return {
          nameLabel: 'Имя',
          namePlaceholder: 'Например: Анна',
          showAge: true,
          showHeight: true,
          showBodyType: true,
          priceLabel: 'Цена за час',
          priceSuffix: '₽/час',
          showLocation: true,
          locationLabel: 'Город',
        };
    }
  };

  const fieldsConfig = getFieldsConfig();
  const [formData, setFormData] = useState<Partial<CatalogItem>>({
    title: '',
    seller: '',
    rating: 5.0,
    price: '',
    category: getDefaultCategory(),
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    verified: true,
    description: '',
    location: 'Москва',
    age: 25,
    height: 170,
    bodyType: 'Стройное',
    isActive: true,
    agencyId,
    agencyName,
  });

  const [customFieldsData, setCustomFieldsData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingGirl) {
      setFormData(editingGirl);
    } else {
      setFormData({
        title: '',
        seller: '',
        rating: 5.0,
        price: '',
        category: getDefaultCategory(),
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        verified: true,
        description: '',
        location: 'Москва',
        age: 25,
        height: 170,
        bodyType: 'Стройное',
        isActive: true,
        agencyId,
        agencyName,
      });
    }
  }, [editingGirl, agencyId, agencyName, agencyType]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Введите имя';
    }

    if (!formData.seller?.trim()) {
      newErrors.seller = 'Введите псевдоним';
    }

    if (!formData.price?.trim()) {
      newErrors.price = 'Укажите цену';
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Укажите город';
    }

    if (!formData.age || formData.age < 18 || formData.age > 60) {
      newErrors.age = 'Возраст должен быть от 18 до 60';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const updateField = (field: keyof CatalogItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="UserPlus" size={24} />
            {editingGirl ? 'Редактировать анкету' : 'Добавить новую анкету'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                {fieldsConfig.nameLabel} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder={fieldsConfig.namePlaceholder}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller">
                Псевдоним <span className="text-destructive">*</span>
              </Label>
              <Input
                id="seller"
                value={formData.seller}
                onChange={(e) => updateField('seller', e.target.value)}
                placeholder="Например: Анна Элегант"
                className={errors.seller ? 'border-destructive' : ''}
              />
              {errors.seller && (
                <p className="text-sm text-destructive">{errors.seller}</p>
              )}
            </div>
          </div>

          {(fieldsConfig.showAge || fieldsConfig.showHeight || fieldsConfig.showBodyType) && (
          <div className="grid grid-cols-3 gap-4">
            {fieldsConfig.showAge && (
              <div className="space-y-2">
                <Label htmlFor="age">
                  Возраст <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField('age', parseInt(e.target.value))}
                  min={18}
                  max={60}
                  className={errors.age ? 'border-destructive' : ''}
                />
                {errors.age && (
                  <p className="text-sm text-destructive">{errors.age}</p>
                )}
              </div>
            )}

            {fieldsConfig.showHeight && (
              <div className="space-y-2">
                <Label htmlFor="height">Рост (см)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateField('height', parseInt(e.target.value))}
                  min={150}
                  max={200}
                />
              </div>
            )}

            {fieldsConfig.showBodyType && (
              <div className="space-y-2">
                <Label htmlFor="bodyType">Тип фигуры</Label>
                <Select
                  value={formData.bodyType}
                  onValueChange={(value) => updateField('bodyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Стройное">Стройное</SelectItem>
                    <SelectItem value="Спортивное">Спортивное</SelectItem>
                    <SelectItem value="Среднее">Среднее</SelectItem>
                    <SelectItem value="Полное">Полное</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {fieldsConfig.showLocation && (
              <div className="space-y-2">
                <Label htmlFor="location">
                  {fieldsConfig.locationLabel} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Например: Москва"
                  className={errors.location ? 'border-destructive' : ''}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => updateField('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Эскорт">Эскорт</SelectItem>
                  <SelectItem value="Массаж">Массаж</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Модели">Модели</SelectItem>
                  <SelectItem value="Танцовщицы">Танцовщицы</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {fieldsConfig.customFields?.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Select
                value={customFieldsData[field.name] || field.options[0]}
                onValueChange={(value) => setCustomFieldsData(prev => ({ ...prev, [field.name]: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="price">
              {fieldsConfig.priceLabel} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="price"
                value={formData.price?.replace(/\D/g, '')}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  updateField('price', `${value} ${fieldsConfig.priceSuffix}`);
                }}
                placeholder="Например: 25000"
                className={errors.price ? 'border-destructive' : ''}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {fieldsConfig.priceSuffix}
              </span>
            </div>
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Расскажите о девушке..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL фотографии</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => updateField('image', e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              <Icon name="Check" size={18} />
              <span className="ml-2">
                {editingGirl ? 'Сохранить' : 'Создать анкету'}
              </span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AgencyGirlForm;