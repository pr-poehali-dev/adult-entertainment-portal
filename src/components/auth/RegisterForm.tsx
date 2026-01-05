import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, Page } from '@/types';

type RegistrationMethod = 'email' | 'phone' | 'telegram';

interface RegisterFormProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
}

export const RegisterForm = ({ setUserRole, setCurrentPage }: RegisterFormProps) => {
  const { toast } = useToast();
  const { register } = useAuth();
  
  const [regUserType, setRegUserType] = useState<'buyer' | 'seller'>('buyer');
  const [regUsername, setRegUsername] = useState('');
  const [regMethod, setRegMethod] = useState<RegistrationMethod>('email');
  const [regContact, setRegContact] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regGender, setRegGender] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regBusinessType, setRegBusinessType] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const getContactLabel = (): string => {
    switch (regMethod) {
      case 'email': return 'Email';
      case 'phone': return 'Номер телефона';
      case 'telegram': return 'Telegram логин';
    }
  };

  const getContactPlaceholder = (): string => {
    switch (regMethod) {
      case 'email': return 'your@email.com';
      case 'phone': return '+7 (999) 123-45-67';
      case 'telegram': return 'username';
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regUsername || !regContact || !regPassword) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }
    
    if (regUserType === 'buyer') {
      if (!regGender || !regAge) {
        toast({
          title: "Ошибка",
          description: "Заполните гендер и возраст",
          variant: "destructive",
        });
        return;
      }
      
      const ageNum = parseInt(regAge);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        toast({
          title: "Ошибка",
          description: "Возраст должен быть от 18 до 100 лет",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (!agreedToTerms) {
      toast({
        title: "Ошибка",
        description: "Необходимо принять пользовательское соглашение",
        variant: "destructive",
      });
      return;
    }
    
    if (regPassword.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен быть минимум 6 символов",
        variant: "destructive",
      });
      return;
    }
    
    setRegLoading(true);
    try {
      await register(
        regContact,
        regPassword,
        regUsername,
        regUserType,
        regUserType === 'seller' ? regBusinessType : undefined
      );
      
      setUserRole(regUserType);
      setCurrentPage('home');
      
      toast({
        title: "Регистрация завершена!",
        description: `Добро пожаловать, ${regUsername}!`,
      });
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Попробуйте позже",
        variant: "destructive",
      });
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="bg-muted/50 p-3 rounded-lg mb-4 border border-border">
        <p className="text-xs text-muted-foreground mb-1">Для тестирования создайте новый аккаунт</p>
        <p className="text-xs text-muted-foreground">Пароль минимум 6 символов</p>
      </div>

      <div className="space-y-2">
        <Label>Тип аккаунта</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={regUserType === 'buyer' ? 'default' : 'outline'}
            onClick={() => setRegUserType('buyer')}
            className="w-full"
          >
            Покупатель
          </Button>
          <Button
            type="button"
            variant={regUserType === 'seller' ? 'default' : 'outline'}
            onClick={() => setRegUserType('seller')}
            className="w-full"
          >
            Продавец
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-nickname">Никнейм</Label>
        <Input
          id="reg-nickname"
          placeholder="Придумайте никнейм"
          value={regUsername}
          onChange={(e) => setRegUsername(e.target.value)}
          disabled={regLoading}
        />
      </div>

      <div className="space-y-2">
        <Label>Способ регистрации</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant={regMethod === 'email' ? 'default' : 'outline'}
            onClick={() => { setRegMethod('email'); setRegContact(''); }}
            className="flex items-center gap-1 text-xs"
          >
            <Icon name="Mail" size={14} />
            Email
          </Button>
          <Button
            type="button"
            variant={regMethod === 'phone' ? 'default' : 'outline'}
            onClick={() => { setRegMethod('phone'); setRegContact(''); }}
            className="flex items-center gap-1 text-xs"
          >
            <Icon name="Phone" size={14} />
            Телефон
          </Button>
          <Button
            type="button"
            variant={regMethod === 'telegram' ? 'default' : 'outline'}
            onClick={() => { setRegMethod('telegram'); setRegContact(''); }}
            className="flex items-center gap-1 text-xs"
          >
            <Icon name="MessageCircle" size={14} />
            TG
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-contact">{getContactLabel()}</Label>
        <Input
          id="reg-contact"
          type={regMethod === 'email' ? 'email' : regMethod === 'phone' ? 'tel' : 'text'}
          placeholder={getContactPlaceholder()}
          value={regContact}
          onChange={(e) => setRegContact(e.target.value)}
          disabled={regLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password">Пароль</Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showRegPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            disabled={regLoading}
          />
          <button
            type="button"
            onClick={() => setShowRegPassword(!showRegPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <Icon name={showRegPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Минимум 6 символов</p>
      </div>

      {regUserType === 'buyer' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="reg-gender">Гендер</Label>
            <Select value={regGender} onValueChange={setRegGender}>
              <SelectTrigger id="reg-gender">
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
            <Label htmlFor="reg-age">Возраст</Label>
            <Input
              id="reg-age"
              type="number"
              placeholder="18"
              min="18"
              max="100"
              value={regAge}
              onChange={(e) => setRegAge(e.target.value)}
              disabled={regLoading}
            />
          </div>
        </>
      )}

      {regUserType === 'seller' && (
        <div className="space-y-2">
          <Label htmlFor="reg-business-type">Категория услуг</Label>
          <Select value={regBusinessType} onValueChange={setRegBusinessType}>
            <SelectTrigger id="reg-business-type">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="premium">Премиум</SelectItem>
              <SelectItem value="business">Бизнес</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-start space-x-2 pt-2">
        <Checkbox 
          id="reg-terms" 
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          className="mt-1"
        />
        <Label htmlFor="reg-terms" className="text-sm leading-relaxed cursor-pointer">
          Я принимаю условия использования и политику конфиденциальности
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        disabled={regLoading}
      >
        {regLoading ? (
          <span className="flex items-center gap-2">
            <Icon name="Loader2" size={20} className="animate-spin" />
            Регистрируем...
          </span>
        ) : (
          'Зарегистрироваться'
        )}
      </Button>
    </form>
  );
};
