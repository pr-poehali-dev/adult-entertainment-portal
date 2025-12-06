import { useState } from 'react';
import { CatalogItem, Transaction } from '@/types';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20">
      <AgencyDashboardHeader
        agencyName={agencyName}
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
              <span>Модели ({agencyGirls.length})</span>
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
