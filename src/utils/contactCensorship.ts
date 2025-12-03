export interface CensoredText {
  text: string;
  hasCensored: boolean;
}

export interface TextPart {
  text: string;
  isCensored: boolean;
}

export const censorContacts = (text: string): TextPart[] => {
  if (!text) return [{ text: '', isCensored: false }];

  const parts: TextPart[] = [];
  let lastIndex = 0;

  // Регулярные выражения для поиска контактов
  const patterns = [
    // Телефонные номера (различные форматы)
    /(\+?\d[\d\s\-\(\)]{7,}\d)/g,
    // Telegram username (@username)
    /(@[a-zA-Z0-9_]{5,})/g,
    // Instagram username (@username)
    /(@[a-zA-Z0-9._]{3,})/g,
    // Email
    /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    // WhatsApp, Viber упоминания
    /(whatsapp|viber|вотсап|вайбер|ватсап)\s*:?\s*(\+?\d[\d\s\-\(\)]{7,}\d)/gi,
    // Telegram.me ссылки
    /(t\.me\/[a-zA-Z0-9_]+)/g,
    // Instagram.com ссылки
    /(instagram\.com\/[a-zA-Z0-9._]+)/g,
  ];

  const allMatches: Array<{ index: number; length: number; match: string }> = [];

  // Собираем все совпадения
  patterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match.index !== undefined) {
        allMatches.push({
          index: match.index,
          length: match[0].length,
          match: match[0]
        });
      }
    }
  });

  // Сортируем совпадения по индексу
  allMatches.sort((a, b) => a.index - b.index);

  // Убираем перекрывающиеся совпадения
  const filteredMatches: typeof allMatches = [];
  let lastEnd = -1;
  
  allMatches.forEach(match => {
    if (match.index >= lastEnd) {
      filteredMatches.push(match);
      lastEnd = match.index + match.length;
    }
  });

  // Формируем части текста
  filteredMatches.forEach(match => {
    // Добавляем текст до совпадения
    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index),
        isCensored: false
      });
    }

    // Добавляем цензурированный текст (10 звёздочек)
    parts.push({
      text: '**********',
      isCensored: true
    });

    lastIndex = match.index + match.length;
  });

  // Добавляем оставшийся текст
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      isCensored: false
    });
  }

  // Если совпадений не было, возвращаем исходный текст
  if (parts.length === 0) {
    return [{ text, isCensored: false }];
  }

  return parts;
};

export const hasCensoredContent = (text: string): boolean => {
  const patterns = [
    /(\+?\d[\d\s\-\(\)]{7,}\d)/g,
    /(@[a-zA-Z0-9_]{5,})/g,
    /(@[a-zA-Z0-9._]{3,})/g,
    /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    /(whatsapp|viber|вотсап|вайбер|ватсап)\s*:?\s*(\+?\d[\d\s\-\(\)]{7,}\d)/gi,
    /(t\.me\/[a-zA-Z0-9_]+)/g,
    /(instagram\.com\/[a-zA-Z0-9._]+)/g,
  ];

  return patterns.some(pattern => pattern.test(text));
};
