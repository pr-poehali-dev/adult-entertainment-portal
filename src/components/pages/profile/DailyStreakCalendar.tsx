import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useEffect, useState } from 'react';

export const DailyStreakCalendar = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [visitHistory, setVisitHistory] = useState<string[]>([]);

  useEffect(() => {
    const streak = parseInt(localStorage.getItem('dailyStreak') || '0');
    const history = JSON.parse(localStorage.getItem('visitHistory') || '[]');
    setCurrentStreak(streak);
    setVisitHistory(history);
  }, []);

  const getLast30Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toDateString(),
        day: date.getDate(),
        month: date.toLocaleDateString('ru-RU', { month: 'short' }),
        isVisited: visitHistory.includes(date.toDateString()),
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  const days = getLast30Days();
  const nextMilestone = Math.ceil((currentStreak + 1) / 7) * 7;
  const progressToMilestone = ((currentStreak % 7) / 7) * 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-b">
        <CardTitle className="flex items-center gap-2">
          <Icon name="Calendar" size={24} className="text-pink-500" />
          Календарь посещений
        </CardTitle>
        <CardDescription>
          Получайте ежедневные бонусы LOVE за активность
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border border-pink-200 dark:border-pink-800">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Текущая серия</div>
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
              {currentStreak > 0 ? (
                <>
                  <Icon name="Flame" size={32} className="text-orange-500" />
                  {currentStreak} {currentStreak === 1 ? 'день' : currentStreak < 5 ? 'дня' : 'дней'}
                </>
              ) : (
                <span className="text-xl">Начните с сегодняшнего визита!</span>
              )}
            </div>
          </div>
          
          <div className="text-center px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-pink-300 dark:border-pink-700">
            <div className="text-xs text-muted-foreground mb-1">Следующий бонус</div>
            <div className="text-lg font-bold text-pink-600 dark:text-pink-400">
              {currentStreak % 7 === 0 && currentStreak > 0 ? (
                <span className="flex items-center gap-1">
                  <Icon name="Gift" size={16} />
                  +7 💗
                </span>
              ) : (
                `через ${7 - (currentStreak % 7)} ${7 - (currentStreak % 7) === 1 ? 'день' : 'дня'}`
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">До бонуса 🔥</span>
            <span className="text-sm text-muted-foreground">
              {currentStreak % 7}/{7} дней
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
              style={{ width: `${progressToMilestone}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Каждые 7 дней подряд: <span className="font-semibold text-pink-600 dark:text-pink-400">+5 LOVE бонус</span>
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Icon name="CalendarDays" size={16} />
            Последние 30 дней
          </h4>
          
          <div className="grid grid-cols-10 gap-2">
            {days.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all
                    ${day.isVisited 
                      ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md' 
                      : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
                    }
                    ${day.isToday 
                      ? 'ring-2 ring-pink-500 ring-offset-2 dark:ring-offset-gray-950' 
                      : ''
                    }
                  `}
                  title={`${day.day} ${day.month} ${day.isVisited ? '✓ Посещён' : '○ Пропущен'}`}
                >
                  {day.isVisited ? (
                    <Icon name="Check" size={14} />
                  ) : (
                    <span className="opacity-50">{day.day}</span>
                  )}
                </div>
                {index % 10 === 0 && (
                  <span className="text-xs text-muted-foreground mt-1">
                    {day.month}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-900 dark:text-blue-300">Как это работает?</p>
              <ul className="text-blue-800 dark:text-blue-400 space-y-1 text-xs">
                <li>• Ежедневно: <span className="font-semibold">+2 💗 LOVE</span></li>
                <li>• Каждые 7 дней подряд: <span className="font-semibold">+5 💗 LOVE бонус</span></li>
                <li>• Пропустите день — серия начнётся заново</li>
                <li>• Больше серия — больше бонусов!</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};