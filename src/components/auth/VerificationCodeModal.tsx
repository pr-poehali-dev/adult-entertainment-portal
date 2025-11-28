import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { RegistrationMethod } from '@/types';

interface VerificationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  method: RegistrationMethod;
  contact: string;
  onResend: () => void;
}

export const VerificationCodeModal = ({
  isOpen,
  onClose,
  onVerify,
  method,
  contact,
  onResend,
}: VerificationCodeModalProps) => {
  const { toast } = useToast();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) {
      if (timeLeft <= 0) setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (!/^\d{6}$/.test(pastedData)) {
      toast({
        title: "Ошибка",
        description: "Вставьте 6-значный код",
        variant: "destructive",
      });
      return;
    }

    const newCode = pastedData.split('');
    setCode(newCode);
    inputRefs.current[5]?.focus();
    handleVerify(pastedData);
  };

  const handleVerify = async (fullCode: string) => {
    setIsLoading(true);

    setTimeout(() => {
      const correctCode = '123456';
      
      if (fullCode === correctCode) {
        toast({
          title: "Успешно!",
          description: "Код подтверждён",
        });
        onVerify(fullCode);
      } else {
        toast({
          title: "Неверный код",
          description: "Проверьте правильность введённого кода",
          variant: "destructive",
        });
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
      
      setIsLoading(false);
    }, 800);
  };

  const handleResend = () => {
    if (!canResend) return;
    
    setTimeLeft(300);
    setCanResend(false);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    
    onResend();
    
    toast({
      title: "Код отправлен!",
      description: getResendMessage(),
    });
  };

  const getMethodIcon = (): string => {
    switch (method) {
      case 'email': return 'Mail';
      case 'phone': return 'Phone';
      case 'telegram': return 'MessageCircle';
    }
  };

  const getMethodLabel = (): string => {
    switch (method) {
      case 'email': return 'на email';
      case 'phone': return 'по SMS';
      case 'telegram': return 'в Telegram';
    }
  };

  const getResendMessage = (): string => {
    switch (method) {
      case 'email': return `Новый код отправлен на ${contact}`;
      case 'phone': return `SMS с кодом отправлен на ${contact}`;
      case 'telegram': return `Код отправлен в ваш Telegram`;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon name={getMethodIcon()} size={32} className="text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Подтверждение кода
          </DialogTitle>
          <DialogDescription className="text-center">
            Мы отправили 6-значный код {getMethodLabel()}
            <br />
            <span className="font-semibold text-foreground">{contact}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold bg-background border-border"
                disabled={isLoading}
              />
            ))}
          </div>

          <div className="text-center space-y-2">
            {timeLeft > 0 ? (
              <p className="text-sm text-muted-foreground">
                Код действителен ещё{' '}
                <span className="font-semibold text-primary">
                  {formatTime(timeLeft)}
                </span>
              </p>
            ) : (
              <p className="text-sm text-destructive font-medium">
                Время действия кода истекло
              </p>
            )}

            <Button
              variant="link"
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className="text-primary hover:text-primary/80"
            >
              {canResend ? 'Отправить код повторно' : 'Отправить повторно через ' + formatTime(timeLeft)}
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground">
              {method === 'email' && 'Проверьте папку "Спам", если письмо не пришло'}
              {method === 'phone' && 'SMS может прийти в течение 1-2 минут'}
              {method === 'telegram' && 'Откройте бот @EliteBot в Telegram'}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
            disabled={isLoading}
          >
            Отмена
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
