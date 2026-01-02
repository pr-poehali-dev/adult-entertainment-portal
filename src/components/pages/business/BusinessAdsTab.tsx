import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { BusinessService, ServiceCategory } from '@/types';
import { DynamicServiceForm } from '@/components/business/DynamicServiceForm';
import { getTemplateByCategory } from '@/data/serviceTemplates';

interface BusinessAdsTabProps {
  businessServices: BusinessService[];
  serviceCategories: ServiceCategory[];
  showServiceForm: boolean;
  editingService: BusinessService | null;
  selectedCategoryId: string;
  setShowServiceForm: (show: boolean) => void;
  setEditingService: (service: BusinessService | null) => void;
  setSelectedCategoryId: (id: string) => void;
  handleEditService: (service: BusinessService) => void;
  handleToggleStatus: (id: string) => void;
  handleDeleteService: (id: string) => void;
  onServiceFormSubmit: (data: Record<string, any>) => void;
  onServiceFormCancel: () => void;
}

export const BusinessAdsTab = ({
  businessServices,
  serviceCategories,
  showServiceForm,
  editingService,
  selectedCategoryId,
  setShowServiceForm,
  setEditingService,
  setSelectedCategoryId,
  handleEditService,
  handleToggleStatus,
  handleDeleteService,
  onServiceFormSubmit,
  onServiceFormCancel,
}: BusinessAdsTabProps) => {
  return (
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
          }}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-12"
        >
          <Icon name="Plus" size={20} className="mr-2" />
          Создать объявление
        </Button>
      )}

      {showServiceForm && !selectedCategoryId && (
        <Card className="border-2 border-pink-200 dark:border-pink-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Megaphone" size={24} className="text-pink-600" />
              {editingService ? 'Редактировать объявление' : 'Новое объявление'}
            </CardTitle>
            <CardDescription>
              Выберите категорию услуги для начала
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
            <Button
              variant="outline"
              onClick={onServiceFormCancel}
            >
              Отмена
            </Button>
          </CardContent>
        </Card>
      )}

      {showServiceForm && selectedCategoryId && (() => {
        const template = getTemplateByCategory(selectedCategoryId);
        if (template) {
          return (
            <DynamicServiceForm
              template={template}
              initialData={editingService?.formData || {}}
              onSubmit={onServiceFormSubmit}
              onCancel={onServiceFormCancel}
            />
          );
        }

        return (
          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="AlertTriangle" size={24} className="text-orange-600" />
                Шаблон не найден
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Для этой категории пока нет готового шаблона. Обратитесь к администратору.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setShowServiceForm(false);
                  setSelectedCategoryId('');
                }}
              >
                Назад
              </Button>
            </CardContent>
          </Card>
        );
      })()}

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
                      {service.programs?.length || 0} {(service.programs?.length || 0) === 1 ? 'программа' : (service.programs?.length || 0) < 5 ? 'программы' : 'программ'}
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

                {service.programs && service.programs.length > 0 && (
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
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
};
