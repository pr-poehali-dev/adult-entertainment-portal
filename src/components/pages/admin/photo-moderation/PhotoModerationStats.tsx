import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface PhotoModerationStatsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export const PhotoModerationStats = ({
  pendingCount,
  approvedCount,
  rejectedCount
}: PhotoModerationStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Icon name="Clock" size={16} />
            На модерации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-500">{pendingCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Требуют проверки</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Icon name="CheckCircle" size={16} />
            Одобрено
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">{approvedCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Фотографий</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Icon name="XCircle" size={16} />
            Отклонено
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500">{rejectedCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Фотографий</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon name="Sparkles" size={16} className="text-primary" />
            AI Модератор
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium mb-2">GPT-4o Vision</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="Shield" size={12} />
              <span>Проверка на нарушения</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Eye" size={12} />
              <span>Анализ содержимого</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Zap" size={12} />
              <span>Быстрая обработка</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
