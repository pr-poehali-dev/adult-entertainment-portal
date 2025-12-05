import { useState } from 'react';
import { WorkOpportunity } from '@/types';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ApplyModalProps {
  work: WorkOpportunity;
  onClose: () => void;
  onSubmit: (applicationData: ApplicationData) => void;
}

export interface ApplicationData {
  name: string;
  age: number;
  phone: string;
  telegram: string;
  experience: string;
  portfolioLink: string;
  coverLetter: string;
  photos: File[];
}

export const ApplyModal = ({ work, onClose, onSubmit }: ApplyModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ApplicationData>({
    name: '',
    age: 18,
    phone: '',
    telegram: '',
    experience: '',
    portfolioLink: '',
    coverLetter: '',
    photos: []
  });

  const [photoPreview, setPhotoPreview] = useState<string[]>([]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.photos.length > 10) {
      toast({
        title: 'Слишком много фото',
        description: 'Максимум 10 фотографий',
        variant: 'destructive'
      });
      return;
    }

    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.coverLetter) {
      toast({
        title: 'Заполните все поля',
        description: 'Пожалуйста, заполните обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    if (formData.photos.length === 0) {
      toast({
        title: 'Добавьте фото',
        description: 'Нужно добавить хотя бы одну фотографию',
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
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Icon name="Send" size={24} className="text-primary" />
              Откликнуться на вакансию
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{work.title}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-accent/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Icon name="Info" size={18} className="text-primary" />
              Требования к кандидату
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {work.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                Ваше имя <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Анна"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                Возраст <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 18 }))}
                min="18"
                max="65"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                Телефон <span className="text-destructive">*</span>
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Telegram</label>
              <Input
                value={formData.telegram}
                onChange={(e) => setFormData(prev => ({ ...prev, telegram: e.target.value }))}
                placeholder="@username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Опыт работы</label>
            <textarea
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="Расскажите о своем опыте работы в индустрии..."
              className="w-full bg-background border border-border rounded-lg px-4 py-3 min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.experience.length}/500
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ссылка на портфолио</label>
            <Input
              type="url"
              value={formData.portfolioLink}
              onChange={(e) => setFormData(prev => ({ ...prev, portfolioLink: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Сопроводительное письмо <span className="text-destructive">*</span>
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
              placeholder="Почему вы хотите работать с нами? Что вас привлекает в этой вакансии?"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.coverLetter.length}/1000
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Ваши фотографии <span className="text-destructive">*</span>
              <span className="text-xs text-muted-foreground font-normal">(до 10 фото)</span>
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Загрузите свои фотографии. Качественные снимки повышают шансы на отклик.
            </p>
            
            <div className="grid grid-cols-4 gap-3">
              {photoPreview.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={preview} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
              
              {formData.photos.length < 10 && (
                <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <Icon name="Upload" size={24} className="text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground text-center px-2">Добавить</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Icon name="Shield" size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Конфиденциальность</p>
                <p>Ваши данные будут переданы только работодателю этой вакансии и защищены согласно политике конфиденциальности.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              <Icon name="Send" size={18} />
              Отправить отклик
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};