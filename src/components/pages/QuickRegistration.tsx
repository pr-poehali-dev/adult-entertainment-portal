import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface QuickRegistrationProps {
  onRegisterSuccess: (credentials: { login: string; password: string }) => void;
  onCancel: () => void;
}

export const QuickRegistration = ({ onRegisterSuccess, onCancel }: QuickRegistrationProps) => {
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{ login: string; password: string } | null>(null);

  const generateLogin = () => {
    const adjectives = ['быстрый', 'умный', 'веселый', 'яркий', 'смелый', 'крутой', 'добрый', 'сильный'];
    const nouns = ['гепард', 'дельфин', 'орел', 'тигр', 'волк', 'лев', 'ястреб', 'медведь'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 9999);
    return `${randomAdj}_${randomNoun}${randomNum}`;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleQuickRegister = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: 'Укажите телефон',
        description: 'Введите корректный номер телефона',
        variant: 'destructive',
      });
      return;
    }

    if (!email || !email.includes('@')) {
      toast({
        title: 'Укажите email',
        description: 'Введите корректный адрес электронной почты',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const login = generateLogin();
    const password = generatePassword();
    
    try {
      await fetch('https://functions.poehali.dev/cf4df0ab-f212-4000-82d6-438f1b03472b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, login, password, phone })
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }

    setTimeout(() => {
      setGeneratedCredentials({ login, password });
      
      localStorage.setItem('user_credentials', JSON.stringify({ login, password, phone, email }));
      
      toast({
        title: 'Регистрация успешна! 🎉',
        description: `Данные отправлены на ${email}`,
        duration: 5000,
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const handleCopyCredentials = () => {
    if (generatedCredentials) {
      const text = `Логин: ${generatedCredentials.login}\nПароль: ${generatedCredentials.password}`;
      navigator.clipboard.writeText(text);
      toast({
        title: 'Скопировано! 📋',
        description: 'Данные для входа скопированы в буфер обмена',
      });
    }
  };

  const handleContinue = () => {
    if (generatedCredentials) {
      onRegisterSuccess(generatedCredentials);
    }
  };

  if (generatedCredentials) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
        <Card className="max-w-2xl w-full shadow-2xl border-4 border-primary/30 animate-in zoom-in duration-500">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl animate-pulse">
              <Icon name="CheckCircle2" size={48} className="text-white" />
            </div>
            <CardTitle className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              🎉 Регистрация завершена!
            </CardTitle>
            <CardDescription className="text-lg mt-3 font-medium">
              Ваши данные для входа готовы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-8 space-y-6 border-4 border-primary/40 shadow-xl">
              <div className="space-y-3">
                <Label className="text-base font-bold text-foreground flex items-center gap-2">
                  <Icon name="User" size={20} className="text-primary" />
                  Ваш логин:
                </Label>
                <div className="bg-white dark:bg-background rounded-xl p-5 font-mono text-2xl font-bold break-all border-4 border-primary/30 shadow-lg text-center">
                  {generatedCredentials.login}
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-bold text-foreground flex items-center gap-2">
                  <Icon name="Lock" size={20} className="text-primary" />
                  Ваш пароль:
                </Label>
                <div className="bg-white dark:bg-background rounded-xl p-5 font-mono text-2xl font-bold break-all border-4 border-primary/30 shadow-lg text-center">
                  {generatedCredentials.password}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-4 border-yellow-500/40 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-500 rounded-full p-2">
                  <Icon name="AlertTriangle" size={24} className="text-white flex-shrink-0" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground mb-2">⚠️ ВАЖНО! Сохраните эти данные!</p>
                  <p className="text-sm text-foreground/90">
                    Запишите логин и пароль в надёжное место. Они понадобятся для входа в аккаунт при следующих посещениях.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleCopyCredentials}
                variant="outline"
                size="lg"
                className="w-full h-16 text-lg font-bold border-2 hover:border-primary hover:bg-primary/10"
              >
                <Icon name="Copy" size={24} className="mr-3" />
                📋 Скопировать логин и пароль
              </Button>
              
              <Button
                onClick={handleContinue}
                size="lg"
                className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl"
              >
                Продолжить
                <Icon name="ArrowRight" size={24} className="ml-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Icon name="Zap" size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl">Быстрая регистрация</CardTitle>
          <CardDescription className="text-base mt-2">
            Зарегистрируйтесь за 1 клик. Мы сгенерируем логин и пароль автоматически.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              На этот email придут логин и пароль
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Номер телефона</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Для восстановления доступа
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-foreground space-y-1">
                <p className="font-semibold">Что произойдет:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Создастся уникальный логин</li>
                  <li>Сгенерируется безопасный пароль</li>
                  <li>Данные отправятся на ваш email</li>
                  <li>Вы сразу сможете участвовать в розыгрыше</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleQuickRegister}
              disabled={isLoading}
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Создаем аккаунт...
                </>
              ) : (
                <>
                  <Icon name="Zap" size={20} className="mr-2" />
                  Зарегистрироваться за 1 клик
                </>
              )}
            </Button>
            
            <Button
              onClick={onCancel}
              variant="outline"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};