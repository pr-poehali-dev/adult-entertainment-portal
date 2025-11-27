import { CatalogItem } from '@/types';
import { isCurrentlyActive } from '@/utils/scheduleChecker';

export const getCitiesByCountry = (country: string): string[] => {
  const cities: { [key: string]: string[] } = {
    'Россия': [
      'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
      'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
      'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград',
      'Краснодар', 'Саратов', 'Тюмень', 'Тольятти', 'Ижевск',
      'Барнаул', 'Ульяновск', 'Иркутск', 'Хабаровск', 'Ярославль',
      'Владивосток', 'Махачкала', 'Томск', 'Оренбург', 'Кемерово',
      'Новокузнецк', 'Рязань', 'Набережные Челны', 'Астрахань', 'Пенза',
      'Липецк', 'Киров', 'Чебоксары', 'Тула', 'Калининград',
      'Курск', 'Сочи', 'Ставрополь', 'Улан-Удэ', 'Тверь',
      'Магнитогорск', 'Брянск', 'Иваново', 'Белгород', 'Сургут',
      'Владимир', 'Нижний Тагил', 'Архангельск', 'Чита', 'Калуга',
      'Смоленск', 'Волжский', 'Курган', 'Орёл', 'Череповец',
      'Владикавказ', 'Вологда', 'Мурманск', 'Саранск', 'Якутск',
      'Тамбов', 'Грозный', 'Стерлитамак', 'Кострома', 'Петрозаводск',
      'Нижневартовск', 'Йошкар-Ола', 'Новороссийск'
    ],
    'Казахстан': [
      'Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе',
      'Тараз', 'Павлодар', 'Усть-Каменогорск', 'Семей', 'Атырау',
      'Костанай', 'Кызылорда', 'Уральск', 'Петропавловск', 'Актау',
      'Темиртау', 'Туркестан', 'Кокшетау', 'Талдыкорган', 'Экибастуз'
    ],
    'Беларусь': [
      'Минск', 'Гомель', 'Могилёв', 'Витебск', 'Гродно', 'Брест'
    ]
  };
  return cities[country] || [];
};

export const getFilteredAndSortedItems = (
  catalogItems: CatalogItem[],
  searchQuery: string,
  selectedCategory: string,
  priceRange: string,
  sortBy: string,
  selectedCountry: string,
  selectedLocation: string,
  selectedAge: string,
  selectedHeight: string,
  selectedBodyType: string
) => {
  const filtered = catalogItems.filter(item => {
    const isActive = item.isActive !== false && isCurrentlyActive(item.workSchedule);
    if (!isActive) return false;
    
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.seller.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    const matchesCountry = selectedCountry === 'all' || true;
    const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
    
    let matchesAge = true;
    if (selectedAge !== 'all' && item.age) {
      if (selectedAge === '18-25') matchesAge = item.age >= 18 && item.age <= 25;
      else if (selectedAge === '26-30') matchesAge = item.age >= 26 && item.age <= 30;
      else if (selectedAge === '31-35') matchesAge = item.age >= 31 && item.age <= 35;
      else if (selectedAge === '36+') matchesAge = item.age >= 36;
    }
    
    let matchesHeight = true;
    if (selectedHeight !== 'all' && item.height) {
      if (selectedHeight === '160-165') matchesHeight = item.height >= 160 && item.height <= 165;
      else if (selectedHeight === '166-170') matchesHeight = item.height >= 166 && item.height <= 170;
      else if (selectedHeight === '171-175') matchesHeight = item.height >= 171 && item.height <= 175;
      else if (selectedHeight === '176+') matchesHeight = item.height >= 176;
    }
    
    const matchesBodyType = selectedBodyType === 'all' || item.bodyType === selectedBodyType;
    
    const price = parseInt(item.price.replace(/\D/g, ''));
    let matchesPrice = true;
    if (priceRange === 'low') matchesPrice = price < 15000;
    else if (priceRange === 'mid') matchesPrice = price >= 15000 && price <= 25000;
    else if (priceRange === 'high') matchesPrice = price > 25000;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesCountry && matchesLocation && matchesAge && matchesHeight && matchesBodyType;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') {
      const priceA = parseInt(a.price.replace(/\D/g, ''));
      const priceB = parseInt(b.price.replace(/\D/g, ''));
      return priceA - priceB;
    }
    if (sortBy === 'price-desc') {
      const priceA = parseInt(a.price.replace(/\D/g, ''));
      const priceB = parseInt(b.price.replace(/\D/g, ''));
      return priceB - priceA;
    }
    return 0;
  });

  return filtered;
};
