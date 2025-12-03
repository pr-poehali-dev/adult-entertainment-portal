import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AdminPasswordRecoveryProps {
  onBack: () => void;
  recoveryEmail: string;
}

export const AdminPasswordRecovery = ({ onBack, recoveryEmail }: AdminPasswordRecoveryProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [generatedCode] = useState(Math.floor(100000 + Math.random() * 900000).toString());

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email !== recoveryEmail) {
      toast({
        title: "Ошибка",
        description: "Неверный email для восстановления",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Код отправлен",
      description: `Код восстановления: ${generatedCode} (в реальности отправлен на email)`,
    });
    setStep('code');
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code !== generatedCode) {
      toast({
        title: "Ошибка",
        description: "Неверный код подтверждения",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Код подтвержден",
      description: "Теперь установите новый пароль",
    });
    setStep('reset');
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Ошибка",
        description: "Пароль должен содержать минимум 8 символов",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Пароль изменен",
      description: "Теперь вы можете войти с новым паролем",
    });
    
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
            <Icon name="Key" size={32} className="text-white" />
          </div>
          <CardTitle className="text-2xl">Восстановление пароля</CardTitle>
          <CardDescription>
            {step === 'email' && 'Введите email администратора'}
            {step === 'code' && 'Введите код из письма'}
            {step === 'reset' && 'Установите новый пароль'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Icon name="Mail" size={18} className="mr-2" />
                Отправить код
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Назад к входу
              </Button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Код подтверждения</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Код отправлен на {email}
                </p>
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Icon name="Check" size={18} className="mr-2" />
                Подтвердить
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep('email')}>
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Назад
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Новый пароль</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Требования к паролю:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Минимум 8 символов</li>
                  <li>Рекомендуется использовать буквы, цифры и символы</li>
                </ul>
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Icon name="Lock" size={18} className="mr-2" />
                Установить пароль
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
