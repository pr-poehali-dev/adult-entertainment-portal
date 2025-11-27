import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

export const RulesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl text-primary flex items-center gap-3">
            <Icon name="FileText" size={36} />
            Правила платформы
          </CardTitle>
          <CardDescription className="text-lg">
            Ознакомьтесь с правилами использования сервиса
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <Icon name="ShieldCheck" size={24} className="text-primary" />
              Безопасность
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Все пользователи проходят верификацию</li>
              <li>Конфиденциальность данных гарантирована</li>
              <li>Защита платежей через эскроу-сервис</li>
              <li>Возможность пожаловаться на нарушение</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <Icon name="Users" size={24} className="text-primary" />
              Правила для покупателей
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Уважительное отношение к продавцам</li>
              <li>Соблюдение договоренностей и времени встреч</li>
              <li>Своевременная оплата услуг</li>
              <li>Запрещены оскорбления и неадекватное поведение</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <Icon name="Briefcase" size={24} className="text-primary" />
              Правила для продавцов
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Достоверная информация в профиле</li>
              <li>Актуальные фото и описание услуг</li>
              <li>Соблюдение графика работы</li>
              <li>Профессиональное отношение к клиентам</li>
              <li>Своевременное подтверждение бронирований</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <Icon name="XCircle" size={24} className="text-destructive" />
              Запрещено
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Публикация запрещенного контента</li>
              <li>Мошенничество и обман</li>
              <li>Использование фейковых профилей</li>
              <li>Нарушение законодательства</li>
              <li>Оскорбления и угрозы</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <Icon name="AlertTriangle" size={24} className="text-yellow-500" />
              Ответственность
            </h3>
            <p className="text-muted-foreground">
              За нарушение правил платформы пользователь может быть предупрежден, 
              временно заблокирован или навсегда удален из системы. Администрация 
              оставляет за собой право принимать решения о блокировке аккаунтов.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};
