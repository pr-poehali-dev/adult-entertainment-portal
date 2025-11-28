import { WorkOpportunity, PaidAd } from '@/types';

export const workOpportunities: WorkOpportunity[] = [
  {
    id: 1,
    type: 'photo_shoot',
    title: 'Фотосессия для модного журнала',
    description: 'Ищем моделей для съемки новой коллекции одежды. Профессиональная фотосессия в студии с опытным фотографом. Снимки будут использованы в каталоге и на сайте.',
    payment: 'От 15 000 ₽ за съемочный день',
    paymentAmount: 15000,
    currency: 'RUB',
    requirements: [
      'Опыт модельной работы приветствуется',
      'Возраст 18-35 лет',
      'Рост от 165 см',
      'Презентабельная внешность',
      'Готовность к длительной съемке (4-6 часов)'
    ],
    location: 'Москва, м. Тверская',
    duration: '1 съемочный день',
    image: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/791479d3-cb45-4ac5-bb4a-3fba4930e8f5.jpg',
    contactInfo: '@fashion_studio_moscow',
    isVerified: true,
    postedDate: '2024-11-25',
    company: 'Fashion Studio Pro'
  },
  {
    id: 2,
    type: 'video_shoot',
    title: 'Съемка видеоконтента для YouTube',
    description: 'Требуются модели для съемки развлекательного контента. Работа с профессиональной командой видеографов. Готовый материал будет размещен на популярном канале.',
    payment: '20 000 - 30 000 ₽',
    paymentAmount: 20000,
    currency: 'RUB',
    requirements: [
      'Коммуникабельность',
      'Артистичность',
      'Готовность работать в кадре',
      'Возраст 21+',
      'Без опыта - обучим'
    ],
    location: 'Санкт-Петербург',
    duration: '2-3 дня',
    image: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/da48eab4-a2ad-41e5-8594-802f3d9886ae.jpg',
    contactInfo: '+7 (999) 123-45-67',
    isVerified: true,
    postedDate: '2024-11-26',
    company: 'Video Production SPb'
  },
  {
    id: 3,
    type: 'nude_photoshoot',
    title: 'Художественная НЮ фотосессия',
    description: 'Ищем моделей для художественной фотосессии в стиле ню. Работа с профессиональным фотографом, соблюдение полной конфиденциальности. Снимки для частной коллекции и выставок.',
    payment: '25 000 - 40 000 ₽',
    paymentAmount: 25000,
    currency: 'RUB',
    requirements: [
      'Возраст 21+',
      'Опыт желателен',
      'Готовность к художественным съемкам',
      'Эстетичная фигура',
      'Конфиденциальность гарантируется'
    ],
    location: 'Москва, приватная студия',
    duration: '3-4 часа',
    image: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/473c1c3a-2d29-4fb6-97c8-bc31c73f5f28.jpg',
    contactInfo: '@art_photo_pro',
    isVerified: true,
    postedDate: '2024-11-24',
    company: 'Art Photography Studio'
  },
  {
    id: 4,
    type: 'porn_casting',
    title: 'Кастинг для взрослого кино',
    description: 'Профессиональная студия проводит кастинг моделей для съемок контента 18+. Легальная работа, официальные договора, высокие гонорары. Конфиденциальность гарантирована.',
    payment: 'От 50 000 ₽ за съемку',
    paymentAmount: 50000,
    currency: 'RUB',
    requirements: [
      'Возраст 21+',
      'Привлекательная внешность',
      'Готовность к откровенным сценам',
      'Опыт не обязателен',
      'Документы для легального трудоустройства'
    ],
    location: 'Москва (конкретный адрес после собеседования)',
    duration: 'Съемочный день 4-8 часов',
    image: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/39200de2-fa4c-4140-bf45-b85084e0386f.jpg',
    contactInfo: '+7 (999) 888-77-66',
    isVerified: true,
    postedDate: '2024-11-27',
    company: 'Premium Adult Studio'
  },
  {
    id: 5,
    type: 'first_time',
    title: 'Первый раз в модельном бизнесе',
    description: 'Агентство приглашает новичков без опыта работы. Предоставляем полное сопровождение, обучение, помощь в создании портфолио. Начни карьеру модели с нами!',
    payment: '10 000 - 15 000 ₽ (первые съемки)',
    paymentAmount: 10000,
    currency: 'RUB',
    requirements: [
      'Возраст 18-28 лет',
      'Желание работать в индустрии',
      'Опыт не требуется',
      'Рост от 160 см',
      'Готовность к обучению'
    ],
    location: 'Москва, офис агентства',
    duration: 'Гибкий график',
    image: 'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/7eb2e11c-a4da-4b4a-b02a-95636cd0de90.jpg',
    contactInfo: '@model_agency_start',
    isVerified: true,
    postedDate: '2024-11-28',
    company: 'Start Model Agency'
  }
];

