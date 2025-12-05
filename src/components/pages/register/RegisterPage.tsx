import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Page, UserRole, RegistrationMethod } from '@/types';
import { parseReferralCode, validateReferralCode } from '@/utils/referralUtils';
import { useToast } from '@/hooks/use-toast';
import { VerificationCodeModal } from '@/components/auth/VerificationCodeModal';

interface RegisterPageProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
}

export const RegisterPage = ({ setUserRole, setCurrentPage }: RegisterPageProps) => {
  const { toast } = useToast();
  const [referralInput, setReferralInput] = useState('');
  const [registrationMethod, setRegistrationMethod] = useState<RegistrationMethod>('email');
  const [contactValue, setContactValue] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole>(null);
  
  const handleOneClickRegister = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage('home');
    
    toast({
      title: "Регистрация завершена!",
      description: `Вы зарегистрированы как ${role === 'buyer' ? 'мужчина' : 'девушка'}. Заполните профиль для полного доступа.`,
      duration: 5000,
    });
  };
  
  const handleRegister = (role: UserRole) => {
    if (!contactValue) {
      toast({
        title: "Ошибка",
        description: "Заполните контактные данные",
        variant: "destructive",
      });
      return;
    }
    
    setPendingRole(role);
    setShowVerification(true);
    
    toast({
      title: "Код отправлен!",
      description: getVerificationMessage(),
    });
  };
  
  const handleVerificationSuccess = (code: string) => {
    setShowVerification(false);
    
    if (referralInput) {
      const refCode = parseReferralCode(referralInput) || referralInput;
      
      if (validateReferralCode(refCode)) {
        toast({
          title: "Успешная регистрация!",
          description: `Вы присоединились к партнёрской сети`,
        });
      }
    }
    
    setUserRole(pendingRole);
    setCurrentPage('home');
  };
  
  const handleResendCode = () => {
    toast({
      title: "Код отправлен повторно",
      description: getVerificationMessage(),
    });
  };
  
  const getVerificationMessage = (): string => {
    switch (registrationMethod) {
      case 'email':
        return `Код отправлен на ${contactValue}`;
      case 'phone':
        return `SMS с кодом отправлен на ${contactValue}`;
      case 'telegram':
        return `Код отправлен в Telegram @${contactValue}`;
    }
  };
  
  const getContactPlaceholder = (): string => {
    switch (registrationMethod) {
      case 'email': return 'your@email.com';
      case 'phone': return '+7 (999) 123-45-67';
      case 'telegram': return 'username';
    }
  };
  
  const getContactLabel = (): string => {
    switch (registrationMethod) {
      case 'email': return 'Email';
      case 'phone': return 'Номер телефона';
      case 'telegram': return 'Telegram логин';
    }
  };
  
  return (
  <div className="container mx-auto px-4 py-16 max-w-2xl animate-fade-in">
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-4xl text-center text-primary">Регистрация</CardTitle>
        <CardDescription className="text-center text-lg">Выберите тип аккаунта для продолжения</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg border-2 border-primary/20">
          <div className="text-center mb-4">
            <Icon name="Zap" size={32} className="text-primary mx-auto mb-2" />
            <h3 className="text-xl font-bold text-foreground mb-1">Регистрация в 1 клик</h3>
            <p className="text-sm text-muted-foreground">Быстрый старт без заполнения формы. Профиль можно заполнить позже.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-14 border-2 border-primary/40 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
              onClick={() => handleOneClickRegister('buyer')}
            >
              <Icon name="ShoppingBag" size={20} className="mr-2" />
              Мужчина
            </Button>
            <Button
              variant="outline"
              className="h-14 border-2 border-primary/40 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
              onClick={() => handleOneClickRegister('seller')}
            >
              <Icon name="Briefcase" size={20} className="mr-2" />
              Девушка
            </Button>
          </div>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-card px-4 text-muted-foreground font-medium">или полная регистрация</span>
          </div>
        </div>

        <Tabs defaultValue="buyer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buyer">Мужчина</TabsTrigger>
            <TabsTrigger value="seller">Девушка</TabsTrigger>
          </TabsList>
          <TabsContent value="buyer" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="buyer-name">Имя</Label>
              <Input id="buyer-name" placeholder="Введите ваше имя" className="bg-background border-border" />
            </div>
            
            <div className="space-y-2">
              <Label>Способ регистрации</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={registrationMethod === 'email' ? 'default' : 'outline'}
                  onClick={() => { setRegistrationMethod('email'); setContactValue(''); }}
                  className="flex items-center gap-2"
                >
                  <Icon name="Mail" size={16} />
                  Email
                </Button>
                <Button
                  type="button"
                  variant={registrationMethod === 'phone' ? 'default' : 'outline'}
                  onClick={() => { setRegistrationMethod('phone'); setContactValue(''); }}
                  className="flex items-center gap-2"
                >
                  <Icon name="Phone" size={16} />
                  Телефон
                </Button>
                <Button
                  type="button"
                  variant={registrationMethod === 'telegram' ? 'default' : 'outline'}
                  onClick={() => { setRegistrationMethod('telegram'); setContactValue(''); }}
                  className="flex items-center gap-2"
                >
                  <Icon name="MessageCircle" size={16} />
                  Telegram
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyer-contact">{getContactLabel()}</Label>
              <Input 
                id="buyer-contact" 
                type={registrationMethod === 'email' ? 'email' : registrationMethod === 'phone' ? 'tel' : 'text'}
                placeholder={getContactPlaceholder()}
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                className="bg-background border-border" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buyer-password">Пароль</Label>
              <Input id="buyer-password" type="password" placeholder="••••••••" className="bg-background border-border" />
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
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
              onClick={() => handleRegister('buyer')}
            >
              Зарегистрироваться как мужчина
            </Button>
          </TabsContent>
          <TabsContent value="seller" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="seller-name">Имя</Label>
              <Input id="seller-name" placeholder="Введите ваше имя" className="bg-background border-border" />
            </div>
            
            <div className="space-y-2">
              <Label>Способ регистрации</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={registrationMethod === 'email' ? 'default' : 'outline'}
                  onClick={() => { setRegistrationMethod('email'); setContactValue(''); }}
                  className="flex items-center gap-2"
                >
                  <Icon name="Mail" size={16} />
                  Email
                </Button>
                <Button
                  type="button"
                  variant={registrationMethod === 'phone' ? 'default' : 'outline'}
                  onClick={() => { setRegistrationMethod('phone'); setContactValue(''); }}
                  className="flex items-center gap-2"
                >
                  <Icon name="Phone" size={16} />
                  Телефон
                </Button>
                <Button
                  type="button"
                  variant={registrationMethod === 'telegram' ? 'default' : 'outline'}
                  onClick={() => { setRegistrationMethod('telegram'); setContactValue(''); }}
                  className="flex items-center gap-2"
                >
                  <Icon name="MessageCircle" size={16} />
                  Telegram
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller-contact">{getContactLabel()}</Label>
              <Input 
                id="seller-contact" 
                type={registrationMethod === 'email' ? 'email' : registrationMethod === 'phone' ? 'tel' : 'text'}
                placeholder={getContactPlaceholder()}
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                className="bg-background border-border" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seller-password">Пароль</Label>
              <Input id="seller-password" type="password" placeholder="••••••••" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seller-gender">Гендер</Label>
              <Select>
                <SelectTrigger id="seller-gender" className="bg-background border-border">
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
              <Label htmlFor="seller-age">Возраст</Label>
              <Input id="seller-age" type="number" placeholder="18" min="18" max="100" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seller-category">Категория услуг</Label>
              <Select>
                <SelectTrigger id="seller-category" className="bg-background border-border">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="premium">Премиум</SelectItem>
                  <SelectItem value="business">Бизнес</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seller-referral">Реферальная ссылка (необязательно)</Label>
              <Input 
                id="seller-referral" 
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
                placeholder="Вставьте реферальную ссылку" 
                className="bg-background border-border" 
              />
              <p className="text-xs text-muted-foreground">Присоединитесь к партнёрской сети и зарабатывайте на рефералах</p>
            </div>
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
              onClick={() => handleRegister('seller')}
            >
              Зарегистрироваться как девушка
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            Уже есть аккаунт?
          </p>
          <Button
            variant="link"
            className="text-primary hover:text-primary/80 font-semibold"
            onClick={() => setCurrentPage('login')}
          >
            Войти в систему →
          </Button>
        </div>
      </CardContent>
    </Card>
    
    <VerificationCodeModal
      isOpen={showVerification}
      onClose={() => setShowVerification(false)}
      onVerify={handleVerificationSuccess}
      method={registrationMethod}
      contact={contactValue}
      onResend={handleResendCode}
    />
  </div>
  );
};