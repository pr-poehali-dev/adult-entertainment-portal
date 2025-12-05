import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminDashboard } from './AdminDashboard';
import { AdminUsers } from './AdminUsers';
import { AdminBookings } from './AdminBookings';
import { AdminAds } from './AdminAds';
import { AdminWorkApplications } from './AdminWorkApplications';
import { AdminSettings } from './AdminSettings';
import Icon from '@/components/ui/icon';
import { Page } from '@/types';
import { Button } from '@/components/ui/button';

interface AdminPageProps {
  setCurrentPage: (page: Page) => void;
}

export const AdminPage = ({ setCurrentPage }: AdminPageProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-wide mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Админ-панель</h1>
                <p className="text-sm text-muted-foreground">Управление платформой</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setCurrentPage('home')} className="gap-2">
              <Icon name="ArrowLeft" size={18} />
              На сайт
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-wide mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8 h-auto p-1">
            <TabsTrigger value="dashboard" className="flex flex-col items-center gap-1 py-3">
              <Icon name="LayoutDashboard" size={20} />
              <span className="text-xs">Дашборд</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex flex-col items-center gap-1 py-3">
              <Icon name="Users" size={20} />
              <span className="text-xs">Пользователи</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex flex-col items-center gap-1 py-3">
              <Icon name="Calendar" size={20} />
              <span className="text-xs">Бронирования</span>
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex flex-col items-center gap-1 py-3">
              <Icon name="Megaphone" size={20} />
              <span className="text-xs">Объявления</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex flex-col items-center gap-1 py-3">
              <Icon name="Briefcase" size={20} />
              <span className="text-xs">Отклики</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col items-center gap-1 py-3">
              <Icon name="Settings" size={20} />
              <span className="text-xs">Настройки</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="bookings">
            <AdminBookings />
          </TabsContent>

          <TabsContent value="ads">
            <AdminAds />
          </TabsContent>

          <TabsContent value="applications">
            <AdminWorkApplications />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};