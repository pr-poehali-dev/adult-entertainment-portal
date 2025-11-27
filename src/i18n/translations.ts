export type Language = 'ru' | 'en';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    catalog: string;
    favorites: string;
    messages: string;
    profile: string;
    rules: string;
    login: string;
    register: string;
  };
  
  // Home page
  home: {
    heroTitle: string;
    heroSubtitle: string;
    viewCatalog: string;
    register: string;
    categoriesTitle: string;
    advantagesTitle: string;
    advantages: {
      security: { title: string; desc: string };
      privacy: { title: string; desc: string };
      premium: { title: string; desc: string };
      guarantees: { title: string; desc: string };
    };
  };
  
  // Catalog
  catalog: {
    title: string;
    search: string;
    allServices: string;
    allCountries: string;
    allCities: string;
    anyAge: string;
    anyHeight: string;
    anyBodyType: string;
    anyPrice: string;
    sortBy: string;
    sortByRating: string;
    sortByPriceAsc: string;
    sortByPriceDesc: string;
    reset: string;
    country: string;
    city: string;
    age: string;
    height: string;
    bodyType: string;
    price: string;
    category: string;
    perHour: string;
    rating: string;
    reviews: string;
    available: string;
    availableFrom: string;
    bodyTypes: {
      slim: string;
      athletic: string;
      average: string;
    };
  };
  
  // Service categories
  categories: {
    escort: string;
    dinner: string;
    massage: string;
    realMeeting: string;
    virtual: string;
    subcategories: {
      outcall: string;
      apartment: string;
      audio: string;
      chat: string;
      video: string;
    };
  };
  
  // Common
  common: {
    back: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    confirm: string;
    close: string;
  };
}

export const translations: Record<Language, Translations> = {
  ru: {
    nav: {
      home: 'Главная',
      catalog: 'Каталог',
      favorites: 'Избранное',
      messages: 'Сообщения',
      profile: 'Профиль',
      rules: 'Правила',
      login: 'Войти',
      register: 'Регистрация',
    },
    home: {
      heroTitle: 'Мир магических\nвстреч',
      heroSubtitle: 'Премиальная платформа для взрослых. Конфиденциальность, безопасность и высочайший уровень сервиса',
      viewCatalog: 'Посмотреть каталог',
      register: 'Регистрация',
      categoriesTitle: 'Категории услуг',
      advantagesTitle: 'Преимущества платформы',
      advantages: {
        security: { title: 'Безопасность', desc: 'Проверенные профили' },
        privacy: { title: 'Конфиденциальность', desc: 'Полная анонимность' },
        premium: { title: 'Премиум сервис', desc: 'Высочайший уровень' },
        guarantees: { title: 'Гарантии', desc: 'Защита сделок' },
      },
    },
    catalog: {
      title: 'Каталог услуг',
      search: 'Поиск...',
      allServices: 'Все услуги',
      allCountries: 'Все страны',
      allCities: 'Все города',
      anyAge: 'Любой возраст',
      anyHeight: 'Любой рост',
      anyBodyType: 'Любое',
      anyPrice: 'Любая цена',
      sortBy: 'Сортировка',
      sortByRating: 'По рейтингу',
      sortByPriceAsc: 'Цена: по возрастанию',
      sortByPriceDesc: 'Цена: по убыванию',
      reset: 'Сбросить',
      country: 'Страна',
      city: 'Город',
      age: 'Возраст',
      height: 'Рост',
      bodyType: 'Телосложение',
      price: 'Цена',
      category: 'Категория',
      perHour: '₽/час',
      rating: 'Рейтинг',
      reviews: 'отзывов',
      available: 'Доступна сейчас',
      availableFrom: 'Доступна с',
      bodyTypes: {
        slim: 'Стройная',
        athletic: 'Спортивная',
        average: 'Средняя',
      },
    },
    categories: {
      escort: 'Эскорт сопровождение',
      dinner: 'Вечерний ужин',
      massage: 'Массаж',
      realMeeting: 'Реальная встреча',
      virtual: 'Виртуальный секс',
      subcategories: {
        outcall: 'Выезд',
        apartment: 'Апартаменты',
        audio: 'Аудиоразговор',
        chat: 'Онлайн переписка',
        video: 'Видео звонок',
      },
    },
    common: {
      back: 'Назад',
      save: 'Сохранить',
      cancel: 'Отмена',
      edit: 'Редактировать',
      delete: 'Удалить',
      confirm: 'Подтвердить',
      close: 'Закрыть',
    },
  },
  en: {
    nav: {
      home: 'Home',
      catalog: 'Catalog',
      favorites: 'Favorites',
      messages: 'Messages',
      profile: 'Profile',
      rules: 'Rules',
      login: 'Login',
      register: 'Register',
    },
    home: {
      heroTitle: 'World of Magical\nEncounters',
      heroSubtitle: 'Premium adult platform. Privacy, security and the highest level of service',
      viewCatalog: 'View Catalog',
      register: 'Register',
      categoriesTitle: 'Service Categories',
      advantagesTitle: 'Platform Advantages',
      advantages: {
        security: { title: 'Security', desc: 'Verified profiles' },
        privacy: { title: 'Privacy', desc: 'Complete anonymity' },
        premium: { title: 'Premium Service', desc: 'Highest level' },
        guarantees: { title: 'Guarantees', desc: 'Transaction protection' },
      },
    },
    catalog: {
      title: 'Service Catalog',
      search: 'Search...',
      allServices: 'All Services',
      allCountries: 'All Countries',
      allCities: 'All Cities',
      anyAge: 'Any Age',
      anyHeight: 'Any Height',
      anyBodyType: 'Any',
      anyPrice: 'Any Price',
      sortBy: 'Sort By',
      sortByRating: 'By Rating',
      sortByPriceAsc: 'Price: Low to High',
      sortByPriceDesc: 'Price: High to Low',
      reset: 'Reset',
      country: 'Country',
      city: 'City',
      age: 'Age',
      height: 'Height',
      bodyType: 'Body Type',
      price: 'Price',
      category: 'Category',
      perHour: '/hour',
      rating: 'Rating',
      reviews: 'reviews',
      available: 'Available now',
      availableFrom: 'Available from',
      bodyTypes: {
        slim: 'Slim',
        athletic: 'Athletic',
        average: 'Average',
      },
    },
    categories: {
      escort: 'Escort Service',
      dinner: 'Dinner Date',
      massage: 'Massage',
      realMeeting: 'Real Meeting',
      virtual: 'Virtual Sex',
      subcategories: {
        outcall: 'Outcall',
        apartment: 'Apartment',
        audio: 'Audio Call',
        chat: 'Online Chat',
        video: 'Video Call',
      },
    },
    common: {
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      close: 'Close',
    },
  },
};
