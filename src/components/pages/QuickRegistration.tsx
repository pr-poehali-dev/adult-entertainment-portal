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

  const handleQuickRegister = () => {
    if (!phone || phone.length < 10) {
      toast({
        title: 'Укажите телефон',
        description: 'Введите корректный номер телефона',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const login = generateLogin();
      const password = generatePassword();
      
      setGeneratedCredentials({ login, password });
      
      localStorage.setItem('user_credentials', JSON.stringify({ login, password, phone }));
      
      toast({
        title: 'Регистрация успешна! 🎉',
        description: 'Сохраните логин и пароль для следующих входов',
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="max-w-md w-full shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Icon name="CheckCircle2" size={32} className="text-green-600" />
            </div>
            <CardTitle className="text-2xl">Регистрация завершена!</CardTitle>
            <CardDescription className="text-base mt-2">
              Сохраните эти данные для следующих входов
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-xl p-6 space-y-4 border-2 border-primary/20">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Ваш логин:</Label>
                <div className="bg-background rounded-lg p-3 font-mono text-lg font-semibold break-all border border-border">
                  {generatedCredentials.login}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Ваш пароль:</Label>
                <div className="bg-background rounded-lg p-3 font-mono text-lg font-semibold break-all border border-border">
                  {generatedCredentials.password}
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">
                  <span className="font-bold">Важно:</span> Сохраните эти данные в безопасном месте. 
                  Они понадобятся для входа в аккаунт.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleCopyCredentials}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Icon name="Copy" size={20} className="mr-2" />
                Скопировать данные
              </Button>
              
              <Button
                onClick={handleContinue}
                size="lg"
                className="w-full"
              >
                Продолжить
                <Icon name="ArrowRight" size={20} className="ml-2" />
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
              Нужен для восстановления доступа к аккаунту
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
                  <li>Вы сможете сразу участвовать в розыгрыше</li>
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
