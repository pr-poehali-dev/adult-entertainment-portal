import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { Page } from '@/types';

interface MyAdsHeaderProps {
  setCurrentPage: (page: Page) => void;
  onCreateClick: () => void;
}

export const MyAdsHeader = ({ setCurrentPage, onCreateClick }: MyAdsHeaderProps) => {
  return (
    <>
      <PageBreadcrumb
        items={[
          { label: 'Главная', page: 'home' },
          { label: 'Мои объявления', page: 'my-ads' }
        ]}
        onNavigate={setCurrentPage}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Мои объявления
          </h1>
          <p className="text-muted-foreground mt-1">Управляйте своими объявлениями и откликами</p>
        </div>
        <Button onClick={onCreateClick} size="lg" className="gap-2">
          <Icon name="Plus" size={20} />
          Создать объявление
        </Button>
      </div>
    </>
  );
};