export const paidAds: PaidAd[] = [
  {
    id: 1,
    title: 'Эксклюзивное VIP сопровождение',
    description: 'Предлагаю услуги премиум-сопровождения на деловых встречах, светских мероприятиях. Владею тремя языками, высшее образование, опыт работы с VIP-клиентами.',
    price: 30000,
    currency: 'RUB',
    category: 'VIP сопровождение',
    images: [
      'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/ec51be21-94dc-4e98-b8b1-7d6a13235916.jpg',
      'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/2027abc7-c23f-49e7-9181-e88a68144742.jpg'
    ],
    sellerName: 'Анастасия',
    sellerRating: 5.0,
    sellerVerified: true,
    location: 'Москва',
    postedDate: '2024-11-26',
    views: 245,
    isPremium: true,
    contactInfo: '@anastasia_vip_moscow'
  },
  {
    id: 2,
    title: 'Массаж и релакс',
    description: 'Профессиональный расслабляющий массаж. Приятная атмосфера, приватная студия в центре города. Индивидуальный подход к каждому клиенту.',
    price: 5000,
    currency: 'RUB',
    category: 'Массаж',
    images: [
      'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/a543fce0-3f60-413a-986e-b7ff2dc53e69.jpg'
    ],
    sellerName: 'Виктория',
    sellerRating: 4.8,
    sellerVerified: true,
    location: 'Санкт-Петербург',
    postedDate: '2024-11-27',
    views: 156,
    isPremium: false,
    contactInfo: '+7 (999) 222-33-44'
  },
  {
    id: 3,
    title: 'Фотосессия любой сложности',
    description: 'Профессиональный фотограф предлагает услуги фотосъемки: портретная, модельная, НЮ. Современное оборудование, обработка включена.',
    price: 8000,
    currency: 'RUB',
    category: 'Фото/Видео',
    images: [
      'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/791479d3-cb45-4ac5-bb4a-3fba4930e8f5.jpg'
    ],
    sellerName: 'Александр (фотограф)',
    sellerRating: 4.9,
    sellerVerified: true,
    location: 'Москва',
    postedDate: '2024-11-25',
    views: 189,
    isPremium: true,
    contactInfo: '@photo_alex_pro'
  },
  {
    id: 4,
    title: 'Индивидуальные встречи',
    description: 'Приятная девушка для индивидуальных встреч. Комфортная обстановка, конфиденциальность, внимание к деталям.',
    price: 12000,
    currency: 'RUB',
    category: 'Встречи',
    images: [
      'https://cdn.poehali.dev/projects/2c00503b-224b-423f-b593-94ea364ca1b5/files/cf786e95-b283-46c8-bd07-da6faa13ebcf.jpg'
    ],
    sellerName: 'Марина',
    sellerRating: 4.7,
    sellerVerified: false,
    location: 'Казань',
    postedDate: '2024-11-28',
    views: 78,
    isPremium: false,
    contactInfo: '+7 (999) 555-66-77'
  }
];
