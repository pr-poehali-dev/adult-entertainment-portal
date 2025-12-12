export interface VirtualPerformer {
  id: number;
  name: string;
  age: number;
  avatar: string;
  photos: string[];
  rating: number;
  reviewsCount: number;
  verified: boolean;
  vipStatus: 'vip' | 'none';
  location: string;
  about: string;
  specialties: string[];
  languages: string[];
  pricePerMinute: number;
  minDuration: number;
  maxDuration: number;
  availability: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  services: ('audio' | 'chat' | 'video')[];
  online: boolean;
}

export const virtualPerformers: VirtualPerformer[] = [
  {
    id: 1,
    name: 'Кристина',
    age: 24,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kristina',
    photos: [
      'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
      'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/7b022cb5-ced6-46dc-9446-88606525899f.jpg',
    ],
    rating: 4.9,
    reviewsCount: 156,
    verified: true,
    vipStatus: 'vip',
    location: 'Москва',
    about: 'Виртуальная модель с опытом более 3 лет. Создаю незабываемые моменты онлайн.',
    specialties: ['Видео звонки', 'Ролевые игры', 'Dirty talk', 'Фетиш'],
    languages: ['Русский', 'English'],
    pricePerMinute: 150,
    minDuration: 10,
    maxDuration: 60,
    availability: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: false,
    },
    services: ['audio', 'video', 'chat'],
    online: true,
  },
  {
    id: 2,
    name: 'Анжелика',
    age: 26,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Angelika',
    photos: [
      'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/5f482fab-004b-42fa-9846-4ad8240e01ef.jpg',
    ],
    rating: 4.8,
    reviewsCount: 98,
    verified: true,
    vipStatus: 'vip',
    location: 'Санкт-Петербург',
    about: 'Сексуальная и раскрепощённая девушка для виртуального общения.',
    specialties: ['Видео звонки', 'Стриптиз', 'JOI', 'Доминирование'],
    languages: ['Русский', 'English', 'Deutsch'],
    pricePerMinute: 200,
    minDuration: 10,
    maxDuration: 60,
    availability: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true,
    },
    services: ['audio', 'video', 'chat'],
    online: false,
  },
  {
    id: 3,
    name: 'Милана',
    age: 22,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milana',
    photos: [
      'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/de33f0a1-c479-48f5-94cb-1cf8c7ea86a4.jpg',
    ],
    rating: 4.7,
    reviewsCount: 67,
    verified: false,
    vipStatus: 'none',
    location: 'Казань',
    about: 'Милая и общительная девушка для приятного виртуального времяпровождения.',
    specialties: ['Видео звонки', 'GFE', 'Романтика', 'Игривость'],
    languages: ['Русский'],
    pricePerMinute: 100,
    minDuration: 10,
    maxDuration: 60,
    availability: {
      mon: true,
      tue: true,
      wed: false,
      thu: true,
      fri: true,
      sat: true,
      sun: true,
    },
    services: ['audio', 'video', 'chat'],
    online: true,
  },
];
