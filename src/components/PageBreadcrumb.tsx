import { Page } from '@/types';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Icon from '@/components/ui/icon';

interface PageBreadcrumbProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  customBreadcrumbs?: Array<{ label: string; page?: Page }>;
}

const pageLabels: Record<Page, string> = {
  'home': 'Главная',
  'catalog': 'Каталог',
  'profile': 'Профиль',
  'register': 'Регистрация',
  'login': 'Вход',
  'search': 'Поиск',
  'favorites': 'Избранное',
  'messages': 'Сообщения',
  'rules': 'Правила',
  'service': 'Услуга',
  'seller-profile': 'Профиль модели',
  'work': 'Работа',
  'admin': 'Админ-панель',
  'referral': 'Партнёрская программа',
  'category': 'Категория',
  'invitations': 'Приглашения',
  'raffle': 'Розыгрыш',
  'dating': 'Знакомства',
  'wallet': 'Кошелёк',
  'online-search': 'Поиск онлайн',
  'parties': 'Вечеринки',
  'party-detail': 'Детали вечеринки',
  'party-chat': 'Чат вечеринки',
  'organizer-dashboard': 'Панель организатора',
  'my-ads': 'Мои объявления',
  'user-guide': 'Инструкция',
  'agency-register': 'Регистрация агентства',
  'agency-dashboard': 'Панель агентства',
};

const pageIcons: Partial<Record<Page, string>> = {
  'home': 'Home',
  'catalog': 'Grid3x3',
  'profile': 'User',
  'messages': 'MessageCircle',
  'wallet': 'Wallet',
  'work': 'Briefcase',
  'referral': 'Users',
  'dating': 'Heart',
  'parties': 'PartyPopper',
  'raffle': 'Smartphone',
  'online-search': 'Search',
  'favorites': 'Star',
  'rules': 'FileText',
  'admin': 'Shield',
  'user-guide': 'BookOpen',
  'agency-dashboard': 'Building2',
};

export const PageBreadcrumb = ({ currentPage, setCurrentPage, customBreadcrumbs }: PageBreadcrumbProps) => {
  // Если главная страница, не показываем хлебные крошки
  if (currentPage === 'home' && !customBreadcrumbs) {
    return null;
  }

  const breadcrumbs = customBreadcrumbs || [
    { label: pageLabels['home'], page: 'home' as Page },
    { label: pageLabels[currentPage] },
  ];

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const icon = crumb.page ? pageIcons[crumb.page] : undefined;

          return (
            <div key={index} className="contents">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    {icon && <Icon name={icon as any} size={16} />}
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    onClick={() => crumb.page && setCurrentPage(crumb.page)}
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    {icon && <Icon name={icon as any} size={16} />}
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
