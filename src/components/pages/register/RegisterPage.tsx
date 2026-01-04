import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Page, UserRole, RegistrationMethod } from '@/types';
import { parseReferralCode, validateReferralCode } from '@/utils/referralUtils';
import { useToast } from '@/hooks/use-toast';
import { VerificationCodeModal } from '@/components/auth/VerificationCodeModal';
import { TermsModal } from '@/components/auth/TermsModal';
import { useAuth } from '@/contexts/AuthContext';
import { QuickRegistrationSection } from './QuickRegistrationSection';
import { BuyerRegistrationForm } from './BuyerRegistrationForm';
import { SellerRegistrationForm } from './SellerRegistrationForm';

interface RegisterPageProps {
  setUserRole: (role: UserRole) => void;
  setCurrentPage: (page: Page) => void;
}

export const RegisterPage = ({ setUserRole, setCurrentPage }: RegisterPageProps) => {
  const { toast } = useToast();
  const { register } = useAuth();
  const [referralInput, setReferralInput] = useState('');
  const [registrationMethod, setRegistrationMethod] = useState<RegistrationMethod>('email');
  const [contactValue, setContactValue] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole>(null);
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const handleOneClickRegister = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage('home');
    
    toast({
      title: "Регистрация завершена!",
      description: `Вы зарегистрированы как ${role === 'buyer' ? 'мужчина' : 'девушка'}. Заполните профиль для полного доступа.`,
      duration: 5000,
    });
  };
  
  const handleRegister = async (role: UserRole) => {
    if (!contactValue || !username || !password) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }
    
    if (!agreedToTerms) {
      toast({
        title: "Ошибка",
        description: "Необходимо принять пользовательское соглашение",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен быть минимум 6 символов",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(
        contactValue,
        password,
        username,
        role,
        role === 'seller' ? businessType : undefined
      );
      
      setUserRole(role);
      setCurrentPage('home');
      
      toast({
        title: "Регистрация завершена!",
        description: `Добро пожаловать, ${username}!`,
      });
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Попробуйте позже",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
  <div className={`container mx-auto px-4 py-16 max-w-2xl animate-fade-in transition-all duration-500 ${isBusinessMode ? 'bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 dark:from-pink-950/10 dark:via-purple-950/10 dark:to-pink-950/10 min-h-screen -mx-4 px-8' : ''}`}>
    <Card className={`transition-all duration-500 ${isBusinessMode ? 'bg-white/90 dark:bg-gray-900/90 border-pink-200 dark:border-pink-900 shadow-2xl shadow-pink-500/10' : 'bg-card border-border'}`}>
      <CardHeader className="relative">
        <button
          onClick={() => setIsBusinessMode(!isBusinessMode)}
          className={`absolute top-4 right-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-pink-500/50 z-10 ${isBusinessMode ? 'animate-pulse ring-4 ring-pink-300/50 dark:ring-pink-700/50' : ''}`}
          aria-label="Toggle business mode"
        >
          <Icon name="Heart" size={24} className={`text-white transition-transform duration-300 ${isBusinessMode ? 'scale-110' : ''}`} />
        </button>
        <CardTitle 
          className={`text-4xl text-center ${!isBusinessMode ? 'text-primary' : ''}`}
          style={isBusinessMode ? { 
            background: 'linear-gradient(to right, #ec4899, #a855f7)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          } : {}}
        >
          {isBusinessMode ? 'LOVE IS BUSINESS' : 'Регистрация'}
        </CardTitle>
        <CardDescription className="text-center text-lg">
          {isBusinessMode ? 'Зарегистрируйтесь для управления своим бизнесом' : 'Выберите тип аккаунта для продолжения'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <QuickRegistrationSection 
          isBusinessMode={isBusinessMode}
          onQuickRegister={handleOneClickRegister}
        />

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
          <TabsContent value="buyer">
            <BuyerRegistrationForm
              username={username}
              setUsername={setUsername}
              registrationMethod={registrationMethod}
              setRegistrationMethod={setRegistrationMethod}
              contactValue={contactValue}
              setContactValue={setContactValue}
              password={password}
              setPassword={setPassword}
              referralInput={referralInput}
              setReferralInput={setReferralInput}
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              isLoading={isLoading}
              isBusinessMode={isBusinessMode}
              onRegister={() => handleRegister('buyer')}
              onShowTerms={() => setShowTermsModal(true)}
              getContactLabel={getContactLabel}
              getContactPlaceholder={getContactPlaceholder}
            />
          </TabsContent>
          <TabsContent value="seller">
            <SellerRegistrationForm
              username={username}
              setUsername={setUsername}
              registrationMethod={registrationMethod}
              setRegistrationMethod={setRegistrationMethod}
              contactValue={contactValue}
              setContactValue={setContactValue}
              password={password}
              setPassword={setPassword}
              businessType={businessType}
              setBusinessType={setBusinessType}
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              isLoading={isLoading}
              isBusinessMode={isBusinessMode}
              onRegister={() => handleRegister('seller')}
              onShowTerms={() => setShowTermsModal(true)}
              getContactLabel={getContactLabel}
              getContactPlaceholder={getContactPlaceholder}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{' '}
          <Button 
            variant="link" 
            className={`p-0 h-auto font-semibold ${isBusinessMode ? 'text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300' : ''}`}
            onClick={() => setCurrentPage('login')}
          >
            Войти
          </Button>
        </div>
      </CardContent>
    </Card>

    <VerificationCodeModal
      isOpen={showVerification}
      onClose={() => setShowVerification(false)}
      onVerify={handleVerificationSuccess}
      onResendCode={handleResendCode}
      method={registrationMethod}
      contact={contactValue}
    />

    <TermsModal
      isOpen={showTermsModal}
      onClose={() => setShowTermsModal(false)}
    />
  </div>
  );
};
