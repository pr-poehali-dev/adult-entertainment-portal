import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { BusinessType } from '@/types';

type DocumentType = 'passport' | 'driver_license' | 'international_passport';

interface BusinessVerificationProps {
  businessType: BusinessType;
  onComplete: (data: BusinessVerificationData) => void;
}

export interface BusinessVerificationData {
  companyName?: string;
  cities: string[];
  responsiblePerson: {
    firstName: string;
    lastName: string;
    middleName: string;
    birthDate: string;
    birthMonth: string;
    birthYear: string;
  };
  document: {
    type: DocumentType;
    series: string;
    number: string;
    photoFront: string | null;
    photoWithDocument: string | null;
  };
}

export const BusinessVerification = ({ businessType, onComplete }: BusinessVerificationProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState<BusinessVerificationData>({
    companyName: '',
    cities: [''],
    responsiblePerson: {
      firstName: '',
      lastName: '',
      middleName: '',
      birthDate: '',
      birthMonth: '',
      birthYear: '',
    },
    document: {
      type: 'passport',
      series: '',
      number: '',
      photoFront: null,
      photoWithDocument: null,
    },
  });

  const [photoFrontPreview, setPhotoFrontPreview] = useState<string | null>(null);
  const [photoWithDocPreview, setPhotoWithDocPreview] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'with_document') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'front') {
          setPhotoFrontPreview(result);
          setFormData({
            ...formData,
            document: { ...formData.document, photoFront: result },
          });
        } else {
          setPhotoWithDocPreview(result);
          setFormData({
            ...formData,
            document: { ...formData.document, photoWithDocument: result },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addCity = () => {
    setFormData({ ...formData, cities: [...formData.cities, ''] });
  };

  const updateCity = (index: number, value: string) => {
    const newCities = [...formData.cities];
    newCities[index] = value;
    setFormData({ ...formData, cities: newCities });
  };

  const removeCity = (index: number) => {
    if (formData.cities.length > 1) {
      const newCities = formData.cities.filter((_, i) => i !== index);
      setFormData({ ...formData, cities: newCities });
    }
  };

  const validateStep1 = () => {
    if (businessType === 'organization' && !formData.companyName?.trim()) {
      toast({
        title: "Ошибка",
        description: "Укажите название организации",
        variant: "destructive",
      });
      return false;
    }
    if (formData.cities.filter(c => c.trim()).length === 0) {
      toast({
        title: "Ошибка",
        description: "Укажите хотя бы один город",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { firstName, lastName, middleName, birthDate, birthMonth, birthYear } = formData.responsiblePerson;
    if (!firstName || !lastName || !middleName) {
      toast({
        title: "Ошибка",
        description: "Заполните ФИО",
        variant: "destructive",
      });
      return false;
    }
    if (!birthDate || !birthMonth || !birthYear) {
      toast({
        title: "Ошибка",
        description: "Укажите дату рождения",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.document.series || !formData.document.number) {
      toast({
        title: "Ошибка",
        description: "Укажите серию и номер документа",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.document.photoFront || !formData.document.photoWithDocument) {
      toast({
        title: "Ошибка",
        description: "Загрузите оба фото",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      onComplete(formData);
      toast({
        title: "Данные отправлены",
        description: "Ваша заявка на верификацию принята и будет проверена в течение 24 часов",
      });
    }
  };

  const documentTypeLabels: Record<DocumentType, string> = {
    passport: 'Паспорт РФ',
    driver_license: 'Водительское удостоверение',
    international_passport: 'Загранпаспорт',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="ShieldCheck" size={28} />
              Верификация бизнес-аккаунта
            </CardTitle>
            <CardDescription className="text-white/80">
              {businessType === 'organization' ? 'Организация' : 'Частное лицо'} • Шаг {step} из 3
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= s ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Основная информация</h3>
                
                {businessType === 'organization' && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Название организации *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="ООО «Пример»"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <Label>Города оказания услуг *</Label>
                  {formData.cities.map((city, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={city}
                        onChange={(e) => updateCity(index, e.target.value)}
                        placeholder="Например: Москва"
                      />
                      {formData.cities.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeCity(index)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addCity} className="w-full">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить город
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Ответственное лицо</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Фамилия *</Label>
                    <Input
                      id="lastName"
                      value={formData.responsiblePerson.lastName}
                      onChange={(e) => setFormData({
                        ...formData,
                        responsiblePerson: { ...formData.responsiblePerson, lastName: e.target.value }
                      })}
                      placeholder="Иванов"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Имя *</Label>
                    <Input
                      id="firstName"
                      value={formData.responsiblePerson.firstName}
                      onChange={(e) => setFormData({
                        ...formData,
                        responsiblePerson: { ...formData.responsiblePerson, firstName: e.target.value }
                      })}
                      placeholder="Иван"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Отчество *</Label>
                    <Input
                      id="middleName"
                      value={formData.responsiblePerson.middleName}
                      onChange={(e) => setFormData({
                        ...formData,
                        responsiblePerson: { ...formData.responsiblePerson, middleName: e.target.value }
                      })}
                      placeholder="Иванович"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Дата рождения *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={formData.responsiblePerson.birthDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        responsiblePerson: { ...formData.responsiblePerson, birthDate: e.target.value }
                      })}
                      placeholder="День"
                    />
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.responsiblePerson.birthMonth}
                      onChange={(e) => setFormData({
                        ...formData,
                        responsiblePerson: { ...formData.responsiblePerson, birthMonth: e.target.value }
                      })}
                      placeholder="Месяц"
                    />
                    <Input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.responsiblePerson.birthYear}
                      onChange={(e) => setFormData({
                        ...formData,
                        responsiblePerson: { ...formData.responsiblePerson, birthYear: e.target.value }
                      })}
                      placeholder="Год"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Документ для верификации</h3>
                
                <div className="space-y-2">
                  <Label>Тип документа *</Label>
                  <Select
                    value={formData.document.type}
                    onValueChange={(value: DocumentType) => setFormData({
                      ...formData,
                      document: { ...formData.document, type: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Паспорт РФ</SelectItem>
                      <SelectItem value="driver_license">Водительское удостоверение</SelectItem>
                      <SelectItem value="international_passport">Загранпаспорт</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="docSeries">Серия *</Label>
                    <Input
                      id="docSeries"
                      value={formData.document.series}
                      onChange={(e) => setFormData({
                        ...formData,
                        document: { ...formData.document, series: e.target.value }
                      })}
                      placeholder="1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="docNumber">Номер *</Label>
                    <Input
                      id="docNumber"
                      value={formData.document.number}
                      onChange={(e) => setFormData({
                        ...formData,
                        document: { ...formData.document, number: e.target.value }
                      })}
                      placeholder="567890"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Фото документа (разворот с фото) *</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                      {photoFrontPreview ? (
                        <div className="space-y-3">
                          <img src={photoFrontPreview} alt="Документ" className="max-h-48 mx-auto rounded-lg" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('photoFront')?.click()}
                          >
                            <Icon name="Upload" size={16} className="mr-2" />
                            Изменить фото
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => document.getElementById('photoFront')?.click()}
                          className="w-full"
                        >
                          <Icon name="Upload" size={48} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Нажмите для загрузки</p>
                        </button>
                      )}
                      <input
                        id="photoFront"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'front')}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Селфи с документом *</Label>
                    <p className="text-xs text-muted-foreground">Держите документ рядом с лицом, чтобы были видны оба</p>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                      {photoWithDocPreview ? (
                        <div className="space-y-3">
                          <img src={photoWithDocPreview} alt="Селфи с документом" className="max-h-48 mx-auto rounded-lg" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('photoWithDoc')?.click()}
                          >
                            <Icon name="Upload" size={16} className="mr-2" />
                            Изменить фото
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => document.getElementById('photoWithDoc')?.click()}
                          className="w-full"
                        >
                          <Icon name="Camera" size={48} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Нажмите для загрузки селфи</p>
                        </button>
                      )}
                      <input
                        id="photoWithDoc"
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={(e) => handleFileUpload(e, 'with_document')}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <p className="font-medium mb-1">Требования к фото:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Все данные должны быть четко видны</li>
                        <li>Фото без бликов и размытия</li>
                        <li>Документ действующий (не просрочен)</li>
                        <li>На селфи видно лицо и документ одновременно</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  <Icon name="ChevronLeft" size={16} className="mr-2" />
                  Назад
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                {step === 3 ? (
                  <>
                    <Icon name="CheckCircle" size={16} className="mr-2" />
                    Отправить на проверку
                  </>
                ) : (
                  <>
                    Продолжить
                    <Icon name="ChevronRight" size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
