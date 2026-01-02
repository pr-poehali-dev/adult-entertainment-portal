import { Page } from '@/types';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PartnerDashboard } from '@/components/partner/PartnerDashboard';

interface ReferralPageProps {
  setCurrentPage?: (page: Page) => void;
}

export const ReferralPage = ({ setCurrentPage }: ReferralPageProps = {}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background py-12 px-4 animate-fade-in">
      <div className="max-w-wide mx-auto">
        {setCurrentPage && <PageBreadcrumb currentPage="referral" setCurrentPage={setCurrentPage} />}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gold-shimmer">Партнёрская программа</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Приглашайте друзей и получайте до 10% с каждой их транзакции
          </p>
        </div>
        
        <PartnerDashboard />
      </div>
    </div>
  );
};
