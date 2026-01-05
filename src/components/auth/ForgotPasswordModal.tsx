import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { passwordResetApi } from '@/lib/api';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');

  const handleRequestCode = async () => {
    if (!email) {
      toast({
        title: "Ошибка",
        description: "Введите email адрес",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Ошибка",
        description: "Введите корректный email адрес",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await passwordResetApi.requestReset(email);
      setStep('code');
      toast({
        title: "Код отправлен!",
        description: "Проверьте свою почту, код действителен 15 минут",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось отправить код",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!code || !newPassword || !confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен быть минимум 6 символов",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await passwordResetApi.verifyAndReset(email, code, newPassword);
      setStep('success');
      toast({
        title: "Пароль изменён!",
        description: "Теперь вы можете войти с новым паролем",
      });

      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось изменить пароль",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setStep('email');
    setIsLoading(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      if (step === 'email') {
        handleRequestCode();
      } else if (step === 'code') {
        handleResetPassword();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              step === 'success' 
                ? 'bg-green-500/20' 
                : 'bg-primary/20'
            }`}>
              <Icon 
                name={step === 'success' ? "CheckCircle2" : "KeyRound"} 
                size={32} 
                className={step === 'success' ? 'text-green-500' : 'text-primary'}
              />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            {step === 'success' ? 'Пароль изменён!' : step === 'code' ? 'Введите код' : 'Восстановление пароля'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 'success' 
              ? 'Теперь вы можете войти с новым паролем'
              : step === 'code'
              ? 'Введите 6-значный код из письма и новый пароль'
              : 'Введите email, который вы использовали при регистрации'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'email' && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-border h-12"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                onClick={handleRequestCode}
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Отправка...
                  </span>
                ) : (
                  'Получить код'
                )}
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground">
                Код будет отправлен на указанный email
              </p>
            </div>
          </div>
        )}

        {step === 'code' && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="reset-code">Код из письма</Label>
              <Input
                id="reset-code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-border h-12 text-center text-2xl tracking-widest"
                maxLength={6}
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Новый пароль</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Минимум 6 символов"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-border h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Повторите пароль</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Повторите новый пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-border h-12"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setStep('email')}
                className="flex-1"
                disabled={isLoading}
              >
                Назад
              </Button>
              <Button
                onClick={handleResetPassword}
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Изменение...
                  </span>
                ) : (
                  'Изменить пароль'
                )}
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground">
                Код действителен 15 минут
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="mt-6 space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="Mail" size={20} className="text-green-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Проверьте свою почту</p>
                  <p className="text-xs text-muted-foreground">
                    Если письмо не пришло, проверьте папку "Спам"
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Понятно
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};