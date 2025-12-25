import { BrandEmoji } from '@/types';

export const brandEmojis: BrandEmoji[] = [
  // Love категория
  { id: 'love-1', emoji: '❤️', name: 'Сердце', category: 'love' },
  { id: 'love-2', emoji: '💕', name: 'Два сердца', category: 'love' },
  { id: 'love-3', emoji: '💖', name: 'Блестящее сердце', category: 'love' },
  { id: 'love-4', emoji: '💗', name: 'Растущее сердце', category: 'love' },
  { id: 'love-5', emoji: '💘', name: 'Стрела Купидона', category: 'love' },
  { id: 'love-6', emoji: '💝', name: 'Сердце с лентой', category: 'love' },
  { id: 'love-7', emoji: '😍', name: 'Влюблённый', category: 'love' },
  { id: 'love-8', emoji: '🥰', name: 'Обнимашки', category: 'love' },
  { id: 'love-9', emoji: '😘', name: 'Поцелуй', category: 'love' },
  { id: 'love-10', emoji: '💋', name: 'Губки', category: 'love' },

  // Flirt категория
  { id: 'flirt-1', emoji: '😏', name: 'Хитрая улыбка', category: 'flirt' },
  { id: 'flirt-2', emoji: '😉', name: 'Подмигивание', category: 'flirt' },
  { id: 'flirt-3', emoji: '🫦', name: 'Покусывание губ', category: 'flirt', isPremium: true },
  { id: 'flirt-4', emoji: '👄', name: 'Губы', category: 'flirt' },
  { id: 'flirt-5', emoji: '🌹', name: 'Роза', category: 'flirt' },
  { id: 'flirt-6', emoji: '💐', name: 'Букет', category: 'flirt' },
  { id: 'flirt-7', emoji: '🍷', name: 'Вино', category: 'flirt' },
  { id: 'flirt-8', emoji: '🫶', name: 'Жест сердце', category: 'flirt' },
  { id: 'flirt-9', emoji: '💅', name: 'Маникюр', category: 'flirt' },
  { id: 'flirt-10', emoji: '💃', name: 'Танцовщица', category: 'flirt' },

  // Hot категория
  { id: 'hot-1', emoji: '🔥', name: 'Огонь', category: 'hot' },
  { id: 'hot-2', emoji: '🥵', name: 'Горячо', category: 'hot' },
  { id: 'hot-3', emoji: '😈', name: 'Дьяволёнок', category: 'hot', isPremium: true },
  { id: 'hot-4', emoji: '👅', name: 'Язык', category: 'hot', isPremium: true },
  { id: 'hot-5', emoji: '🍑', name: 'Персик', category: 'hot' },
  { id: 'hot-6', emoji: '🍆', name: 'Баклажан', category: 'hot' },
  { id: 'hot-7', emoji: '💦', name: 'Капли', category: 'hot', isPremium: true },
  { id: 'hot-8', emoji: '🌶️', name: 'Перчик', category: 'hot' },
  { id: 'hot-9', emoji: '👙', name: 'Бикини', category: 'hot' },
  { id: 'hot-10', emoji: '🛏️', name: 'Кровать', category: 'hot', isPremium: true },

  // Party категория
  { id: 'party-1', emoji: '🎉', name: 'Праздник', category: 'party' },
  { id: 'party-2', emoji: '🥂', name: 'Шампанское', category: 'party' },
  { id: 'party-3', emoji: '🍾', name: 'Бутылка шампанского', category: 'party' },
  { id: 'party-4', emoji: '🎊', name: 'Конфетти', category: 'party' },
  { id: 'party-5', emoji: '🎈', name: 'Шарик', category: 'party' },
  { id: 'party-6', emoji: '🎭', name: 'Маски', category: 'party' },
  { id: 'party-7', emoji: '🕺', name: 'Танцор', category: 'party' },
  { id: 'party-8', emoji: '🍸', name: 'Коктейль', category: 'party' },
  { id: 'party-9', emoji: '🎵', name: 'Музыка', category: 'party' },
  { id: 'party-10', emoji: '✨', name: 'Блёстки', category: 'party' },

  // VIP категория
  { id: 'vip-1', emoji: '👑', name: 'Корона', category: 'vip', isPremium: true },
  { id: 'vip-2', emoji: '💎', name: 'Бриллиант', category: 'vip', isPremium: true },
  { id: 'vip-3', emoji: '⭐', name: 'Звезда', category: 'vip' },
  { id: 'vip-4', emoji: '🌟', name: 'Сияющая звезда', category: 'vip' },
  { id: 'vip-5', emoji: '💫', name: 'Головокружение', category: 'vip' },
  { id: 'vip-6', emoji: '🎩', name: 'Цилиндр', category: 'vip', isPremium: true },
  { id: 'vip-7', emoji: '🏆', name: 'Кубок', category: 'vip' },
  { id: 'vip-8', emoji: '🥇', name: 'Золото', category: 'vip' },
  { id: 'vip-9', emoji: '🎖️', name: 'Медаль', category: 'vip' },
  { id: 'vip-10', emoji: '💼', name: 'Бизнес', category: 'vip', isPremium: true },

  // Money категория
  { id: 'money-1', emoji: '💰', name: 'Мешок денег', category: 'money' },
  { id: 'money-2', emoji: '💵', name: 'Доллары', category: 'money' },
  { id: 'money-3', emoji: '💶', name: 'Евро', category: 'money' },
  { id: 'money-4', emoji: '💷', name: 'Фунты', category: 'money' },
  { id: 'money-5', emoji: '💴', name: 'Йены', category: 'money' },
  { id: 'money-6', emoji: '💸', name: 'Деньги с крыльями', category: 'money' },
  { id: 'money-7', emoji: '💳', name: 'Карта', category: 'money' },
  { id: 'money-8', emoji: '🪙', name: 'Монета', category: 'money' },
  { id: 'money-9', emoji: '💲', name: 'Знак доллара', category: 'money' },
  { id: 'money-10', emoji: '🤑', name: 'Богач', category: 'money' },
];

export const getEmojisByCategory = (category: BrandEmoji['category']) => {
  return brandEmojis.filter(emoji => emoji.category === category);
};

export const getPremiumEmojis = () => {
  return brandEmojis.filter(emoji => emoji.isPremium);
};

export const getFreeEmojis = () => {
  return brandEmojis.filter(emoji => !emoji.isPremium);
};
