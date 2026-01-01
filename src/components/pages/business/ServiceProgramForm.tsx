import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { ServiceProgram, ServiceUnit, Currency } from '@/types';

interface ServiceProgramFormProps {
  programs: ServiceProgram[];
  onAddProgram: (program: Omit<ServiceProgram, 'id'>) => void;
  onEditProgram: (id: string, program: Omit<ServiceProgram, 'id'>) => void;
  onDeleteProgram: (id: string) => void;
  maxPrograms?: number;
}

const unitLabels: Record<ServiceUnit, string> = {
  hour: 'Час',
  minute: 'Минута',
  time: 'Раз',
  piece: 'Шт',
  night: 'Ночь',
};

export const ServiceProgramForm = ({
  programs,
  onAddProgram,
  onEditProgram,
  onDeleteProgram,
  maxPrograms = 10,
}: ServiceProgramFormProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: 'hour' as ServiceUnit,
    price: '',
    currency: 'RUB' as Currency,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      unit: 'hour',
      price: '',
      currency: 'RUB',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
      return;
    }

    const programData = {
      name: formData.name,
      description: formData.description,
      unit: formData.unit,
      price: parseFloat(formData.price),
      currency: formData.currency,
    };

    if (editingId) {
      onEditProgram(editingId, programData);
    } else {
      onAddProgram(programData);
    }

    resetForm();
  };

  const handleEdit = (program: ServiceProgram) => {
    setEditingId(program.id);
    setFormData({
      name: program.name,
      description: program.description,
      unit: program.unit,
      price: program.price.toString(),
      currency: program.currency,
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Программы услуг</h3>
          <p className="text-sm text-muted-foreground">
            Добавлено {programs.length} из {maxPrograms} программ
          </p>
        </div>
        {!showForm && programs.length < maxPrograms && (
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            size="sm"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить программу
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-2 border-pink-200 dark:border-pink-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Icon name="Zap" size={20} className="text-pink-600" />
              {editingId ? 'Редактировать программу' : 'Новая программа'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="program-name">Название программы *</Label>
              <Input
                id="program-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Базовый, Стандарт, Премиум"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program-description">Описание</Label>
              <Textarea
                id="program-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Опишите что входит в эту программу"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="program-unit">Единица измерения</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value as ServiceUnit })}
                >
                  <SelectTrigger id="program-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(unitLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="program-price">Цена *</Label>
                <Input
                  id="program-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="program-currency">Валюта</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value as Currency })}
                >
                  <SelectTrigger id="program-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RUB">₽ RUB</SelectItem>
                    <SelectItem value="USD">$ USD</SelectItem>
                    <SelectItem value="EUR">€ EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600"
                disabled={!formData.name || !formData.price}
              >
                <Icon name="Save" size={16} className="mr-2" />
                {editingId ? 'Сохранить' : 'Добавить'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {programs.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Icon name="Zap" size={40} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Пока нет добавленных программ</p>
            </CardContent>
          </Card>
        ) : (
          programs.map((program) => (
            <Card key={program.id} className="border-l-4 border-l-pink-500">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{program.name}</h4>
                    {program.description && (
                      <p className="text-sm text-muted-foreground mt-1">{program.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-lg font-bold text-pink-600">
                        {program.price.toLocaleString()} {program.currency}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {unitLabels[program.unit]}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(program)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteProgram(program.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
