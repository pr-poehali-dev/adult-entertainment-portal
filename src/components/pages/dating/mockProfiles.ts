import { DatingProfile } from './DatingProfileCard';

export const mockProfiles: DatingProfile[] = [
  {
    id: 1,
    name: 'Анна',
    age: 24,
    gender: 'female',
    city: 'Москва',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800'
    ],
    about: 'Люблю путешествовать, заниматься йогой и пробовать новые кафе. Ищу интересного собеседника для приятного общения.',
    interests: ['Путешествия', 'Йога', 'Фотография', 'Кулинария'],
    lookingFor: 'Серьезные отношения',
    height: 168,
    online: true,
    verified: true
  },
  {
    id: 2,
    name: 'Мария',
    age: 28,
    gender: 'female',
    city: 'Санкт-Петербург',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800'
    ],
    about: 'Маркетолог, обожаю театр и современное искусство. В свободное время рисую акварелью.',
    interests: ['Театр', 'Искусство', 'Книги', 'Психология'],
    lookingFor: 'Знакомство',
    height: 172,
    online: false,
    verified: true
  },
  {
    id: 3,
    name: 'Дмитрий',
    age: 32,
    gender: 'male',
    city: 'Москва',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    ],
    about: 'IT-предприниматель, увлекаюсь спортом и активным отдыхом. Люблю горы и море.',
    interests: ['Спорт', 'Путешествия', 'Бизнес', 'Технологии'],
    lookingFor: 'Серьезные отношения',
    height: 182,
    online: true,
    verified: false
  },
  {
    id: 4,
    name: 'Елена',
    age: 26,
    gender: 'female',
    city: 'Казань',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    photos: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800'
    ],
    about: 'Дизайнер интерьеров. Люблю создавать уют и красоту вокруг себя.',
    interests: ['Дизайн', 'Мода', 'Архитектура', 'Декор'],
    lookingFor: 'Дружба',
    height: 165,
    online: false,
    verified: true
  },
  {
    id: 5,
    name: 'Алексей',
    age: 29,
    gender: 'male',
    city: 'Новосибирск',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800'
    ],
    about: 'Фотограф и путешественник. Объездил 40 стран. Ищу единомышленников.',
    interests: ['Фотография', 'Путешествия', 'Музыка', 'Кино'],
    lookingFor: 'Дружба',
    height: 178,
    online: true,
    verified: true
  },
  {
    id: 6,
    name: 'София',
    age: 23,
    gender: 'female',
    city: 'Екатеринбург',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800'
    ],
    about: 'Студентка мед университета. Люблю танцы и активный образ жизни.',
    interests: ['Танцы', 'Медицина', 'Фитнес', 'Психология'],
    lookingFor: 'Знакомство',
    height: 170,
    online: true,
    verified: false
  }
];
