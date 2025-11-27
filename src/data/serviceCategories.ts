import { Language } from '@/i18n/translations';

export interface ServiceCategory {
  id: string;
  icon: string;
  subcategories: ServiceSubcategory[];
}

export interface ServiceSubcategory {
  id: string;
  icon: string;
}

const categoryNames: Record<string, Record<Language, string>> = {
  escort: { ru: 'Эскорт сопровождение', en: 'Escort Service' },
  dinner: { ru: 'Вечерний ужин', en: 'Dinner Date' },
  massage: { ru: 'Массаж', en: 'Massage' },
  'real-meeting': { ru: 'Реальная встреча', en: 'Real Meeting' },
  virtual: { ru: 'Виртуальный секс', en: 'Virtual Sex' },
};

const subcategoryNames: Record<string, Record<Language, string>> = {
  outcall: { ru: 'Выезд', en: 'Outcall' },
  apartment: { ru: 'Апартаменты', en: 'Apartment' },
  audio: { ru: 'Аудиоразговор', en: 'Audio Call' },
  chat: { ru: 'Онлайн переписка', en: 'Online Chat' },
  video: { ru: 'Видео звонок', en: 'Video Call' },
};

export const getCategoryName = (id: string, lang: Language): string => {
  return categoryNames[id]?.[lang] || id;
};

export const getSubcategoryName = (id: string, lang: Language): string => {
  return subcategoryNames[id]?.[lang] || id;
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'escort',
    icon: 'Users',
    subcategories: []
  },
  {
    id: 'dinner',
    icon: 'UtensilsCrossed',
    subcategories: []
  },
  {
    id: 'massage',
    icon: 'Hand',
    subcategories: []
  },
  {
    id: 'real-meeting',
    icon: 'MapPin',
    subcategories: [
      { id: 'outcall', icon: 'Car' },
      { id: 'apartment', icon: 'Home' }
    ]
  },
  {
    id: 'virtual',
    icon: 'Smartphone',
    subcategories: [
      { id: 'audio', icon: 'Phone' },
      { id: 'chat', icon: 'MessageCircle' },
      { id: 'video', icon: 'Video' }
    ]
  }
];

export const getAllServices = (lang: Language): string[] => {
  const services: string[] = [];
  serviceCategories.forEach(category => {
    services.push(getCategoryName(category.id, lang));
    category.subcategories.forEach(sub => {
      services.push(`${getCategoryName(category.id, lang)}: ${getSubcategoryName(sub.id, lang)}`);
    });
  });
  return services;
};