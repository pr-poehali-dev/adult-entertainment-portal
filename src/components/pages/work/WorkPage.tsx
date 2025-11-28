import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkOpportunitiesSection } from './WorkOpportunitiesSection';
import { PaidAdsSection } from './PaidAdsSection';
import Icon from '@/components/ui/icon';

export const WorkPage = () => {
  const [activeTab, setActiveTab] = useState('opportunities');

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Icon name="Briefcase" size={36} className="text-primary" />
          Работа
        </h1>
        <p className="text-muted-foreground text-lg">
          Возможности заработка и платные объявления
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="opportunities" className="text-base">
            <Icon name="Search" size={18} className="mr-2" />
            Вакансии
          </TabsTrigger>
          <TabsTrigger value="ads" className="text-base">
            <Icon name="Megaphone" size={18} className="mr-2" />
            Платные объявления
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities">
          <WorkOpportunitiesSection />
        </TabsContent>

        <TabsContent value="ads">
          <PaidAdsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};
