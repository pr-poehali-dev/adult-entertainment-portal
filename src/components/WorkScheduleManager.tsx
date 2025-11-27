import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { WorkSchedule, WorkScheduleType } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface WorkScheduleManagerProps {
  workSchedule: WorkSchedule;
  isActive: boolean;
  onScheduleChange: (schedule: WorkSchedule) => void;
  onActiveChange: (active: boolean) => void;
}

const DAYS = [
  { key: 'monday', label: 'Понедельник' },
  { key: 'tuesday', label: 'Вторник' },
  { key: 'wednesday', label: 'Среда' },
  { key: 'thursday', label: 'Четверг' },
  { key: 'friday', label: 'Пятница' },
  { key: 'saturday', label: 'Суббота' },
  { key: 'sunday', label: 'Воскресенье' },
];

export const WorkScheduleManager = ({ 
  workSchedule, 
  isActive, 
  onScheduleChange, 
  onActiveChange 
}: WorkScheduleManagerProps) => {
  const [scheduleType, setScheduleType] = useState<WorkScheduleType>(workSchedule.type);
  const [customHours, setCustomHours] = useState(workSchedule.customHours || {
    monday: { start: '09:00', end: '18:00', enabled: true },
    tuesday: { start: '09:00', end: '18:00', enabled: true },
    wednesday: { start: '09:00', end: '18:00', enabled: true },
    thursday: { start: '09:00', end: '18:00', enabled: true },
    friday: { start: '09:00', end: '18:00', enabled: true },
    saturday: { start: '10:00', end: '16:00', enabled: false },
    sunday: { start: '10:00', end: '16:00', enabled: false },
  });
  const { toast } = useToast();

  const handleScheduleTypeChange = (type: WorkScheduleType) => {
    if (type === 'inactive') {
      onActiveChange(false);
      onScheduleChange({ type: 'inactive' });
      toast({
        title: 'Анкета деактивирована',
        description: 'Ваша анкета скрыта из поиска. Клиенты не смогут записаться.',
        variant: 'destructive',
      });
    } else {
      setScheduleType(type);
      if (type === '24/7') {
        onActiveChange(true);
        onScheduleChange({ type: '24/7' });
        toast({
          title: 'График установлен',
          description: 'Вы работаете круглосуточно без выходных',
        });
      }
    }
  };

  const handleCustomHourChange = (day: string, field: 'start' | 'end' | 'enabled', value: string | boolean) => {
    const newCustomHours = {
      ...customHours,
      [day]: {
        ...customHours[day],
        [field]: value,
      },
    };
    setCustomHours(newCustomHours);
  };

  const saveCustomSchedule = () => {
    const hasEnabledDays = Object.values(customHours).some(day => day.enabled);
    
    if (!hasEnabledDays) {
      toast({
        title: 'Ошибка',
        description: 'Выберите хотя бы один рабочий день или переключитесь на режим "Круглосуточно"',
        variant: 'destructive',
      });
      return;
    }

    onActiveChange(true);
    onScheduleChange({ type: 'custom', customHours });
    toast({
      title: 'График сохранен',
      description: 'Ваш график работы успешно обновлен',
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Icon name="Clock" size={24} className="text-primary" />
          Управление графиком работы
        </CardTitle>
        <CardDescription>
          Настройте график работы для отображения в каталоге
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Icon name={isActive ? 'CheckCircle' : 'XCircle'} size={24} className={isActive ? 'text-green-500' : 'text-red-500'} />
            <div>
              <p className="font-semibold">Статус анкеты</p>
              <p className="text-sm text-muted-foreground">
                {isActive ? 'Активна и видна в поиске' : 'Деактивирована и скрыта из поиска'}
              </p>
            </div>
          </div>
          <Badge variant={isActive ? 'default' : 'destructive'} className="text-base px-4 py-2">
            {isActive ? 'Активна' : 'Не активна'}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Режим работы</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
              className={`cursor-pointer transition-all ${scheduleType === '24/7' && isActive ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
              onClick={() => handleScheduleTypeChange('24/7')}
            >
              <CardContent className="pt-6 text-center">
                <Icon name="Clock" size={32} className="mx-auto mb-3 text-primary" />
                <h4 className="font-semibold mb-2">Круглосуточно</h4>
                <p className="text-sm text-muted-foreground">Без выходных 24/7</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all ${scheduleType === 'custom' && isActive ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
              onClick={() => setScheduleType('custom')}
            >
              <CardContent className="pt-6 text-center">
                <Icon name="Calendar" size={32} className="mx-auto mb-3 text-primary" />
                <h4 className="font-semibold mb-2">По графику</h4>
                <p className="text-sm text-muted-foreground">Настроить часы работы</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all ${!isActive ? 'border-red-500 bg-red-500/5' : 'hover:border-red-500/50'}`}
              onClick={() => handleScheduleTypeChange('inactive')}
            >
              <CardContent className="pt-6 text-center">
                <Icon name="BanIcon" size={32} className="mx-auto mb-3 text-red-500" />
                <h4 className="font-semibold mb-2">Не работаю</h4>
                <p className="text-sm text-muted-foreground">Скрыть анкету</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {scheduleType === 'custom' && isActive && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Настройка графика по дням</h3>
              <div className="space-y-3">
                {DAYS.map(({ key, label }) => (
                  <Card key={key} className="bg-muted/30 border-border">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 w-40">
                          <input
                            type="checkbox"
                            id={`${key}-enabled`}
                            checked={customHours[key]?.enabled || false}
                            onChange={(e) => handleCustomHourChange(key, 'enabled', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <Label htmlFor={`${key}-enabled`} className="cursor-pointer">
                            {label}
                          </Label>
                        </div>
                        
                        {customHours[key]?.enabled && (
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm text-muted-foreground">C</Label>
                              <Input
                                type="time"
                                value={customHours[key]?.start || '09:00'}
                                onChange={(e) => handleCustomHourChange(key, 'start', e.target.value)}
                                className="w-32 bg-background border-border"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-sm text-muted-foreground">До</Label>
                              <Input
                                type="time"
                                value={customHours[key]?.end || '18:00'}
                                onChange={(e) => handleCustomHourChange(key, 'end', e.target.value)}
                                className="w-32 bg-background border-border"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={saveCustomSchedule}
              >
                <Icon name="Save" className="mr-2" size={18} />
                Сохранить график
              </Button>
            </div>
          </>
        )}

        {!isActive && (
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Icon name="AlertTriangle" size={20} className="text-red-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1 text-red-500">Анкета деактивирована</p>
                  <ul className="space-y-1 text-foreground/80">
                    <li>• Ваша анкета скрыта из поиска и каталога</li>
                    <li>• Клиенты не могут записаться на встречу</li>
                    <li>• Оплата недоступна</li>
                    <li>• Выберите график работы для активации</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkScheduleManager;
