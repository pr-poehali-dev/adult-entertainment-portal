import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { BusinessType } from '@/types';
import { BusinessVerification, BusinessVerificationData } from './BusinessVerification';
import { BusinessBottomNav } from './BusinessBottomNav';

type BusinessNavTab = 'services' | 'profile' | 'messages' | 'ads' | 'balance' | 'settings' | 'notifications';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  status: 'active' | 'draft' | 'paused';
  createdAt: string;
}

interface BusinessDashboardProps {
  businessType: BusinessType;
  onBack: () => void;
}

export const BusinessDashboard = ({ businessType, onBack }: BusinessDashboardProps) => {
  const { toast } = useToast();
  const [isVerified, setIsVerified] = useState(false);
  const [verificationData, setVerificationData] = useState<BusinessVerificationData | null>(null);
  const [activeTab, setActiveTab] = useState<BusinessNavTab>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'RUB',
    category: '',
  });

  const handleVerificationComplete = (data: BusinessVerificationData) => {
    setVerificationData(data);
    setIsVerified(true);
  };

  if (!isVerified) {
    return <BusinessVerification businessType={businessType} onComplete={handleVerificationComplete} />;
  }

  const handleAddService = () => {
    if (!formData.title || !formData.price) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
        variant: "destructive",
      });
      return;
    }

    const newService: Service = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      currency: formData.currency,
      category: formData.category,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...newService, id: editingService.id } : s));
      toast({
        title: "Услуга обновлена",
        description: "Изменения успешно сохранены",
      });
    } else {
      setServices([...services, newService]);
      toast({
        title: "Услуга добавлена",
        description: "Новая услуга создана в черновиках",
      });
    }

    setFormData({ title: '', description: '', price: '', currency: 'RUB', category: '' });
    setShowServiceForm(false);
    setEditingService(null);
  };

  const handleEditService = (service: Service) => {
    setActiveTab('services');
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price.toString(),
      currency: service.currency,
      category: service.category,
    });
    setShowServiceForm(true);
  };

  const handleToggleStatus = (id: string) => {
    setServices(services.map(s => {
      if (s.id === id) {
        const newStatus = s.status === 'active' ? 'paused' : 'active';
        toast({
          title: newStatus === 'active' ? "Услуга активирована" : "Услуга приостановлена",
          description: newStatus === 'active' ? "Услуга доступна для заказа" : "Услуга скрыта из каталога",
        });
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
      setServices(services.filter(s => s.id !== id));
      toast({
        title: "Услуга удалена",
        description: "Услуга успешно удалена",
      });
    }
  };

  const renderServicesTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего услуг</p>
                <p className="text-3xl font-bold">{services.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
                <Icon name="Package" size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активные</p>
                <p className="text-3xl font-bold">{services.filter(s => s.status === 'active').length}</p>
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
                <p className="text-3xl font-bold">{services.filter(s => s.status === 'draft').length}</p>
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
            setFormData({ title: '', description: '', price: '', currency: 'RUB', category: '' });
          }}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-12"
        >
          <Icon name="Plus" size={20} className="mr-2" />
          Добавить услугу
        </Button>
      )}

      {showServiceForm && (
        <Card className="border-2 border-pink-200 dark:border-pink-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="PlusCircle" size={24} className="text-pink-600" />
              {editingService ? 'Редактировать услугу' : 'Новая услуга'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название услуги *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Например: Массаж, Консультация, Доставка"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Подробное описание вашей услуги"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Цена *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Валюта</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RUB">₽ RUB</SelectItem>
                    <SelectItem value="USD">$ USD</SelectItem>
                    <SelectItem value="EUR">€ EUR</SelectItem>
                    <SelectItem value="TON">TON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Например: Красота, Здоровье, Бизнес"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddService} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600">
                <Icon name="Save" size={16} className="mr-2" />
                {editingService ? 'Сохранить' : 'Добавить'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowServiceForm(false);
                  setEditingService(null);
                  setFormData({ title: '', description: '', price: '', currency: 'RUB', category: '' });
                }}
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {services.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Пока нет добавленных услуг</p>
              <p className="text-sm text-muted-foreground mt-2">Создайте первую услугу, чтобы начать работу</p>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id} className={service.status === 'active' ? 'border-green-200 dark:border-green-800' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' :
                        service.status === 'paused' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {service.status === 'active' ? 'Активна' : service.status === 'paused' ? 'Приостановлена' : 'Черновик'}
                      </span>
                    </div>
                    {service.description && (
                      <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-semibold text-pink-600 dark:text-pink-400">
                        {service.price} {service.currency}
                      </span>
                      {service.category && (
                        <span className="text-muted-foreground">• {service.category}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditService(service)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant={service.status === 'active' ? 'secondary' : 'default'}
                      onClick={() => handleToggleStatus(service.id)}
                      disabled={service.status === 'draft'}
                    >
                      <Icon name={service.status === 'active' ? 'Pause' : 'Play'} size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
                {service.status === 'draft' && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      size="sm"
                      onClick={() => handleToggleStatus(service.id)}
                      className="bg-gradient-to-r from-green-500 to-green-600"
                    >
                      <Icon name="CheckCircle" size={16} className="mr-2" />
                      Опубликовать услугу
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );

  const renderProfileTab = () => (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon name="User" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Раздел "Мой профиль" в разработке</p>
      </CardContent>
    </Card>
  );

  const renderMessagesTab = () => (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon name="MessageSquare" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Раздел "Мои сообщения" в разработке</p>
      </CardContent>
    </Card>
  );

  const renderAdsTab = () => (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon name="Megaphone" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Раздел "Мои объявления" в разработке</p>
      </CardContent>
    </Card>
  );

  const renderBalanceTab = () => (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon name="Wallet" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Раздел "Мой баланс" в разработке</p>
      </CardContent>
    </Card>
  );

  const renderSettingsTab = () => (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon name="Settings" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Раздел "Настройки" в разработке</p>
      </CardContent>
    </Card>
  );

  const renderNotificationsTab = () => (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon name="Bell" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Раздел "Уведомления" в разработке</p>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'services':
        return renderServicesTab();
      case 'profile':
        return renderProfileTab();
      case 'messages':
        return renderMessagesTab();
      case 'ads':
        return renderAdsTab();
      case 'balance':
        return renderBalanceTab();
      case 'settings':
        return renderSettingsTab();
      case 'notifications':
        return renderNotificationsTab();
      default:
        return renderServicesTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Briefcase" size={28} />
                  Личный кабинет бизнеса
                </CardTitle>
                <CardDescription className="text-white/80 mt-2">
                  {businessType === 'organization' ? 'Организация' : 'Частное лицо'} • {
                    activeTab === 'services' ? 'Управление услугами' :
                    activeTab === 'profile' ? 'Мой профиль' :
                    activeTab === 'messages' ? 'Мои сообщения' :
                    activeTab === 'ads' ? 'Мои объявления' :
                    activeTab === 'balance' ? 'Мой баланс' :
                    activeTab === 'settings' ? 'Настройки' :
                    'Уведомления'
                  }
                </CardDescription>
              </div>
              <Button variant="secondary" onClick={onBack}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Выход
              </Button>
            </div>
          </CardHeader>
        </Card>

        {renderContent()}
      </div>

      <BusinessBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadMessages={0}
        unreadNotifications={0}
      />
    </div>
  );
};
