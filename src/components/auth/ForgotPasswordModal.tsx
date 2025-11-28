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

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async () => {
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

    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
      
      toast({
        title: "Письмо отправлено!",
        description: "Проверьте свою почту для восстановления пароля",
      });

      setTimeout(() => {
        handleClose();
      }, 3000);
    }, 1500);
  };

  const handleClose = () => {
    setEmail('');
    setIsSuccess(false);
    setIsLoading(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSuccess) {
      handleReset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSuccess 
                ? 'bg-green-500/20' 
                : 'bg-primary/20'
            }`}>
              <Icon 
                name={isSuccess ? "CheckCircle2" : "KeyRound"} 
                size={32} 
                className={isSuccess ? 'text-green-500' : 'text-primary'}
              />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            {isSuccess ? 'Письмо отправлено!' : 'Восстановление пароля'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSuccess 
              ? 'Мы отправили инструкции для восстановления пароля на вашу почту'
              : 'Введите email, который вы использовали при регистрации'
            }
          </DialogDescription>
        </DialogHeader>

        {!isSuccess && (
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

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                onClick={handleReset}
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Отправка...
                  </span>
                ) : (
                  'Отправить'
                )}
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground">
                Письмо с инструкциями будет отправлено на указанный email
              </p>
            </div>
          </div>
        )}

        {isSuccess && (
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
