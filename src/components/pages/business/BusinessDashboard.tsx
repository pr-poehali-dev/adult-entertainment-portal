import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { BusinessType, BusinessService, ServiceProgram } from '@/types';
import { BusinessVerification, BusinessVerificationData } from './BusinessVerification';
import { BusinessBottomNav } from './BusinessBottomNav';
import { ServiceProgramForm } from './ServiceProgramForm';
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
    setCurrentPrograms(service.programs);
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

  const renderAdsTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего объявлений</p>
                <p className="text-3xl font-bold">{businessServices.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
                <Icon name="Megaphone" size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активные</p>
                <p className="text-3xl font-bold">{businessServices.filter(s => s.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Черновики</p>
                <p className="text-3xl font-bold">{businessServices.filter(s => s.status === 'draft').length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-full flex items-center justify-center">
                <Icon name="FileText" size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!showServiceForm && (
        <Button
          onClick={() => {
            setShowServiceForm(true);
            setEditingService(null);
            setSelectedCategoryId('');
            setCurrentPrograms([]);
          }}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-12"
        >
          <Icon name="Plus" size={20} className="mr-2" />
          Создать объявление
        </Button>
      )}

      {showServiceForm && (
        <Card className="border-2 border-pink-200 dark:border-pink-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Megaphone" size={24} className="text-pink-600" />
              {editingService ? 'Редактировать объявление' : 'Новое объявление'}
            </CardTitle>
            <CardDescription>
              Выберите категорию услуги и добавьте программы с ценами
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Категория услуги *</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <Icon name={category.icon as any} size={16} />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategoryId && (
              <>
                <div className="border-t pt-4">
                  <ServiceProgramForm
                    programs={currentPrograms}
                    onAddProgram={handleAddProgram}
                    onEditProgram={handleEditProgram}
                    onDeleteProgram={handleDeleteProgram}
                    maxPrograms={10}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveService}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600"
                    disabled={currentPrograms.length === 0}
                  >
                    <Icon name="Save" size={16} className="mr-2" />
                    {editingService ? 'Сохранить изменения' : 'Создать объявление'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowServiceForm(false);
                      setEditingService(null);
                      setSelectedCategoryId('');
                      setCurrentPrograms([]);
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {businessServices.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="Megaphone" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Пока нет объявлений</p>
              <p className="text-sm text-muted-foreground mt-2">Создайте первое объявление, чтобы начать получать заказы</p>
            </CardContent>
          </Card>
        ) : (
          businessServices.map((service) => (
            <Card key={service.id} className={service.status === 'active' ? 'border-green-200 dark:border-green-800' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name={serviceCategories.find(c => c.id === service.categoryId)?.icon as any} size={24} className="text-pink-600" />
                      <h3 className="text-lg font-semibold">{service.categoryName}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.status === 'active' ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300' :
                        service.status === 'paused' ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' :
                        'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
                      }`}>
                        {service.status === 'active' ? 'Активно' : service.status === 'paused' ? 'Приостановлено' : 'Черновик'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {service.programs.length} {service.programs.length === 1 ? 'программа' : service.programs.length < 5 ? 'программы' : 'программ'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditService(service)}>
                      <Icon name="Edit" size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(service.id)}>
                      <Icon name={service.status === 'active' ? 'Pause' : 'Play'} size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {service.programs.map(program => (
                    <div key={program.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{program.name}</span>
                          {program.description && (
                            <p className="text-sm text-muted-foreground mt-1">{program.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-pink-600">{program.price} {program.currency}</span>
                          <span className="text-sm text-muted-foreground ml-1">
                            / {program.unit === 'hour' ? 'час' : program.unit === 'minute' ? 'мин' : program.unit === 'time' ? 'раз' : program.unit === 'piece' ? 'шт' : 'ночь'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );

  const renderProfileTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="User" size={24} />
          Мой профиль
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Icon name="Building2" size={32} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {businessType === 'organization' ? verificationData?.companyName : 'Частное лицо'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {verificationData?.responsiblePerson.firstName} {verificationData?.responsiblePerson.lastName}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={onBack} className="w-full">
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'ads':
        return renderAdsTab();
      case 'profile':
        return renderProfileTab();
      case 'messages':
        return (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="MessageSquare" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Сообщения пока не реализованы</p>
            </CardContent>
          </Card>
        );
      case 'balance':
        return (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="Wallet" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Баланс пока не реализован</p>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="Settings" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Настройки пока не реализованы</p>
            </CardContent>
          </Card>
        );
      case 'notifications':
        return (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="Bell" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Уведомления пока не реализованы</p>
            </CardContent>
          </Card>
        );
      default:
        return renderAdsTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 pb-24">
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="Briefcase" size={28} />
              Бизнес-кабинет
            </CardTitle>
            <CardDescription className="text-white/80">
              {businessType === 'organization' ? 'Организация' : 'Частное лицо'}
            </CardDescription>
          </CardHeader>
        </Card>

        {renderContent()}
      </div>

      <BusinessBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};