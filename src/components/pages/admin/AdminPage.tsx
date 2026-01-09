import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminDashboard } from './AdminDashboard';
import { AdminUsers } from './AdminUsers';
import { AdminBookings } from './AdminBookings';
import { AdminAds } from './AdminAds';
import { AdminWorkApplications } from './AdminWorkApplications';
import { AdminSettings } from './AdminSettings';
import { AdminEmojis } from './AdminEmojis';
import { AdminAudioGreetings } from './AdminAudioGreetings';
import { AdminPhotoModeration } from './AdminPhotoModeration';
import { AdminPartnerProgram } from './AdminPartnerProgram';
import { AdminServices } from './AdminServices';
import { AdminCategories } from './AdminCategories';
import { AdminAgencies } from './AdminAgencies';
import { AdminParties } from './AdminParties';
import Icon from '@/components/ui/icon';
import { Page, Notification } from '@/types';
import { Button } from '@/components/ui/button';

interface AdminPageProps {
  setCurrentPage: (page: Page) => void;
  onAddNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
}

export const AdminPage = ({ setCurrentPage, onAddNotification }: AdminPageProps) => {
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
          <TabsList className="flex flex-col sm:grid sm:grid-cols-4 lg:grid-cols-7 w-full mb-8 h-auto p-1 gap-1">
            <TabsTrigger value="dashboard" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center">
              <Icon name="LayoutDashboard" size={20} />
              <span className="text-xs">Дашборд</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center">
              <Icon name="Layers" size={20} />
              <span className="text-xs">Услуги</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center">
              <Icon name="FolderTree" size={20} />
              <span className="text-xs">Категории</span>
            </TabsTrigger>
            <TabsTrigger value="agencies" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center">
              <Icon name="Building2" size={20} />
              <span className="text-xs">Агентства</span>
            </TabsTrigger>
            <TabsTrigger value="parties" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center">
              <Icon name="PartyPopper" size={20} />
              <span className="text-xs">Вечеринки</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center">
              <Icon name="Users" size={20} />
              <span className="text-xs">Пользователи</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center">
              <Icon name="Calendar" size={20} />
              <span className="text-xs">Бронирования</span>
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center">
              <Icon name="Megaphone" size={20} />
              <span className="text-xs">Объявления</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center relative">
              <Icon name="Volume2" size={20} />
              <span className="text-xs">Аудио</span>
              <span className="absolute top-2 right-2 sm:-top-1 sm:-right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center relative">
              <Icon name="Image" size={20} />
              <span className="text-xs">Фото</span>
              <span className="absolute top-2 right-2 sm:-top-1 sm:-right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center">
              <Icon name="Briefcase" size={20} />
              <span className="text-xs">Отклики</span>
            </TabsTrigger>
            <TabsTrigger value="partner" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center">
              <Icon name="Network" size={20} />
              <span className="text-xs">MLM</span>
            </TabsTrigger>
            <TabsTrigger value="emojis" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center">
              <Icon name="Smile" size={20} />
              <span className="text-xs">Эмодзи</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center justify-start gap-3 py-3 px-4 w-full sm:flex-col sm:justify-center">
              <Icon name="Settings" size={20} />
              <span className="text-xs">Настройки</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="services">
            <AdminServices />
          </TabsContent>

          <TabsContent value="categories">
            <AdminCategories />
          </TabsContent>

          <TabsContent value="agencies">
            <AdminAgencies />
          </TabsContent>

          <TabsContent value="parties">
            <AdminParties />
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

          <TabsContent value="audio">
            <AdminAudioGreetings onAddNotification={onAddNotification} />
          </TabsContent>

          <TabsContent value="photos">
            <AdminPhotoModeration onAddNotification={onAddNotification} />
          </TabsContent>

          <TabsContent value="applications">
            <AdminWorkApplications />
          </TabsContent>

          <TabsContent value="partner">
            <AdminPartnerProgram />
          </TabsContent>

          <TabsContent value="emojis">
            <AdminEmojis />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};