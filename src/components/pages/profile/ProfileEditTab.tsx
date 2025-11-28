import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Profile, Orientation, SexualPreference, ProfilePreferences } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ProfileEditTabProps {
  profile: Profile;
  onProfileUpdate?: (updatedProfile: Partial<Profile>) => void;
}

const orientationOptions: { value: Orientation; label: string }[] = [
  { value: 'hetero', label: 'Гетеросексуал' },
  { value: 'gay', label: 'Гей' },
  { value: 'lesbian', label: 'Лесбиянка' },
  { value: 'bi', label: 'Бисексуал' },
  { value: 'pan', label: 'Пансексуал' },
  { value: 'other', label: 'Другое' },
];

const sexualPreferenceOptions: { value: SexualPreference; label: string; icon: string }[] = [
  { value: 'classic', label: 'Классика', icon: 'Heart' },
  { value: 'oral', label: 'Оральный', icon: 'Smile' },
  { value: 'anal', label: 'Анальный', icon: 'Circle' },
  { value: 'group', label: 'Групповой', icon: 'Users' },
  { value: 'toys', label: 'Игрушки', icon: 'Zap' },
  { value: 'bdsm', label: 'БДСМ', icon: 'Lock' },
  { value: 'dirty', label: 'Грязь', icon: 'Droplet' },
  { value: 'cuckold', label: 'Куколд', icon: 'Eye' },
  { value: 'extreme', label: 'Экстрим', icon: 'AlertTriangle' },
  { value: 'other', label: 'Другое', icon: 'MoreHorizontal' },
];

export const ProfileEditTab = ({ profile, onProfileUpdate }: ProfileEditTabProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const defaultPreferences: ProfilePreferences = {
    orientation: 'hetero',
    lookingFor: '',
    aboutMe: '',
    sexualPreferences: [],
    city: '',
    searchOnline: false,
  };

  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age || 18,
    gender: profile.gender || 'female',
    preferences: profile.preferences || defaultPreferences,
  });

  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(profile.profilePhotos || []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedPhotos([...selectedPhotos, ...Array.from(files)]);
      
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedPhotos(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSexualPreference = (pref: SexualPreference) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        sexualPreferences: formData.preferences.sexualPreferences.includes(pref)
          ? formData.preferences.sexualPreferences.filter(p => p !== pref)
          : [...formData.preferences.sexualPreferences, pref]
      }
    });
  };

  const handleSave = () => {
    onProfileUpdate?.({
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      preferences: formData.preferences,
      profilePhotos: uploadedPhotos,
    });

    toast({
      title: 'Профиль обновлен',
      description: 'Ваши изменения успешно сохранены',
    });

    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Основная информация</h3>
            <Button
              variant={isEditing ? 'default' : 'outline'}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              <Icon name={isEditing ? 'Save' : 'Edit'} size={16} className="mr-2" />
              {isEditing ? 'Сохранить' : 'Редактировать'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Возраст</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Пол</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: any) => setFormData({ ...formData, gender: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Мужской</SelectItem>
                  <SelectItem value="female">Женский</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orientation">Ориентация</Label>
              <Select
                value={formData.preferences.orientation}
                onValueChange={(value: Orientation) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, orientation: value }
                })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orientationOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="city">Город</Label>
              <Input
                id="city"
                value={formData.preferences.city}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, city: e.target.value }
                })}
                placeholder="Москва"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="aboutMe">О себе</Label>
              <Textarea
                id="aboutMe"
                value={formData.preferences.aboutMe}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, aboutMe: e.target.value }
                })}
                placeholder="Расскажите о себе..."
                rows={4}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="lookingFor">Что нравится в партнере</Label>
              <Textarea
                id="lookingFor"
                value={formData.preferences.lookingFor}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, lookingFor: e.target.value }
                })}
                placeholder="Опишите, что вы ищете в партнере..."
                rows={4}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label>Сексуальные предпочтения</Label>
                <span className="text-sm text-muted-foreground">
                  Выбрано: {formData.preferences.sexualPreferences.length}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {sexualPreferenceOptions.map(pref => {
                  const isSelected = formData.preferences.sexualPreferences.includes(pref.value);
                  return (
                    <button
                      key={pref.value}
                      type="button"
                      onClick={() => isEditing && toggleSexualPreference(pref.value)}
                      disabled={!isEditing}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      } ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <Icon name={pref.icon as any} size={24} className="mx-auto mb-2" />
                      <span className="text-sm font-medium">{pref.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="searchOnline"
                  checked={formData.preferences.searchOnline}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, searchOnline: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="w-4 h-4"
                />
                <Label htmlFor="searchOnline" className="cursor-pointer">
                  Поиск онлайн собеседников
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Разрешить другим пользователям находить вас в онлайн поиске
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold mb-6">Фотографии профиля</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {uploadedPhotos.map((photo, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                {isEditing && (
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>
            ))}

            {isEditing && (
              <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <Icon name="Plus" size={32} className="text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Добавить фото</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {isEditing && (
            <p className="text-sm text-muted-foreground">
              Загрузите до 20 фотографий. Рекомендуемый размер: минимум 800x800px
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
