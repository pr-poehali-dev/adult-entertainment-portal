import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Profile } from '@/types';

interface ProfileSetupProps {
  onComplete: (profileData: Partial<Profile>) => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    gender: '',
    age: '',
    city: '',
    aboutMe: '',
    orientation: '',
    lookingFor: '',
  });

  const handleNext = () => {
    if (step === 1 && formData.name && formData.nickname && formData.gender && formData.age) {
      setStep(2);
    } else if (step === 2 && formData.city && formData.aboutMe) {
      setStep(3);
    }
  };

  const handleComplete = () => {
    if (formData.orientation && formData.lookingFor) {
      onComplete({
        name: formData.name,
        nickname: formData.nickname,
        gender: formData.gender as 'male' | 'female' | 'other',
        age: parseInt(formData.age),
        preferences: {
          orientation: formData.orientation as any,
          lookingFor: formData.lookingFor,
          aboutMe: formData.aboutMe,
          sexualPreferences: [],
          city: formData.city,
          searchOnline: false,
        },
        profileCompleted: true,
      });
    }
  };

  const isStep1Valid = formData.name && formData.nickname && formData.gender && formData.age;
  const isStep2Valid = formData.city && formData.aboutMe;
  const isStep3Valid = formData.orientation && formData.lookingFor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Заполнение профиля
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-300'}`} />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Шаг {step} из 3: {step === 1 ? 'Основная информация' : step === 2 ? 'О себе' : 'Предпочтения'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="name">Имя *</Label>
                <Input
                  id="name"
                  placeholder="Ваше настоящее имя"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">Никнейм *</Label>
                <Input
                  id="nickname"
                  placeholder="Как вас будут видеть другие"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Пол *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите пол" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Мужской</SelectItem>
                    <SelectItem value="female">Женский</SelectItem>
                    <SelectItem value="other">Другой</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Возраст *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Полных лет"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  min="18"
                  max="100"
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="city">Город *</Label>
                <Input
                  id="city"
                  placeholder="Москва, Санкт-Петербург..."
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutMe">О себе *</Label>
                <Textarea
                  id="aboutMe"
                  placeholder="Расскажите немного о себе, своих интересах и увлечениях..."
                  value={formData.aboutMe}
                  onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                  rows={6}
                  required
                />
                <p className="text-xs text-gray-500">Минимум 50 символов</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="orientation">Ориентация *</Label>
                <Select value={formData.orientation} onValueChange={(value) => setFormData({ ...formData, orientation: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите ориентацию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hetero">Гетеро</SelectItem>
                    <SelectItem value="gay">Гей</SelectItem>
                    <SelectItem value="lesbian">Лесбиянка</SelectItem>
                    <SelectItem value="bi">Би</SelectItem>
                    <SelectItem value="pan">Пансексуал</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lookingFor">Что ищете *</Label>
                <Textarea
                  id="lookingFor"
                  placeholder="Опишите, кого или что вы ищете на платформе..."
                  value={formData.lookingFor}
                  onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-600">
                <div className="flex gap-2">
                  <Icon name="Info" size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p>
                    После заполнения профиля вам нужно будет пройти KYC-верификацию для подтверждения личности.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Назад
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Далее
                <Icon name="ArrowRight" size={18} className="ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleComplete}
                disabled={!isStep3Valid}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Завершить
                <Icon name="Check" size={18} className="ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
