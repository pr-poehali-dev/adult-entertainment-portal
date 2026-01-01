import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { BusinessType } from '@/types';

interface VerificationStep1Props {
  businessType: BusinessType;
  companyName?: string;
  cities: string[];
  onCompanyNameChange: (value: string) => void;
  onCityUpdate: (index: number, value: string) => void;
  onCityAdd: () => void;
  onCityRemove: (index: number) => void;
}

export const VerificationStep1 = ({
  businessType,
  companyName,
  cities,
  onCompanyNameChange,
  onCityUpdate,
  onCityAdd,
  onCityRemove,
}: VerificationStep1Props) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Основная информация</h3>
      
      {businessType === 'organization' && (
        <div className="space-y-2">
          <Label htmlFor="companyName">Название организации *</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            placeholder="ООО «Пример»"
          />
        </div>
      )}

      <div className="space-y-3">
        <Label>Города оказания услуг *</Label>
        {cities.map((city, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={city}
              onChange={(e) => onCityUpdate(index, e.target.value)}
              placeholder="Например: Москва"
            />
            {cities.length > 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onCityRemove(index)}
              >
                <Icon name="Trash2" size={16} />
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" onClick={onCityAdd} className="w-full">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить город
        </Button>
      </div>
    </div>
  );
};
