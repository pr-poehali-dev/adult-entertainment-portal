import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { PartnerEarning, PartnerLevel } from '@/contexts/PartnerProgramContext';

interface PartnerEarningsTabProps {
  earnings: PartnerEarning[];
  partnerLevels: PartnerLevel[];
  getStatusBadge: (status: string) => JSX.Element;
}

export const PartnerEarningsTab = ({ earnings, partnerLevels, getStatusBadge }: PartnerEarningsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          История заработка
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {earnings.map((earning) => (
            <div key={earning.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{earning.fromUserName}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    earning.level === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300' :
                    earning.level === 2 ? 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                  }`}>
                    {earning.level} линия
                  </span>
                  {getStatusBadge(earning.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(earning.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-muted-foreground">Транзакция: {earning.amount.toLocaleString()} {earning.currency}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">+{earning.commission.toLocaleString()} ₽</div>
                <p className="text-xs text-muted-foreground">{partnerLevels.find(l => l.level === earning.level)?.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
