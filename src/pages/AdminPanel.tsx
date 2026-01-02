import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminBalanceTab } from '@/components/admin/AdminBalanceTab';
import { AdminUsersTab } from '@/components/admin/AdminUsersTab';
import { AdminServicesTab } from '@/components/admin/AdminServicesTab';
import { AdminTransactionsTab } from '@/components/admin/AdminTransactionsTab';
import { AdminSellersTab } from '@/components/admin/AdminSellersTab';
import { AdminClientsTab } from '@/components/admin/AdminClientsTab';
import { AdminAdsManagement } from '@/components/admin/AdminAdsManagement';
import { AdminMessaging } from '@/components/admin/AdminMessaging';
import { AdminPricingSettings } from '@/components/admin/AdminPricingSettings';
import { AdminServicesManager } from '@/components/admin/AdminServicesManager';
import { AdminAuthWrapper } from './admin/AdminAuthWrapper';
import { AdminDataProvider } from './admin/AdminDataProvider';
import { AdminHandlers } from './admin/AdminHandlers';

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <AdminAuthWrapper>
      {({ handleLogout }) => (
        <AdminDataProvider>
          {(data) => (
            <AdminHandlers data={data}>
              {(handlers) => (
                <div className="min-h-screen bg-background">
                  <div className="border-b bg-card">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                          <Icon name="Shield" size={20} className="text-white" />
                        </div>
                        <div>
                          <h1 className="text-xl font-bold">Админ-панель</h1>
                          <p className="text-sm text-muted-foreground">Управление платформой</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={() => navigate('/')}>
                          <Icon name="Home" size={18} className="mr-2" />
                          На сайт
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                          <Icon name="LogOut" size={18} className="mr-2" />
                          Выйти
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="container mx-auto px-4 py-8">
                    <AdminStats stats={data.stats} />

                    <Tabs defaultValue="clients" className="w-full">
                      <TabsList className="grid w-full grid-cols-8">
                        <TabsTrigger value="clients">
                          <Icon name="Users" size={16} className="mr-2" />
                          Клиенты
                        </TabsTrigger>
                        <TabsTrigger value="services">
                          <Icon name="Briefcase" size={16} className="mr-2" />
                          Услуги
                        </TabsTrigger>
                        <TabsTrigger value="ads">
                          <Icon name="Package" size={16} className="mr-2" />
                          Объявления
                        </TabsTrigger>
                        <TabsTrigger value="messaging">
                          <Icon name="MessageSquare" size={16} className="mr-2" />
                          Сообщения
                        </TabsTrigger>
                        <TabsTrigger value="pricing">
                          <Icon name="DollarSign" size={16} className="mr-2" />
                          Цены
                        </TabsTrigger>
                        <TabsTrigger value="moderation">
                          <Icon name="FileCheck" size={16} className="mr-2" />
                          Модерация
                        </TabsTrigger>
                        <TabsTrigger value="finances">
                          <Icon name="Wallet" size={16} className="mr-2" />
                          Финансы
                        </TabsTrigger>
                        <TabsTrigger value="sellers">
                          <Icon name="Store" size={16} className="mr-2" />
                          Продавцы
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="clients" className="mt-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold">База клиентов</h2>
                          <AdminClientsTab 
                            clients={data.clients} 
                            onBlockClient={handlers.blockClient}
                            onUpdateBalance={handlers.updateClientBalance}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="services" className="mt-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold">Управление категориями услуг</h2>
                          <AdminServicesManager
                            categories={data.serviceCategories}
                            onAddCategory={handlers.addServiceCategory}
                            onEditCategory={handlers.editServiceCategory}
                            onDeleteCategory={handlers.deleteServiceCategory}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="ads" className="mt-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold">Управление объявлениями</h2>
                          <AdminAdsManagement 
                            ads={data.ads}
                            onCreateAd={handlers.createAd}
                            onDeleteAd={handlers.deleteAd}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="messaging" className="mt-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold">Сообщения клиентам</h2>
                          <AdminMessaging 
                            users={data.clients}
                            messages={data.adminMessages}
                            onSendMessage={handlers.sendMessageToUser}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="pricing" className="mt-6">
                        <div className="space-y-6">
                          <AdminPricingSettings 
                            prices={data.prices}
                            onUpdatePrices={handlers.updatePrices}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="balance" className="mt-6">
                        <AdminBalanceTab
                          platformBalances={data.platformBalances}
                          balanceTransactions={data.balanceTransactions}
                        />
                      </TabsContent>

                      <TabsContent value="moderation" className="mt-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold">Модерация</h2>
                          <Tabs defaultValue="profiles" className="w-full">
                            <TabsList>
                              <TabsTrigger value="profiles">Анкеты</TabsTrigger>
                              <TabsTrigger value="ads">Объявления</TabsTrigger>
                            </TabsList>
                            <TabsContent value="profiles" className="mt-4">
                              <AdminUsersTab users={data.users} blockUser={handlers.blockUser} />
                            </TabsContent>
                            <TabsContent value="ads" className="mt-4">
                              <AdminServicesTab services={data.services} approveService={handlers.approveService} />
                            </TabsContent>
                          </Tabs>
                        </div>
                      </TabsContent>

                      <TabsContent value="finances" className="mt-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold">Финансы</h2>
                          <AdminBalanceTab 
                            platformBalances={data.platformBalances} 
                            balanceTransactions={data.balanceTransactions} 
                          />
                          <AdminTransactionsTab transactions={data.transactions} />
                        </div>
                      </TabsContent>

                      <TabsContent value="sellers" className="mt-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold">Продавцы</h2>
                          <AdminSellersTab 
                            sellers={data.sellers} 
                            onBlockSeller={handlers.blockSeller}
                            onUpdateBalance={handlers.updateSellerBalance}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}
            </AdminHandlers>
          )}
        </AdminDataProvider>
      )}
    </AdminAuthWrapper>
  );
};

export default AdminPanel;