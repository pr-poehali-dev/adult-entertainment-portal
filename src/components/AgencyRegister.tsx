import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';
import { AgencyType } from '@/types';

interface AgencyRegisterProps {
  onBack: () => void;
  onPayment: (name: string, type: AgencyType) => void;
}

const AgencyRegister = ({ onBack, onPayment }: AgencyRegisterProps) => {
  const [agencyName, setAgencyName] = useState('');
  const [agencyType, setAgencyType] = useState<AgencyType>('escort');

  const handleSubmit = () => {
    if (!agencyName.trim()) {
      alert('Введите название агентства');
      return;
    }
    onPayment(agencyName, agencyType);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <Icon name="ArrowLeft" className="mr-2" size={20} />
          Назад
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Регистрация агентства</CardTitle>
            <CardDescription>
              Создайте свое агентство и начните зарабатывать
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="agency-name">Название агентства</Label>
              <Input
                id="agency-name"
                placeholder="Например: Elite Models Agency"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Тип агентства</Label>
              <RadioGroup value={agencyType} onValueChange={(v) => setAgencyType(v as AgencyType)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="escort" id="escort" />
                  <Label htmlFor="escort" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Эскорт агентство</div>
                    <div className="text-sm text-muted-foreground">Услуги эскорта и сопровождения</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="massage" id="massage" />
                  <Label htmlFor="massage" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Массажное агентство</div>
                    <div className="text-sm text-muted-foreground">Массажные услуги</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="striptease" id="striptease" />
                  <Label htmlFor="striptease" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Стриптиз агентство</div>
                    <div className="text-sm text-muted-foreground">Услуги стриптиза на заказ</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <Icon name="Info" className="text-primary mt-0.5" size={18} />
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Что вы получите:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Панель управления профилями</li>
                    <li>Бухгалтерия и транзакции</li>
                    <li>Управление бронированиями</li>
                    <li>Промо-материалы для девушек</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold">25 000 ₽</span>
                <span className="text-muted-foreground">единоразово</span>
              </div>
              <Button 
                onClick={handleSubmit}
                className="w-full"
                size="lg"
              >
                Перейти к оплате
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgencyRegister;
