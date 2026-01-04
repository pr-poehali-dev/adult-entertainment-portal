import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { RegistrationMethod } from '@/types';

interface RegistrationMethodSelectorProps {
  registrationMethod: RegistrationMethod;
  onMethodChange: (method: RegistrationMethod) => void;
}

export const RegistrationMethodSelector = ({ 
  registrationMethod, 
  onMethodChange 
}: RegistrationMethodSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Способ регистрации</Label>
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant={registrationMethod === 'email' ? 'default' : 'outline'}
          onClick={() => onMethodChange('email')}
          className="flex items-center gap-2"
        >
          <Icon name="Mail" size={16} />
          Email
        </Button>
        <Button
          type="button"
          variant={registrationMethod === 'phone' ? 'default' : 'outline'}
          onClick={() => onMethodChange('phone')}
          className="flex items-center gap-2"
        >
          <Icon name="Phone" size={16} />
          Телефон
        </Button>
        <Button
          type="button"
          variant={registrationMethod === 'telegram' ? 'default' : 'outline'}
          onClick={() => onMethodChange('telegram')}
          className="flex items-center gap-2"
        >
          <Icon name="MessageCircle" size={16} />
          Telegram
        </Button>
      </div>
    </div>
  );
};
