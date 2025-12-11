import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';

interface UserGuidePageProps {
  setCurrentPage: (page: Page) => void;
}

export const UserGuidePage = ({ setCurrentPage }: UserGuidePageProps) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageBreadcrumb currentPage="user-guide" setCurrentPage={setCurrentPage} />
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Пользовательская Инструкция</h1>
        <p className="text-sm text-muted-foreground">Руководство по использованию платформы Elite</p>
      </div>

      <div className="space-y-6">
        {/* Для мужчин */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="User" className="text-primary" size={24} />
              Для мужчин
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Search" size={18} className="text-primary" />
                Поиск услуг
              </h3>
              <p className="text-muted-foreground text-sm">
                Используйте каталог для поиска девушек. Применяйте фильтры по категории, цене, локации и другим параметрам.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Calendar" size={18} className="text-primary" />
                Бронирование
              </h3>
              <p className="text-muted-foreground text-sm">
                Выберите услугу, нажмите "Забронировать", укажите дату и время встречи. Девушка получит уведомление и подтвердит бронирование.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="FileText" size={18} className="text-primary" />
                Создание объявления-запроса
              </h3>
              <p className="text-muted-foreground text-sm">
                В разделе "Мои объявления" вы можете создать запрос с описанием того, что ищете. Девушки увидят ваш запрос и смогут откликнуться. Вы получите уведомления об откликах и сможете выбрать подходящую девушку.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Wallet" size={18} className="text-primary" />
                Кошелёк и оплата
              </h3>
              <p className="text-muted-foreground text-sm">
                Пополните кошелёк для оплаты услуг. Средства списываются только после подтверждения встречи. Поддерживаются различные валюты и криптовалюты.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Для девушек */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Sparkles" className="text-primary" size={24} />
              Для девушек
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="User" size={18} className="text-primary" />
                Настройка профиля
              </h3>
              <p className="text-muted-foreground text-sm">
                Заполните профиль: добавьте фото, описание, услуги и цены. Пройдите верификацию для повышения доверия клиентов.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="DollarSign" size={18} className="text-primary" />
                Прайс-лист услуг
              </h3>
              <p className="text-muted-foreground text-sm">
                В профиле укажите все предоставляемые услуги с ценами. Это поможет клиентам быстрее определиться с выбором.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="FileText" size={18} className="text-primary" />
                Объявления
              </h3>
              <p className="text-muted-foreground text-sm">
                Создавайте объявления со своими услугами. Также просматривайте запросы мужчин в каталоге и откликайтесь на подходящие предложения.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Calendar" size={18} className="text-primary" />
                График работы
              </h3>
              <p className="text-muted-foreground text-sm">
                Установите график работы в профиле. Клиенты увидят, когда вы доступны. Режим 24/7, расписание или неактивен.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Bell" size={18} className="text-primary" />
                Уведомления
              </h3>
              <p className="text-muted-foreground text-sm">
                Включите уведомления в настройках профиля, чтобы не пропустить запросы на бронирование и отклики на объявления.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Общие функции */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Star" className="text-primary" size={24} />
              Общие функции
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="MessageCircle" size={18} className="text-primary" />
                Сообщения
              </h3>
              <p className="text-muted-foreground text-sm">
                Общайтесь с другими пользователями через встроенный мессенджер. Обсудите детали встречи до бронирования.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Heart" size={18} className="text-primary" />
                Избранное
              </h3>
              <p className="text-muted-foreground text-sm">
                Добавляйте понравившиеся профили в избранное для быстрого доступа.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Star" size={18} className="text-primary" />
                Отзывы
              </h3>
              <p className="text-muted-foreground text-sm">
                После встречи оставляйте отзывы. Это помогает другим пользователям и повышает репутацию на платформе.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Users" size={18} className="text-primary" />
                Реферальная программа
              </h3>
              <p className="text-muted-foreground text-sm">
                Приглашайте друзей и получайте комиссию с их транзакций (3 уровня: 10%, 5%, 1%).
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Crown" size={18} className="text-primary" />
                VIP-статус
              </h3>
              <p className="text-muted-foreground text-sm">
                Приобретите VIP для получения приоритета в каталоге, эксклюзивных функций и отсутствия рекламы.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="PartyPopper" size={18} className="text-primary" />
                Вечеринки
              </h3>
              <p className="text-muted-foreground text-sm">
                Создавайте или участвуйте в закрытых вечеринках. Организаторы проводят собеседования с участниками в чате.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Безопасность */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Shield" className="text-primary" size={24} />
              Безопасность и правила
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              ⚠️ <strong>Важно:</strong> Всегда проверяйте верифицированные профили (значок галочки).
            </p>
            <p className="text-sm text-muted-foreground">
              🔒 Используйте внутренние средства платформы для оплаты — это гарантирует защиту сделки.
            </p>
            <p className="text-sm text-muted-foreground">
              📋 Ознакомьтесь с <button onClick={() => setCurrentPage('rules')} className="text-primary hover:underline font-medium">правилами платформы</button> перед использованием.
            </p>
            <p className="text-sm text-muted-foreground">
              💬 При возникновении проблем обратитесь в службу поддержки 24/7.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => setCurrentPage('home')} size="lg" className="gap-2">
          <Icon name="Home" size={18} />
          На главную
        </Button>
      </div>
    </div>
  );
};

export default UserGuidePage;