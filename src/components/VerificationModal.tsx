import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

export const VerificationModal = ({ isOpen, onClose, onVerify }: VerificationModalProps) => {
  const [step, setStep] = useState<'info' | 'upload'>('info');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, загрузите документы',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Документы отправлены',
      description: 'Ваша заявка на верификацию принята. Проверка займет 1-2 дня.',
    });
    onVerify();
    onClose();
    setStep('info');
    setSelectedFiles([]);
  };

  const benefits = [
    {
      icon: 'TrendingUp',
      title: 'Приоритет в поиске',
      description: 'Ваш профиль будет показываться выше в результатах поиска',
      color: 'text-blue-500'
    },
    {
      icon: 'Shield',
      title: 'Знак доверия',
      description: 'Золотая галочка верификации привлекает больше клиентов',
      color: 'text-amber-500'
    },
    {
      icon: 'Star',
      title: 'Повышенный рейтинг',
      description: 'Верифицированные пользователи получают +10% к видимости',
      color: 'text-purple-500'
    },
    {
      icon: 'MessageCircle',
      title: 'Больше откликов',
      description: 'Клиенты охотнее выбирают проверенных исполнителей',
      color: 'text-green-500'
    },
    {
      icon: 'Zap',
      title: 'Быстрая поддержка',
      description: 'Приоритетная обработка обращений в службу поддержки',
      color: 'text-orange-500'
    },
    {
      icon: 'Lock',
      title: 'Дополнительная защита',
      description: 'Защита от мошенничества и блокировок аккаунта',
      color: 'text-red-500'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-3xl text-primary flex items-center gap-2">
            <Icon name="ShieldCheck" size={32} />
            Верификация профиля
          </DialogTitle>
          <DialogDescription className="text-lg">
            Подтвердите личность для получения преимуществ на платформе
          </DialogDescription>
        </DialogHeader>

        {step === 'info' && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Icon name="Info" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Верификация необязательна</h3>
                    <p className="text-foreground/80">
                      Вы можете пользоваться платформой без верификации, но подтвержденный профиль 
                      дает значительные преимущества и повышает доверие клиентов.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Gift" className="text-primary" />
                Преимущества верификации
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, i) => (
                  <Card key={i} className="bg-muted/30 border-border hover:border-primary/50 transition-all">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Icon name={benefit.icon as any} size={24} className={benefit.color} />
                        <div>
                          <h4 className="font-semibold mb-1">{benefit.title}</h4>
                          <p className="text-sm text-foreground/70">{benefit.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="bg-muted/30 border-border">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Icon name="FileText" className="text-primary" />
                  Что нужно для верификации
                </h3>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-center gap-2">
                    <Icon name="CheckCircle" size={18} className="text-primary" />
                    Паспорт (разворот с фото) или водительские права
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="CheckCircle" size={18} className="text-primary" />
                    Селфи с документом в руках
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="CheckCircle" size={18} className="text-primary" />
                    Для продавцов: подтверждение возраста 18+
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <Icon name="Lock" size={16} className="mt-0.5" />
                    Все данные надежно защищены и используются только для верификации. 
                    Проверка занимает 1-2 рабочих дня.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
                onClick={() => setStep('upload')}
              >
                <Icon name="Upload" className="mr-2" size={20} />
                Начать верификацию
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-border text-lg py-6"
                onClick={onClose}
              >
                Позже
              </Button>
            </div>
          </div>
        )}

        {step === 'upload' && (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setStep('info')}
              className="mb-4"
            >
              <Icon name="ArrowLeft" className="mr-2" size={18} />
              Назад
            </Button>

            <div className="space-y-4">
              <div>
                <Label htmlFor="documents" className="text-lg">
                  Загрузите документы
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Форматы: JPG, PNG, PDF. Максимальный размер: 10 МБ
                </p>
                <Input 
                  id="documents"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="bg-background border-border cursor-pointer"
                />
              </div>

              {selectedFiles.length > 0 && (
                <Card className="bg-muted/30 border-border">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="FileCheck" className="text-primary" />
                      Загружено файлов: {selectedFiles.length}
                    </h4>
                    <ul className="space-y-2">
                      {selectedFiles.map((file, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Icon name="File" size={16} className="text-muted-foreground" />
                          <span className="truncate">{file.name}</span>
                          <Badge variant="outline" className="ml-auto">
                            {(file.size / 1024 / 1024).toFixed(2)} МБ
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-amber-500/10 border-amber-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Icon name="AlertTriangle" size={20} className="text-amber-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Важно:</p>
                      <ul className="space-y-1 text-foreground/70">
                        <li>• Документы должны быть четкими и читаемыми</li>
                        <li>• Все данные на фото должны быть видны полностью</li>
                        <li>• Селфи с документом должно показывать ваше лицо и документ</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
                onClick={handleSubmit}
                disabled={selectedFiles.length === 0}
              >
                <Icon name="Send" className="mr-2" size={20} />
                Отправить на проверку
              </Button>
              <Button 
                variant="outline" 
                className="border-border"
                onClick={() => {
                  setStep('info');
                  setSelectedFiles([]);
                }}
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
