# Индикатор загрузки - Руководство

## Описание

Система индикации загрузки для операций, требующих интернет-соединения.

## Компоненты

### 1. LoadingOverlay
Визуальный оверлей с анимацией загрузки.

**Расположение:** `src/components/LoadingOverlay.tsx`

**Использование:**
```tsx
import { LoadingOverlay } from '@/components/LoadingOverlay';

<LoadingOverlay 
  isLoading={isLoading} 
  message="Отправка данных..." 
/>
```

### 2. useLoadingState Hook
Хук для управления состоянием загрузки с автоматической проверкой интернета.

**Расположение:** `src/hooks/useLoadingState.ts`

## Примеры использования

### Базовый пример

```tsx
import { useLoadingState } from '@/hooks/useLoadingState';
import { LoadingOverlay } from '@/components/LoadingOverlay';

const MyComponent = () => {
  const loading = useLoadingState();

  const handleSubmit = async () => {
    // Запуск загрузки с кастомным сообщением
    if (!loading.startLoading('Отправка формы...')) {
      // Нет интернета - загрузка не началась
      return;
    }

    try {
      await fetch('/api/submit', { method: 'POST' });
      loading.stopLoading();
      toast({ title: 'Успешно!' });
    } catch (error) {
      loading.stopLoading();
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={loading.isLoading} message={loading.message} />
      <button onClick={handleSubmit}>Отправить</button>
    </>
  );
};
```

### С использованием withLoading

```tsx
const MyComponent = () => {
  const loading = useLoadingState();

  const handleSubmit = async () => {
    const result = await loading.withLoading(
      async () => {
        const response = await fetch('/api/submit', { method: 'POST' });
        return response.json();
      },
      'Отправка данных...'
    );

    if (result) {
      toast({ title: 'Успешно!', description: result.message });
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={loading.isLoading} message={loading.message} />
      <button onClick={handleSubmit}>Отправить</button>
    </>
  );
};
```

## Интеграция в проект

Компонент `<LoadingOverlay />` уже добавлен в `src/pages/Index.tsx`:

```tsx
const Index = () => {
  const loading = useLoadingState();

  return (
    <div>
      <LoadingOverlay isLoading={loading.isLoading} message={loading.message} />
      {/* остальной контент */}
    </div>
  );
};
```

## Особенности

1. **Автоматическая проверка интернета** - при вызове `startLoading()` проверяется статус подключения
2. **Кастомные сообщения** - можно указать любое сообщение для загрузки
3. **Плавная анимация** - fade in/out с scale эффектом
4. **Блокировка интерфейса** - при загрузке пользователь не может взаимодействовать с элементами

## API

### useLoadingState()

Возвращает объект:
- `isLoading: boolean` - статус загрузки
- `message: string` - текущее сообщение
- `startLoading(message?: string): boolean` - запустить загрузку, возвращает `false` если нет интернета
- `stopLoading(): void` - остановить загрузку
- `withLoading<T>(action: () => Promise<T>, message?: string): Promise<T | null>` - обернуть async функцию

### LoadingOverlay Props

- `isLoading: boolean` - показывать индикатор
- `message?: string` - текст сообщения (по умолчанию: "Загрузка...")

## Где использовать

Рекомендуется добавить индикатор загрузки для:

1. **Отправка форм** - регистрация, бронирование, создание объявлений
2. **Покупки** - платежи, пополнение баланса
3. **Загрузка файлов** - фото профиля, документы
4. **API запросы** - получение данных с сервера
5. **Telegram платежи** - создание инвойсов, обработка платежей

## Примеры для типичных сценариев

### Бронирование услуги

```tsx
const handleBookingSubmit = async () => {
  const success = await loading.withLoading(
    async () => {
      // Логика бронирования
      return true;
    },
    'Создание бронирования...'
  );

  if (success) {
    toast({ title: 'Бронирование создано!' });
  }
};
```

### Покупка LOVE токенов

```tsx
const handlePurchaseLove = async (amount: number) => {
  const result = await loading.withLoading(
    async () => {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        body: JSON.stringify({ amount })
      });
      return response.json();
    },
    'Обработка платежа...'
  );

  if (result) {
    toast({ title: `Зачислено ${amount} LOVE` });
  }
};
```

### Загрузка файла

```tsx
const handleUpload = async (file: File) => {
  if (!loading.startLoading('Загрузка файла...')) {
    toast({ title: 'Нет подключения к интернету', variant: 'destructive' });
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/upload', { method: 'POST', body: formData });
    loading.stopLoading();
    toast({ title: 'Файл загружен!' });
  } catch (error) {
    loading.stopLoading();
    toast({ title: 'Ошибка загрузки', variant: 'destructive' });
  }
};
```
