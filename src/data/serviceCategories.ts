import { Language } from '@/i18n/translations';

export interface ServiceCategory {
  id: string;
  icon: string;
  image: string;
  subcategories: ServiceSubcategory[];
}

export interface ServiceSubcategory {
  id: string;
  icon: string;
  image?: string;
}

const categoryNames: Record<string, Record<Language, string>> = {
  vip: { ru: 'VIP', en: 'VIP' },
  escort: { ru: 'Эскорт сопровождение', en: 'Escort Service' },
  dinner: { ru: 'Вечерний ужин', en: 'Dinner Date' },
  business: { ru: 'Бизнес', en: 'Business' },
  abroad: { ru: 'Заграница', en: 'Abroad' },
  massage: { ru: 'Массаж', en: 'Massage' },
  striptease: { ru: 'Стриптиз', en: 'Striptease' },
  'real-meeting': { ru: 'Реальная встреча', en: 'Real Meeting' },
  virtual: { ru: 'Виртуальный секс', en: 'Virtual Sex' },
};

const subcategoryNames: Record<string, Record<Language, string>> = {
  dinner: { ru: 'Вечерний ужин', en: 'Dinner Date' },
  abroad: { ru: 'Заграница', en: 'Abroad' },
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
    image: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
    subcategories: [
      { 
        id: 'dinner', 
        icon: 'UtensilsCrossed',
        image: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/5f482fab-004b-42fa-9846-4ad8240e01ef.jpg'
      },
      { 
        id: 'abroad', 
        icon: 'Plane',
        image: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/22300f84-1212-499e-a1f1-3125dd4a2728.jpg'
      }
    ]
  },
  {
    id: 'massage',
    icon: 'Sparkles',
    image: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/a543fce0-3f60-413a-986e-b7ff2dc53e69.jpg',
    subcategories: []
  },
  {
    id: 'striptease',
    icon: 'Music',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=500&fit=crop',
    subcategories: []
  },
  {
    id: 'real-meeting',
    icon: 'MapPin',
    image: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/de33f0a1-c479-48f5-94cb-1cf8c7ea86a4.jpg',
    subcategories: [
      { id: 'outcall', icon: 'Car' },
      { id: 'apartment', icon: 'Home' }
    ]
  },
  {
    id: 'virtual',
    icon: 'Smartphone',
    image: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/5015e3a9-67c6-4205-b351-57c7212283e3.jpg',
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