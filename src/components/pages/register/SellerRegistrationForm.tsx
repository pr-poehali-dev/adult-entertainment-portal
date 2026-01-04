import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { RegistrationMethod } from '@/types';
import { RegistrationMethodSelector } from './RegistrationMethodSelector';

interface SellerRegistrationFormProps {
  username: string;
  setUsername: (value: string) => void;
  registrationMethod: RegistrationMethod;
  setRegistrationMethod: (method: RegistrationMethod) => void;
  contactValue: string;
  setContactValue: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  businessType: string;
  setBusinessType: (value: string) => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
  isLoading: boolean;
  isBusinessMode: boolean;
  onRegister: () => void;
  onShowTerms: () => void;
  getContactLabel: () => string;
  getContactPlaceholder: () => string;
}

export const SellerRegistrationForm = ({
  username,
  setUsername,
  registrationMethod,
  setRegistrationMethod,
  contactValue,
  setContactValue,
  password,
  setPassword,
  businessType,
  setBusinessType,
  agreedToTerms,
  setAgreedToTerms,
  isLoading,
  isBusinessMode,
  onRegister,
  onShowTerms,
  getContactLabel,
  getContactPlaceholder
}: SellerRegistrationFormProps) => {
  const handleMethodChange = (method: RegistrationMethod) => {
    setRegistrationMethod(method);
    setContactValue('');
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="space-y-2">
        <Label htmlFor="seller-nickname">Никнейм</Label>
        <Input 
          id="seller-nickname" 
          placeholder="Придумайте никнейм для профиля"
          disabled={isLoading} 
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
        <Label htmlFor="seller-contact">{getContactLabel()}</Label>
        <Input 
          id="seller-contact" 
          type={registrationMethod === 'email' ? 'email' : registrationMethod === 'phone' ? 'tel' : 'text'}
          placeholder={getContactPlaceholder()}
          value={contactValue}
          onChange={(e) => setContactValue(e.target.value)}
          className="bg-background border-border"
          disabled={isLoading} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="seller-password">Пароль</Label>
        <Input 
          id="seller-password" 
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
        <Label htmlFor="business-type">Категория услуг</Label>
        <Select value={businessType} onValueChange={setBusinessType}>
          <SelectTrigger id="business-type" className="bg-background border-border">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="premium">Премиум</SelectItem>
            <SelectItem value="business">Бизнес</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Определяет ваш уровень на платформе</p>
      </div>
      
      <div className="flex items-start space-x-2 pt-2">
        <Checkbox 
          id="seller-terms" 
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          className="mt-1"
        />
        <Label htmlFor="seller-terms" className="text-sm leading-relaxed cursor-pointer">
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
          'Зарегистрироваться как девушка'
        )}
      </Button>
    </div>
  );
};
