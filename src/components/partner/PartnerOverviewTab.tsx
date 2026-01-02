import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { PartnerLevel, PartnerStats } from '@/contexts/PartnerProgramContext';

interface PartnerOverviewTabProps {
  stats: PartnerStats;
  partnerLevels: PartnerLevel[];
}

export const PartnerOverviewTab = ({ stats, partnerLevels }: PartnerOverviewTabProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Award" size={20} />
            Многоуровневая программа
          </CardTitle>
          <CardDescription>
            Получайте комиссию с покупок ваших рефералов и их рефералов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {partnerLevels.map((level) => (
              <div key={level.level} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    level.level === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                    level.level === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                    'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                  }`}>
                    {level.level}
                  </div>
                  <div>
                    <h4 className="font-semibold">{level.level} линия</h4>
                    <p className="text-sm text-muted-foreground">
                      {stats[`level${level.level}Count` as keyof PartnerStats]} рефералов
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{level.percentage}%</div>
                  <div className="text-sm text-muted-foreground">+{level.loveBonus} 💗</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg border border-pink-200 dark:border-pink-800">
            <h4 className="font-semibold text-pink-600 dark:text-pink-400 mb-2 flex items-center gap-2">
              <Icon name="Sparkles" size={18} />
              Как это работает?
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>1 линия:</strong> Ваши прямые рефералы — 10% от их покупок</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>2 линия:</strong> Рефералы ваших рефералов — 5%</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>3 линия:</strong> Третий уровень — 2.5%</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Heart" size={16} className="text-pink-600 mt-0.5 flex-shrink-0" />
                <span>+ Бонусные LOVE токены за каждого приведённого реферала</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">1 линия</span>
              <Icon name="Users" size={18} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold">{stats.level1Earned.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.level1Count} рефералов</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">2 линия</span>
              <Icon name="Users" size={18} className="text-gray-600" />
            </div>
            <div className="text-2xl font-bold">{stats.level2Earned.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.level2Count} рефералов</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">3 линия</span>
              <Icon name="Users" size={18} className="text-orange-600" />
            </div>
            <div className="text-2xl font-bold">{stats.level3Earned.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.level3Count} рефералов</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
