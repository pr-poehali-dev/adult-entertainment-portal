import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { StripteaseAd } from './stripteaseData';

interface StripteaseProfileTabProps {
  ad: StripteaseAd;
}

const weekDays = [
  { key: 'mon', label: 'Пн' },
  { key: 'tue', label: 'Вт' },
  { key: 'wed', label: 'Ср' },
  { key: 'thu', label: 'Чт' },
  { key: 'fri', label: 'Пт' },
  { key: 'sat', label: 'Сб' },
  { key: 'sun', label: 'Вс' },
];

export const StripteaseProfileTab = ({ ad }: StripteaseProfileTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Icon name="FileText" size={20} />
            О себе
          </h3>
          <p className="text-muted-foreground">{ad.about}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Icon name="Sparkles" size={20} />
            Специализации
          </h3>
          <div className="flex flex-wrap gap-2">
            {ad.specialties.map((specialty, idx) => (
              <Badge key={idx} variant="secondary" className="px-3 py-1">
                {specialty}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Icon name="Briefcase" size={20} />
            Опыт работы
          </h3>
          <p className="text-muted-foreground">{ad.experience} профессионального опыта</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Icon name="Calendar" size={20} />
            Доступность по дням недели
          </h3>
          <div className="flex gap-2">
            {weekDays.map(day => (
              <div
                key={day.key}
                className={`flex-1 text-center py-2 rounded-lg ${
                  ad.availability[day.key]
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {day.label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {ad.portfolio.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Icon name="Images" size={20} />
              Портфолио
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {ad.portfolio.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Портфолио ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
