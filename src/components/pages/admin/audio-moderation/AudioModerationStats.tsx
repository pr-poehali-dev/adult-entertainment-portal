import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AudioModerationStatsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export const AudioModerationStats = ({
  pendingCount,
  approvedCount,
  rejectedCount,
}: AudioModerationStatsProps) => {
  const stats = [
    { 
      label: 'На модерации', 
      value: pendingCount, 
      icon: 'Clock', 
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    { 
      label: 'Одобрено', 
      value: approvedCount, 
      icon: 'CheckCircle', 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      label: 'Отклонено', 
      value: rejectedCount, 
      icon: 'XCircle', 
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={stat.bgColor}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon name={stat.icon as any} size={32} className={stat.color} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Icon name="Sparkles" size={20} className="text-purple-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                🤖 AI-модератор включен
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Нажмите кнопку "Проверить AI-модератором" для автоматического анализа аудио через OpenAI Whisper + GPT-4
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>AI распознает речь и анализирует содержание на правила</li>
                <li>Автоматическое одобрение безопасных аудио</li>
                <li>Помечает подозрительный контент для ручной проверки</li>
                <li>Показывает уверенность AI в процентах</li>
                <li>Отклоняйте угрозы, продажу контактов, запрещенные товары</li>
                <li>При сомнении - отклоняйте и указывайте причину</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
