export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: ServiceSubcategory[];
}

export interface ServiceSubcategory {
  id: string;
  name: string;
  icon: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'escort',
    name: 'Эскорт сопровождение',
    icon: 'Users',
    subcategories: []
  },
  {
    id: 'dinner',
    name: 'Вечерний ужин',
    icon: 'UtensilsCrossed',
    subcategories: []
  },
  {
    id: 'massage',
    name: 'Массаж',
    icon: 'Hand',
    subcategories: []
  },
  {
    id: 'real-meeting',
    name: 'Реальная встреча',
    icon: 'MapPin',
    subcategories: [
      { id: 'outcall', name: 'Выезд', icon: 'Car' },
      { id: 'apartment', name: 'Апартаменты', icon: 'Home' }
    ]
  },
  {
    id: 'virtual',
    name: 'Виртуальный секс',
    icon: 'Smartphone',
    subcategories: [
      { id: 'audio', name: 'Аудиоразговор', icon: 'Phone' },
      { id: 'chat', name: 'Онлайн переписка', icon: 'MessageCircle' },
      { id: 'video', name: 'Видео звонок', icon: 'Video' }
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