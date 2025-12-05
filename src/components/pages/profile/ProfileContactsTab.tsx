import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { ProfileContacts, Currency } from '@/types';

interface ProfileContactsTabProps {
  contacts?: ProfileContacts;
  onContactsUpdate?: (updatedContacts: ProfileContacts) => void;
}

const defaultContacts: ProfileContacts = {
  instagram: { value: '', forSale: false },
  telegram: { value: '', forSale: false },
  phone: { value: '', forSale: false },
};

export const ProfileContactsTab = ({ contacts, onContactsUpdate }: ProfileContactsTabProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileContacts>(() => {
    const initialContacts = contacts || defaultContacts;
    return {
      instagram: { value: initialContacts.instagram?.value || '', forSale: initialContacts.instagram?.forSale || false },
      telegram: { value: initialContacts.telegram?.value || '', forSale: initialContacts.telegram?.forSale || false },
      phone: { value: initialContacts.phone?.value || '', forSale: initialContacts.phone?.forSale || false },
    };
  });

  const handleSave = () => {
    onContactsUpdate?.(formData);
    setIsEditing(false);
    toast({
      title: "Контакты сохранены",
      description: "Ваши контактные данные успешно обновлены",
    });
  };

  const handleContactChange = (
    type: 'instagram' | 'telegram' | 'phone',
    field: 'value' | 'forSale',
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      }
    }));
  };

  const handlePriceChange = (
    type: 'instagram' | 'telegram' | 'phone',
    field: 'amount' | 'currency',
    value: number | Currency
  ) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        price: {
          amount: field === 'amount' ? (value as number) : (prev[type]?.price?.amount || 0),
          currency: field === 'currency' ? (value as Currency) : (prev[type]?.price?.currency || 'RUB'),
        }
      }
    }));
  };

  const contactFields = [
    {
      key: 'instagram' as const,
      label: 'Instagram',
      icon: 'Instagram',
      placeholder: '@username',
      description: 'Ваш Instagram аккаунт'
    },
    {
      key: 'telegram' as const,
      label: 'Telegram',
      icon: 'Send',
      placeholder: '@username',
      description: 'Ваш Telegram аккаунт'
    },
    {
      key: 'phone' as const,
      label: 'Телефон',
      icon: 'Phone',
      placeholder: '+7 (999) 123-45-67',
      description: 'Ваш номер телефона'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Контактные данные</CardTitle>
            <CardDescription>Управляйте своими контактами и установите цену за доступ</CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Icon name="Edit" size={16} className="mr-2" />
              Редактировать
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Отмена
              </Button>
              <Button onClick={handleSave}>
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {contactFields.map((field) => {
          const contact = formData[field.key];
          
          return (
            <div key={field.key} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={field.icon as any} size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{field.label}</h3>
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor={`${field.key}-value`}>Контакт</Label>
                  <Input
                    id={`${field.key}-value`}
                    value={contact?.value || ''}
                    onChange={(e) => handleContactChange(field.key, 'value', e.target.value)}
                    placeholder={field.placeholder}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="DollarSign" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Продавать контакт</p>
                      <p className="text-xs text-muted-foreground">Покупатели смогут приобрести доступ</p>
                    </div>
                  </div>
                  <Switch
                    checked={contact?.forSale || false}
                    onCheckedChange={(checked) => handleContactChange(field.key, 'forSale', checked)}
                    disabled={!isEditing}
                  />
                </div>

                {contact?.forSale && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div>
                      <Label htmlFor={`${field.key}-amount`} className="text-xs">Цена</Label>
                      <Input
                        id={`${field.key}-amount`}
                        type="number"
                        value={contact.price?.amount || 0}
                        onChange={(e) => handlePriceChange(field.key, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        disabled={!isEditing}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${field.key}-currency`} className="text-xs">Валюта</Label>
                      <Select
                        value={contact.price?.currency || 'RUB'}
                        onValueChange={(value) => handlePriceChange(field.key, 'currency', value as Currency)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id={`${field.key}-currency`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RUB">₽ RUB</SelectItem>
                          <SelectItem value="USD">$ USD</SelectItem>
                          <SelectItem value="TON">TON</SelectItem>
                          <SelectItem value="USDT">USDT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {!isEditing && contact?.value && (
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Check" size={14} className="text-green-600" />
                  <span className="text-green-600">Контакт указан</span>
                  {contact.forSale && contact.price && (
                    <span className="ml-auto font-semibold text-primary">
                      {contact.price.amount} {contact.price.currency}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex gap-3">
            <Icon name="Info" size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-900 dark:text-blue-100">О продаже контактов</p>
              <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Покупатели увидят кнопку "Купить контакт" в вашем профиле</li>
                <li>• После оплаты контакт станет доступен покупателю</li>
                <li>• Вы получите уведомление о каждой покупке</li>
                <li>• Деньги поступят на ваш баланс автоматически</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};