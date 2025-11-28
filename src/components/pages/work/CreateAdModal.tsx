import { useState } from 'react';
import { Currency } from '@/types';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CreateAdModalProps {
  onClose: () => void;
  onSubmit: (adData: AdFormData) => void;
}

export interface AdFormData {
  title: string;
  description: string;
  price: number;
  currency: Currency;
  category: string;
  location: string;
  contactInfo: string;
  images: File[];
  isPremium: boolean;
}

const categories = [
  'VIP сопровождение',
  'Эскорт',
  'Массаж',
  'Встречи',
  'Фото/Видео',
  'Другое'
];

export const CreateAdModal = ({ onClose, onSubmit }: CreateAdModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    price: 0,
    currency: 'RUB',
    category: '',
    location: '',
    contactInfo: '',
    images: [],
    isPremium: false
  });

  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 5) {
      toast({
        title: 'Слишком много фото',
        description: 'Максимум 5 изображений',
        variant: 'destructive'
      });
      return;
    }

    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.contactInfo) {
      toast({
        title: 'Заполните все поля',
        description: 'Пожалуйста, заполните обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    if (formData.images.length === 0) {
      toast({
        title: 'Добавьте фото',
        description: 'Нужно добавить хотя бы одно изображение',
        variant: 'destructive'
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Plus" size={24} className="text-primary" />
            Создать объявление
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Заголовок <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Например: Эксклюзивное VIP сопровождение"
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.title.length}/100
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Описание <span className="text-destructive">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Подробное описание вашего предложения..."
              className="w-full bg-background border border-border rounded-lg px-4 py-3 min-h-[150px] resize-y focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.description.length}/1000
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                Категория <span className="text-destructive">*</span>
              </label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Локация</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Москва"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Цена</label>
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                placeholder="10000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Валюта</label>
              <Select value={formData.currency} onValueChange={(value: Currency) => setFormData(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RUB">₽ RUB</SelectItem>
                  <SelectItem value="USD">$ USD</SelectItem>
                  <SelectItem value="EUR">€ EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Контакты <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.contactInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
              placeholder="@telegram или +7 (999) 123-45-67"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Фотографии <span className="text-destructive">*</span>
              <span className="text-xs text-muted-foreground font-normal">(до 5 фото)</span>
            </label>
            
            <div className="grid grid-cols-3 gap-3">
              {imagePreview.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
              ))}
              
              {formData.images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Загрузить</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Crown" size={24} className="text-amber-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Premium размещение</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Ваше объявление будет выделено золотой рамкой и показано выше остальных
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-amber-500">5 000 ₽</div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPremium}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPremium: e.target.checked }))}
                      className="w-5 h-5 rounded border-border"
                    />
                    <span className="text-sm font-medium">Сделать Premium</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              <Icon name="Check" size={18} />
              Опубликовать объявление
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
