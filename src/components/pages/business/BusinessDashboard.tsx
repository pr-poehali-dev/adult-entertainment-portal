import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { BusinessType, BusinessService, ServiceProgram } from '@/types';
import { BusinessVerification, BusinessVerificationData } from './BusinessVerification';
import { BusinessBottomNav } from './BusinessBottomNav';
import { BusinessAdsTab } from './BusinessAdsTab';
import { BusinessProfileTab } from './BusinessProfileTab';
import { BusinessOtherTabs } from './BusinessOtherTabs';
import { useBusinessServices } from '@/contexts/BusinessServicesContext';
import { useServiceCategories } from '@/contexts/ServiceCategoriesContext';

type BusinessNavTab = 'services' | 'profile' | 'messages' | 'ads' | 'balance' | 'settings' | 'notifications';

interface BusinessDashboardProps {
  businessType: BusinessType;
  onBack: () => void;
}

export const BusinessDashboard = ({ businessType, onBack }: BusinessDashboardProps) => {
  const { toast } = useToast();
  const { businessServices, addBusinessService, updateBusinessService, deleteBusinessService } = useBusinessServices();
  const { serviceCategories } = useServiceCategories();
  const [isVerified, setIsVerified] = useState(false);
  const [verificationData, setVerificationData] = useState<BusinessVerificationData | null>(null);
  const [activeTab, setActiveTab] = useState<BusinessNavTab>('ads');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<BusinessService | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [currentPrograms, setCurrentPrograms] = useState<ServiceProgram[]>([]);

  const handleVerificationComplete = (data: BusinessVerificationData) => {
    setVerificationData(data);
    setIsVerified(true);
  };

  if (!isVerified) {
    return <BusinessVerification businessType={businessType} onComplete={handleVerificationComplete} />;
  }

  const handleAddProgram = (programData: Omit<ServiceProgram, 'id'>) => {
    if (currentPrograms.length >= 10) {
      toast({
        title: "Ошибка",
        description: "Максимум 10 программ на одну услугу",
        variant: "destructive",
      });
      return;
    }

    const newProgram: ServiceProgram = {
      ...programData,
      id: Date.now().toString(),
    };

    setCurrentPrograms([...currentPrograms, newProgram]);
    toast({
      title: "Программа добавлена",
      description: "Новая программа успешно создана",
    });
  };

  const handleEditProgram = (id: string, programData: Omit<ServiceProgram, 'id'>) => {
    setCurrentPrograms(currentPrograms.map(p => p.id === id ? { ...programData, id } : p));
    toast({
      title: "Программа обновлена",
      description: "Изменения успешно сохранены",
    });
  };

  const handleDeleteProgram = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту программу?')) {
      setCurrentPrograms(currentPrograms.filter(p => p.id !== id));
      toast({
        title: "Программа удалена",
        description: "Программа успешно удалена",
      });
    }
  };

  const handleSaveService = () => {
    if (!selectedCategoryId) {
      toast({
        title: "Ошибка",
        description: "Выберите категорию услуги",
        variant: "destructive",
      });
      return;
    }

    if (currentPrograms.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы одну программу",
        variant: "destructive",
      });
      return;
    }

    const category = serviceCategories.find(c => c.id === selectedCategoryId);
    if (!category) return;

    const newService: BusinessService = {
      id: Date.now().toString(),
      categoryId: selectedCategoryId,
      categoryName: category.name,
      programs: currentPrograms,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    if (editingService) {
      const updatedService = { ...newService, id: editingService.id, status: editingService.status };
      updateBusinessService(editingService.id, updatedService);
      toast({
        title: "Объявление обновлено",
        description: "Изменения успешно сохранены",
      });
    } else {
      addBusinessService(newService);
      toast({
        title: "Объявление создано",
        description: "Новое объявление добавлено в черновики",
      });
    }

    setShowServiceForm(false);
    setEditingService(null);
    setSelectedCategoryId('');
    setCurrentPrograms([]);
  };

  const handleEditService = (service: BusinessService) => {
    setEditingService(service);
    setSelectedCategoryId(service.categoryId);
    setCurrentPrograms(service.programs || []);
    setShowServiceForm(true);
    setActiveTab('ads');
  };

  const handleToggleStatus = (id: string) => {
    const service = businessServices.find(s => s.id === id);
    if (service) {
      const newStatus = service.status === 'active' ? 'paused' : 'active';
      updateBusinessService(id, { ...service, status: newStatus });
      toast({
        title: newStatus === 'active' ? "Объявление активировано" : "Объявление приостановлено",
        description: newStatus === 'active' ? "Объявление опубликовано" : "Объявление скрыто из каталога",
      });
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это объявление?')) {
      deleteBusinessService(id);
      toast({
        title: "Объявление удалено",
        description: "Объявление успешно удалено",
      });
    }
  };

  const handleServiceFormSubmit = (data: Record<string, any>) => {
    const category = serviceCategories.find(c => c.id === selectedCategoryId);
    if (!category) return;

    const newService: BusinessService = {
      id: editingService?.id || Date.now().toString(),
      categoryId: selectedCategoryId,
      categoryName: category.name,
      title: data.title,
      description: data.description,
      images: data.images,
      programs: data.programs,
      formData: data,
      status: editingService?.status || 'draft',
      createdAt: editingService?.createdAt || new Date().toISOString(),
    };

    if (editingService) {
      updateBusinessService(editingService.id, newService);
      toast({
        title: "Объявление обновлено",
        description: "Изменения успешно сохранены",
      });
    } else {
      addBusinessService(newService);
      toast({
        title: "Объявление создано",
        description: "Новое объявление добавлено в черновики",
      });
    }

    setShowServiceForm(false);
    setEditingService(null);
    setSelectedCategoryId('');
    setCurrentPrograms([]);
  };

  const handleServiceFormCancel = () => {
    setShowServiceForm(false);
    setEditingService(null);
    setSelectedCategoryId('');
    setCurrentPrograms([]);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Card className="border-b rounded-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div>
                <CardTitle>Бизнес-кабинет</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {businessType === 'organization' ? 'Организация' : 'Частное лицо'}
                </p>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Icon name="Building2" size={24} className="text-white" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BusinessNavTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="ads">
              <Icon name="Megaphone" size={16} className="mr-2" />
              Объявления
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="balance">
              <Icon name="Wallet" size={16} className="mr-2" />
              Баланс
            </TabsTrigger>
            <TabsTrigger value="messages">
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Сообщения
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ads" className="space-y-6">
            <BusinessAdsTab
              businessServices={businessServices}
              serviceCategories={serviceCategories}
              showServiceForm={showServiceForm}
              editingService={editingService}
              selectedCategoryId={selectedCategoryId}
              setShowServiceForm={setShowServiceForm}
              setEditingService={setEditingService}
              setSelectedCategoryId={setSelectedCategoryId}
              handleEditService={handleEditService}
              handleToggleStatus={handleToggleStatus}
              handleDeleteService={handleDeleteService}
              onServiceFormSubmit={handleServiceFormSubmit}
              onServiceFormCancel={handleServiceFormCancel}
            />
          </TabsContent>

          <TabsContent value="profile">
            <BusinessProfileTab
              businessType={businessType}
              verificationData={verificationData}
            />
          </TabsContent>

          <TabsContent value="balance">
            <BusinessOtherTabs activeTab={activeTab} />
          </TabsContent>

          <TabsContent value="messages">
            <BusinessOtherTabs activeTab={activeTab} />
          </TabsContent>

          <TabsContent value="settings">
            <BusinessOtherTabs activeTab={activeTab} />
          </TabsContent>

          <TabsContent value="notifications">
            <BusinessOtherTabs activeTab={activeTab} />
          </TabsContent>
        </Tabs>
      </div>

      <BusinessBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
