import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SwipeLimitModalProps {
  show: boolean;
  freeLimit: number;
  onClose: () => void;
  onGetPremium: () => void;
}

export default function SwipeLimitModal({
  show,
  freeLimit,
  onClose,
  onGetPremium,
}: SwipeLimitModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <Card className="w-full max-w-md p-6 animate-scale-up text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
            <Icon name="Crown" size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Дневной лимит достигнут</h2>
          <p className="text-muted-foreground mb-4">
            Вы просмотрели {freeLimit} анкет сегодня. Обновите до Premium для безлимитного просмотра!
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-amber-900 mb-3 flex items-center justify-center gap-2">
            <Icon name="Sparkles" size={18} />
            Premium возможности
          </h3>
          <div className="space-y-2 text-left text-sm">
            <div className="flex items-center gap-2 text-amber-900">
              <Icon name="Check" size={16} className="text-green-600" />
              <span>Безлимитные свайпы</span>
            </div>
            <div className="flex items-center gap-2 text-amber-900">
              <Icon name="Check" size={16} className="text-green-600" />
              <span>Приоритет в показе анкет</span>
            </div>
            <div className="flex items-center gap-2 text-amber-900">
              <Icon name="Check" size={16} className="text-green-600" />
              <span>Доступ к расширенным фильтрам</span>
            </div>
            <div className="flex items-center gap-2 text-amber-900">
              <Icon name="Check" size={16} className="text-green-600" />
              <span>Просмотр лайков от других</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Закрыть
          </Button>
          <Button
            onClick={onGetPremium}
            className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
          >
            <Icon name="Crown" size={18} className="mr-2" />
            Получить Premium
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Или вернитесь завтра для новых {freeLimit} свайпов
        </p>
      </Card>
    </div>
  );
}
