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
        <Tabs defaultValue="buyer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buyer">Покупатель</TabsTrigger>
            <TabsTrigger value="seller">Продавец</TabsTrigger>
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
              Зарегистрироваться как покупатель
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
              Зарегистрироваться как продавец
            </Button>
          </TabsContent>
        </Tabs>
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
