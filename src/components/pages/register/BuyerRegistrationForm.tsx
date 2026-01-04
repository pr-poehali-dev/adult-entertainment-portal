import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { RegistrationMethod } from '@/types';
import { RegistrationMethodSelector } from './RegistrationMethodSelector';

interface BuyerRegistrationFormProps {
  username: string;
  setUsername: (value: string) => void;
  registrationMethod: RegistrationMethod;
  setRegistrationMethod: (method: RegistrationMethod) => void;
  contactValue: string;
  setContactValue: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  referralInput: string;
  setReferralInput: (value: string) => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
  isLoading: boolean;
  isBusinessMode: boolean;
  onRegister: () => void;
  onShowTerms: () => void;
  getContactLabel: () => string;
  getContactPlaceholder: () => string;
}

export const BuyerRegistrationForm = ({
  username,
  setUsername,
  registrationMethod,
  setRegistrationMethod,
  contactValue,
  setContactValue,
  password,
  setPassword,
  referralInput,
  setReferralInput,
  agreedToTerms,
  setAgreedToTerms,
  isLoading,
  isBusinessMode,
  onRegister,
  onShowTerms,
  getContactLabel,
  getContactPlaceholder
}: BuyerRegistrationFormProps) => {
  const handleMethodChange = (method: RegistrationMethod) => {
    setRegistrationMethod(method);
    setContactValue('');
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="space-y-2">
        <Label htmlFor="buyer-nickname">Никнейм</Label>
        <Input 
          id="buyer-nickname" 
          placeholder="Придумайте никнейм для профиля" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-background border-border" 
        />
        <p className="text-xs text-muted-foreground">Будет отображаться в профиле и шапке сайта</p>
      </div>
      
      <RegistrationMethodSelector
        registrationMethod={registrationMethod}
        onMethodChange={handleMethodChange}
      />

      <div className="space-y-2">
        <Label htmlFor="buyer-contact">{getContactLabel()}</Label>
        <Input 
          id="buyer-contact" 
          type={registrationMethod === 'email' ? 'email' : registrationMethod === 'phone' ? 'tel' : 'text'}
          placeholder={getContactPlaceholder()}
          value={contactValue}
          onChange={(e) => setContactValue(e.target.value)}
          className="bg-background border-border"
          disabled={isLoading} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="buyer-password">Пароль</Label>
        <Input 
          id="buyer-password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-background border-border"
          disabled={isLoading} 
        />
        <p className="text-xs text-muted-foreground">Минимум 6 символов</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="buyer-gender">Гендер</Label>
        <Select>
          <SelectTrigger id="buyer-gender" className="bg-background border-border">
            <SelectValue placeholder="Выберите гендер" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Мужской</SelectItem>
            <SelectItem value="female">Женский</SelectItem>
            <SelectItem value="other">Другое</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="buyer-age">Возраст</Label>
        <Input id="buyer-age" type="number" placeholder="18" min="18" max="100" className="bg-background border-border" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="buyer-referral">Реферальная ссылка (необязательно)</Label>
        <Input 
          id="buyer-referral" 
          value={referralInput}
          onChange={(e) => setReferralInput(e.target.value)}
          placeholder="Вставьте реферальную ссылку" 
          className="bg-background border-border" 
        />
        <p className="text-xs text-muted-foreground">Если у вас есть приглашение от партнёра, вставьте ссылку сюда</p>
      </div>
      
      <div className="flex items-start space-x-2 pt-2">
        <Checkbox 
          id="buyer-terms" 
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          className="mt-1"
        />
        <Label htmlFor="buyer-terms" className="text-sm leading-relaxed cursor-pointer">
          Я принимаю{' '}
          <button
            type="button"
            onClick={onShowTerms}
            className="text-primary hover:underline font-medium"
          >
            Пользовательское соглашение и политику конфиденциальности
          </button>
        </Label>
      </div>
      <Button 
        className={`w-full text-white mt-6 transition-all duration-300 ${isBusinessMode ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-xl hover:shadow-pink-500/50' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
        onClick={onRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Icon name="Loader2" size={20} className="animate-spin" />
            Регистрируем...
          </span>
        ) : (
          'Зарегистрироваться как мужчина'
        )}
      </Button>
    </div>
  );
};
