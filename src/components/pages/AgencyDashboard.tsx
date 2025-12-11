import { useState } from 'react';
import { CatalogItem, Transaction, AgencyType } from '@/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { AgencyDashboardHeader } from './agency/AgencyDashboardHeader';
import { AgencyDashboardOverview } from './agency/AgencyDashboardOverview';
import { AgencyDashboardProfiles } from './agency/AgencyDashboardProfiles';
import { AgencyDashboardTransactions } from './agency/AgencyDashboardTransactions';

interface AgencyDashboardProps {
  agencyName: string;
  agencyType?: AgencyType;
  agencyGirls: CatalogItem[];
  transactions?: Transaction[];
  onBack: () => void;
  onAddGirl: () => void;
  onEditGirl: (girlId: number) => void;
  onDeleteGirl: (girlId: number) => void;
  onToggleActive: (girlId: number) => void;
  onIncrementViews?: (girlId: number) => void;
}

const AgencyDashboard = ({
  agencyName,
  agencyType,
  agencyGirls,
  transactions = [],
  onBack,
  onAddGirl,
  onEditGirl,
  onDeleteGirl,
  onToggleActive,
}: AgencyDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const activeGirls = agencyGirls.filter(g => g.isActive).length;
  const totalBookings = agencyGirls.reduce((sum, g) => sum + (g.stats?.bookings || 0), 0);
  const totalRevenue = agencyGirls.reduce((sum, g) => sum + (g.stats?.revenue || 0), 0);
  const totalViews = agencyGirls.reduce((sum, g) => sum + (g.stats?.views || 0), 0);

  const getAgencyTypeLabel = (type?: AgencyType): string => {
    const labels = {
      escort: '\u042d\u0441\u043a\u043e\u0440\u0442 \u0430\u0433\u0435\u043d\u0442\u0441\u0442\u0432\u043e',
      massage: '\u041c\u0430\u0441\u0441\u0430\u0436\u043d\u044b\u0439 \u0441\u0430\u043b\u043e\u043d',
      striptease: '\u0421\u0442\u0440\u0438\u043f\u0442\u0438\u0437 \u043a\u043b\u0443\u0431',
      virtual: '\u0410\u0433\u0435\u043d\u0442\u0441\u0442\u0432\u043e \u0432\u0438\u0440\u0442\u0443\u0430\u043b\u044c\u043d\u044b\u0445 \u0443\u0441\u043b\u0443\u0433',
      realestate: '\u0410\u0433\u0435\u043d\u0442\u0441\u0442\u0432\u043e \u043d\u0435\u0434\u0432\u0438\u0436\u0438\u043c\u043e\u0441\u0442\u0438',
    };
    return type ? labels[type] : '\u0410\u0433\u0435\u043d\u0442\u0441\u0442\u0432\u043e';
  };

  const getEmployeeLabel = (type?: AgencyType): string => {
    const labels = {
      escort: '\u041c\u043e\u0434\u0435\u043b\u0438',
      massage: '\u041c\u0430\u0441\u0442\u0435\u0440\u0430',
      striptease: '\u0422\u0430\u043d\u0446\u043e\u0440\u044b',
      virtual: '\u041c\u043e\u0434\u0435\u043b\u0438',
      realestate: '\u041e\u0431\u044a\u0435\u043a\u0442\u044b',
    };
    return type ? labels[type] : '\u041c\u043e\u0434\u0435\u043b\u0438';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20">
      <AgencyDashboardHeader
        agencyName={agencyName}
        agencyType={agencyType}
        onBack={onBack}
        onAddGirl={onAddGirl}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Icon name="LayoutDashboard" size={16} />
              <span>Дашборд</span>
            </TabsTrigger>
            <TabsTrigger value="profiles" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Icon name="Users" size={16} />
              <span>{getEmployeeLabel(agencyType)} ({agencyGirls.length})</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Icon name="Receipt" size={16} />
              <span>Финансы ({transactions.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-6">
            <AgencyDashboardOverview
              agencyGirls={agencyGirls}
              activeGirls={activeGirls}
              totalViews={totalViews}
              totalBookings={totalBookings}
              totalRevenue={totalRevenue}
              onAddGirl={onAddGirl}
            />
          </TabsContent>

          <TabsContent value="profiles" className="space-y-6 mt-6">
            <AgencyDashboardProfiles
              agencyGirls={agencyGirls}
              onEditGirl={onEditGirl}
              onDeleteGirl={onDeleteGirl}
              onToggleActive={onToggleActive}
            />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6 mt-6">
            <AgencyDashboardTransactions transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgencyDashboard;