import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { BusinessType } from '@/types';
import { VerificationStep1 } from './VerificationStep1';
import { VerificationStep2 } from './VerificationStep2';
import { VerificationStep3 } from './VerificationStep3';

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
              <VerificationStep1
                businessType={businessType}
                companyName={formData.companyName}
                cities={formData.cities}
                onCompanyNameChange={(value) => setFormData({ ...formData, companyName: value })}
                onCityUpdate={updateCity}
                onCityAdd={addCity}
                onCityRemove={removeCity}
              />
            )}

            {step === 2 && (
              <VerificationStep2
                responsiblePerson={formData.responsiblePerson}
                onResponsiblePersonChange={(field, value) =>
                  setFormData({
                    ...formData,
                    responsiblePerson: { ...formData.responsiblePerson, [field]: value },
                  })
                }
              />
            )}

            {step === 3 && (
              <VerificationStep3
                document={formData.document}
                photoFrontPreview={photoFrontPreview}
                photoWithDocPreview={photoWithDocPreview}
                onDocumentChange={(field, value) =>
                  setFormData({
                    ...formData,
                    document: { ...formData.document, [field]: value },
                  })
                }
                onFileUpload={handleFileUpload}
              />
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
