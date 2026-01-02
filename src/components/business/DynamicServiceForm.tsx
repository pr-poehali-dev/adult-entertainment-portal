import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { ServiceTemplate, ServiceFormField, ServiceProgram, Currency } from '@/types';

interface DynamicServiceFormProps {
  template: ServiceTemplate;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
}

export const DynamicServiceForm = ({ 
  template, 
  initialData = {}, 
  onSubmit, 
  onCancel 
}: DynamicServiceFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [programs, setPrograms] = useState<ServiceProgram[]>(initialData.programs || []);
  const [images, setImages] = useState<string[]>(initialData.images || []);

  useEffect(() => {
    const defaultValues: Record<string, any> = {};
    template.fields.forEach(field => {
      if (field.defaultValue !== undefined && !formData[field.id]) {
        defaultValues[field.id] = field.defaultValue;
      }
    });
    if (Object.keys(defaultValues).length > 0) {
      setFormData(prev => ({ ...prev, ...defaultValues }));
    }
  }, [template]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleAddProgram = () => {
    const newProgram: ServiceProgram = {
      id: Date.now().toString(),
      name: '',
      description: '',
      unit: 'hour',
      price: 0,
      currency: 'RUB',
    };
    setPrograms([...programs, newProgram]);
  };

  const handleProgramChange = (index: number, field: keyof ServiceProgram, value: any) => {
    const updated = [...programs];
    updated[index] = { ...updated[index], [field]: value };
    setPrograms(updated);
  };

  const handleRemoveProgram = (index: number) => {
    setPrograms(programs.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    const url = prompt('Введите URL изображения:');
    if (url) {
      setImages([...images, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    for (const field of template.fields) {
      if (field.required) {
        const value = formData[field.id];
        if (field.type === 'programs' && programs.length === 0) {
          toast({
            title: 'Ошибка',
            description: `Добавьте хотя бы одну программу`,
            variant: 'destructive',
          });
          return;
        }
        if (field.type === 'images' && images.length === 0) {
          toast({
            title: 'Ошибка',
            description: `Загрузите хотя бы одно изображение`,
            variant: 'destructive',
          });
          return;
        }
        if (!value && field.type !== 'programs' && field.type !== 'images') {
          toast({
            title: 'Ошибка',
            description: `Поле "${field.label}" обязательно для заполнения`,
            variant: 'destructive',
          });
          return;
        }
      }
    }

    const submitData = {
      ...formData,
      programs: programs.length > 0 ? programs : undefined,
      images: images.length > 0 ? images : undefined,
    };

    onSubmit(submitData);
  };

  const renderField = (field: ServiceFormField) => {
    const value = formData[field.id];

    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.id}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
          />
        );

      case 'number':
      case 'price':
      case 'duration':
        return (
          <Input
            id={field.id}
            type="number"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case 'phone':
        return (
          <Input
            id={field.id}
            type="tel"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case 'address':
        return (
          <Textarea
            id={field.id}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={2}
          />
        );

      case 'date':
        return (
          <Input
            id={field.id}
            type="date"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      case 'time':
        return (
          <Input
            id={field.id}
            type="time"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
          >
            <SelectTrigger id={field.id}>
              <SelectValue placeholder={field.placeholder || 'Выберите...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const selected = Array.isArray(value) ? value : [];
              return (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option.value}`}
                    checked={selected.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleFieldChange(field.id, [...selected, option.value]);
                      } else {
                        handleFieldChange(field.id, selected.filter((v: string) => v !== option.value));
                      }
                    }}
                  />
                  <label
                    htmlFor={`${field.id}-${option.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              );
            })}
          </div>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                <label
                  htmlFor={`${field.id}-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
            <label
              htmlFor={field.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        );

      case 'images':
        return (
          <div className="space-y-3">
            <Button type="button" onClick={handleAddImage} variant="outline" className="w-full">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить изображение
            </Button>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={img} 
                      alt={`Image ${index + 1}`} 
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'programs':
        return (
          <div className="space-y-3">
            <Button type="button" onClick={handleAddProgram} variant="outline" className="w-full">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить программу
            </Button>
            {programs.map((program, index) => (
              <Card key={program.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Программа {index + 1}</h4>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveProgram(index)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Название программы"
                    value={program.name}
                    onChange={(e) => handleProgramChange(index, 'name', e.target.value)}
                    required
                  />
                  <Textarea
                    placeholder="Описание программы"
                    value={program.description}
                    onChange={(e) => handleProgramChange(index, 'description', e.target.value)}
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Цена"
                      value={program.price}
                      onChange={(e) => handleProgramChange(index, 'price', Number(e.target.value))}
                      required
                    />
                    <Select
                      value={program.unit}
                      onValueChange={(val) => handleProgramChange(index, 'unit', val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hour">за час</SelectItem>
                        <SelectItem value="minute">за минуту</SelectItem>
                        <SelectItem value="time">за раз</SelectItem>
                        <SelectItem value="piece">за штуку</SelectItem>
                        <SelectItem value="night">за ночь</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      default:
        return <p className="text-sm text-muted-foreground">Неподдерживаемый тип поля: {field.type}</p>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Заполните данные услуги</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {template.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              {field.type !== 'checkbox' && (
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              )}
              {renderField(field)}
              {field.helpText && (
                <p className="text-xs text-muted-foreground">{field.helpText}</p>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить услугу
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
