import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResponsiblePerson {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  birthMonth: string;
  birthYear: string;
}

interface VerificationStep2Props {
  responsiblePerson: ResponsiblePerson;
  onResponsiblePersonChange: (field: keyof ResponsiblePerson, value: string) => void;
}

export const VerificationStep2 = ({
  responsiblePerson,
  onResponsiblePersonChange,
}: VerificationStep2Props) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Ответственное лицо</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastName">Фамилия *</Label>
          <Input
            id="lastName"
            value={responsiblePerson.lastName}
            onChange={(e) => onResponsiblePersonChange('lastName', e.target.value)}
            placeholder="Иванов"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstName">Имя *</Label>
          <Input
            id="firstName"
            value={responsiblePerson.firstName}
            onChange={(e) => onResponsiblePersonChange('firstName', e.target.value)}
            placeholder="Иван"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middleName">Отчество *</Label>
          <Input
            id="middleName"
            value={responsiblePerson.middleName}
            onChange={(e) => onResponsiblePersonChange('middleName', e.target.value)}
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
            value={responsiblePerson.birthDate}
            onChange={(e) => onResponsiblePersonChange('birthDate', e.target.value)}
            placeholder="День"
          />
          <Input
            type="number"
            min="1"
            max="12"
            value={responsiblePerson.birthMonth}
            onChange={(e) => onResponsiblePersonChange('birthMonth', e.target.value)}
            placeholder="Месяц"
          />
          <Input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={responsiblePerson.birthYear}
            onChange={(e) => onResponsiblePersonChange('birthYear', e.target.value)}
            placeholder="Год"
          />
        </div>
      </div>
    </div>
  );
};
