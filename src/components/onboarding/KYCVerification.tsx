import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface KYCVerificationProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export default function KYCVerification({ onComplete, onSkip }: KYCVerificationProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    documentType: '',
    documentNumber: '',
    fullName: '',
    birthDate: '',
    photoFront: null as File | null,
    photoBack: null as File | null,
    selfie: null as File | null,
  });

  const handleFileChange = (field: 'photoFront' | 'photoBack' | 'selfie', file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleNext = () => {
    if (step === 1 && formData.documentType && formData.documentNumber && formData.fullName && formData.birthDate) {
      setStep(2);
    }
  };

  const handleComplete = () => {
    if (formData.photoFront && formData.photoBack && formData.selfie) {
      // В реальном приложении здесь будет отправка данных на сервер
      onComplete();
    }
  };

  const isStep1Valid = formData.documentType && formData.documentNumber && formData.fullName && formData.birthDate;
  const isStep2Valid = formData.photoFront && formData.photoBack && formData.selfie;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                KYC Верификация
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-300'}`} />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Шаг {step} из 2: {step === 1 ? 'Данные документа' : 'Загрузка фото'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Информационный блок */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <div className="flex gap-3">
              <Icon name="Shield" size={24} className="text-blue-600 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Почему нужна верификация?</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Защита от мошенников и фейковых аккаунтов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Повышение доверия со стороны других пользователей</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Доступ ко всем функциям платформы</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Ваши данные надежно защищены и не передаются третьим лицам</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="documentType">Тип документа *</Label>
                <select
                  id="documentType"
                  className="w-full h-11 px-3 rounded-md border border-input bg-background"
                  value={formData.documentType}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                  required
                >
                  <option value="">Выберите тип документа</option>
                  <option value="passport">Паспорт РФ</option>
                  <option value="international">Загранпаспорт</option>
                  <option value="id">Водительское удостоверение</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentNumber">Серия и номер документа *</Label>
                <Input
                  id="documentNumber"
                  placeholder="1234 567890"
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">ФИО (как в документе) *</Label>
                <Input
                  id="fullName"
                  placeholder="Иванов Иван Иванович"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Дата рождения *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label>Фото документа (лицевая сторона) *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('photoFront', e.target.files?.[0] || null)}
                    className="hidden"
                    id="photoFront"
                  />
                  <label htmlFor="photoFront" className="cursor-pointer">
                    {formData.photoFront ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Icon name="CheckCircle" size={24} />
                        <span>{formData.photoFront.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Icon name="Upload" size={32} className="mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">Нажмите для загрузки фото</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Фото документа (обратная сторона) *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('photoBack', e.target.files?.[0] || null)}
                    className="hidden"
                    id="photoBack"
                  />
                  <label htmlFor="photoBack" className="cursor-pointer">
                    {formData.photoBack ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Icon name="CheckCircle" size={24} />
                        <span>{formData.photoBack.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Icon name="Upload" size={32} className="mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">Нажмите для загрузки фото</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Селфи с документом *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('selfie', e.target.files?.[0] || null)}
                    className="hidden"
                    id="selfie"
                  />
                  <label htmlFor="selfie" className="cursor-pointer">
                    {formData.selfie ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Icon name="CheckCircle" size={24} />
                        <span>{formData.selfie.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Icon name="Camera" size={32} className="mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">Сделайте селфи с документом в руках</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 text-sm text-gray-600">
                <div className="flex gap-2">
                  <Icon name="AlertTriangle" size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p>
                    Убедитесь, что фото четкие, все данные хорошо читаются, и лицо на селфи совпадает с фото в документе.
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
            
            {step < 2 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isStep1Valid}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Далее
                <Icon name="ArrowRight" size={18} className="ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleComplete}
                disabled={!isStep2Valid}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Отправить на проверку
                <Icon name="Send" size={18} className="ml-2" />
              </Button>
            )}
          </div>

          {onSkip && step === 1 && (
            <Button
              type="button"
              variant="ghost"
              onClick={onSkip}
              className="w-full text-gray-500"
            >
              Пропустить (верифицировать позже)
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
