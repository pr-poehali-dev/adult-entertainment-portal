export interface ServiceCategory {
  id: string;
  name: string;
  subcategories: ServiceSubcategory[];
}

export interface ServiceSubcategory {
  id: string;
  name: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'escort',
    name: 'Эскорт сопровождение',
    subcategories: []
  },
  {
    id: 'dinner',
    name: 'Вечерний ужин',
    subcategories: []
  },
  {
    id: 'massage',
    name: 'Массаж',
    subcategories: []
  },
  {
    id: 'real-meeting',
    name: 'Реальная встреча',
    subcategories: [
      { id: 'outcall', name: 'Выезд' },
      { id: 'apartment', name: 'Апартаменты' }
    ]
  },
  {
    id: 'virtual',
    name: 'Виртуальный секс',
    subcategories: [
      { id: 'audio', name: 'Аудиоразговор' },
      { id: 'chat', name: 'Онлайн переписка' },
      { id: 'video', name: 'Видео звонок' }
    ]
  }
];

export const getAllServices = (): string[] => {
  const services: string[] = [];
  serviceCategories.forEach(category => {
    services.push(category.name);
    category.subcategories.forEach(sub => {
      services.push(`${category.name}: ${sub.name}`);
    });
  });
  return services;
};
