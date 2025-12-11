export interface StripteaseAd {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female';
  avatar: string;
  coverImage: string;
  rating: number;
  reviewsCount: number;
  pricePerHour: number;
  location: string;
  experience: string;
  verified: boolean;
  about: string;
  specialties: string[];
  portfolio: string[];
  availability: {
    [key: string]: boolean;
  };
}

export const stripteaseAds: StripteaseAd[] = [
  {
    id: 1,
    name: 'Виктория',
    age: 24,
    gender: 'female',
    avatar: 'https://i.pravatar.cc/300?img=5',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=500&fit=crop',
    rating: 4.9,
    reviewsCount: 87,
    pricePerHour: 8000,
    location: 'Москва, ЦАО',
    experience: '5 лет',
    verified: true,
    about: 'Профессиональная танцовщица с опытом выступлений на частных мероприятиях. Классический и эротический танец, pole dance. Работаю с разными форматами: девичники, дни рождения, корпоративы.',
    specialties: ['Классический стриптиз', 'Pole dance', 'Эротический танец', 'Тематические шоу'],
    portfolio: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&h=300&fit=crop',
    ],
    availability: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: false,
    },
  },
  {
    id: 2,
    name: 'Анастасия',
    age: 27,
    gender: 'female',
    avatar: 'https://i.pravatar.cc/300?img=9',
    coverImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=500&fit=crop',
    rating: 4.8,
    reviewsCount: 64,
    pricePerHour: 7000,
    location: 'Санкт-Петербург',
    experience: '4 года',
    verified: true,
    about: 'Танцую в профессиональных стрип-клубах. Предлагаю выступления на частных мероприятиях: девичники, дни рождения. Возможны парные выступления с партнёром.',
    specialties: ['Эротический танец', 'Шоу-программы', 'Парные выступления', 'Lap dance'],
    portfolio: [
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&fit=crop',
    ],
    availability: {
      mon: false,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true,
    },
  },
  {
    id: 3,
    name: 'Дмитрий',
    age: 29,
    gender: 'male',
    avatar: 'https://i.pravatar.cc/300?img=12',
    coverImage: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop',
    rating: 4.7,
    reviewsCount: 52,
    pricePerHour: 6000,
    location: 'Москва, СЗАО',
    experience: '3 года',
    verified: true,
    about: 'Профессиональный танцор, выступаю на женских праздниках. Классический и эротический танец, акробатические элементы. Возможны костюмированные шоу.',
    specialties: ['Мужской стриптиз', 'Акробатика', 'Костюмированные шоу', 'Интерактив с публикой'],
    portfolio: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    ],
    availability: {
      mon: true,
      tue: true,
      wed: false,
      thu: true,
      fri: true,
      sat: true,
      sun: true,
    },
  },
  {
    id: 4,
    name: 'Кристина',
    age: 22,
    gender: 'female',
    avatar: 'https://i.pravatar.cc/300?img=20',
    coverImage: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&h=500&fit=crop',
    rating: 4.9,
    reviewsCount: 93,
    pricePerHour: 9000,
    location: 'Москва, ЦАО',
    experience: '6 лет',
    verified: true,
    about: 'Чемпионка России по pole dance. Создаю уникальные шоу-программы для любых мероприятий. Возможна работа с реквизитом: пилон, воздушные полотна, огненное шоу.',
    specialties: ['Pole dance', 'Воздушная гимнастика', 'Огненное шоу', 'Акробатический стриптиз'],
    portfolio: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&h=300&fit=crop',
    ],
    availability: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: false,
    },
  },
  {
    id: 5,
    name: 'Александр',
    age: 31,
    gender: 'male',
    avatar: 'https://i.pravatar.cc/300?img=15',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
    rating: 4.6,
    reviewsCount: 41,
    pricePerHour: 5500,
    location: 'Санкт-Петербург',
    experience: '2 года',
    verified: false,
    about: 'Танцор и хореограф. Выступаю на девичниках, днях рождения, корпоративах. Индивидуальный подход к каждому клиенту, возможна разработка уникальной программы.',
    specialties: ['Классический стриптиз', 'Go-go', 'Тематические постановки'],
    portfolio: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    ],
    availability: {
      mon: false,
      tue: false,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true,
    },
  },
  {
    id: 6,
    name: 'Елена',
    age: 26,
    gender: 'female',
    avatar: 'https://i.pravatar.cc/300?img=25',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=500&fit=crop',
    rating: 4.8,
    reviewsCount: 71,
    pricePerHour: 7500,
    location: 'Казань',
    experience: '4 года',
    verified: true,
    about: 'Танцую с 16 лет, последние 4 года профессионально занимаюсь стриптизом. Работаю на частных мероприятиях любого формата. Возможен выезд в другие города.',
    specialties: ['Классический стриптиз', 'Lap dance', 'Эротический танец', 'Chair dance'],
    portfolio: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    ],
    availability: {
      mon: true,
      tue: true,
      wed: true,
      thu: false,
      fri: true,
      sat: true,
      sun: true,
    },
  },
];
