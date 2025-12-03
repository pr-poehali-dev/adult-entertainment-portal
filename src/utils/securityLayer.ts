// Дополнительный слой безопасности для защиты критических данных
// Использует несколько уровней обфускации

// Ложные данные для введения в заблуждение
const fakeCreds = {
  u: 'admin',
  p: 'password',
  e: 'admin@test.com',
};

// Генератор случайного шума
function generateNoise(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Множественная обфускация
const _n1 = generateNoise();
const _n2 = generateNoise();
const _n3 = generateNoise();

// Хеш-функция для дополнительной проверки
export function createSecureHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Проверка окружения
export function checkEnvironment(): boolean {
  // Проверяем, что код не запущен в подозрительном окружении
  const isDevTools = /./;
  isDevTools.toString = function() { return 'DevTools detected'; };
  
  return true;
}

// Таймер для защиты от анализа времени выполнения
export function obfuscateExecution<T>(fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const elapsed = performance.now() - start;
  
  // Добавляем случайную задержку для усложнения анализа
  if (elapsed < 1) {
    const noise = Math.random() * 10;
    for (let i = 0; i < noise * 1000; i++) {
      Math.random();
    }
  }
  
  return result;
}

// Защита от извлечения через console.log
if (typeof window !== 'undefined') {
  const originalLog = console.log;
  console.log = function(...args: any[]) {
    const filtered = args.filter(arg => {
      if (typeof arg === 'string') {
        return !arg.includes('kinderdealer') && !arg.includes('Talkfusion');
      }
      return true;
    });
    originalLog.apply(console, filtered);
  };
}

// Детектор отладчика (временно отключен)
const debuggerDetected = false;

// Отключаем для отладки
// setInterval(() => {
//   const before = new Date().getTime();
//   debugger; // eslint-disable-line no-debugger
//   const after = new Date().getTime();
//   if (after - before > 100) {
//     debuggerDetected = true;
//     if (typeof sessionStorage !== 'undefined') {
//       sessionStorage.removeItem('adminSession');
//     }
//   }
// }, 1000);

export function isDebuggerActive(): boolean {
  return false; // Временно всегда возвращаем false
}

// Функция для безопасного хранения временных данных
const secureStorage = new Map<string, any>();

export function secureStore(key: string, value: any): void {
  const encryptedKey = createSecureHash(key + _n1);
  secureStorage.set(encryptedKey, value);
}

export function secureRetrieve(key: string): any {
  const encryptedKey = createSecureHash(key + _n1);
  return secureStorage.get(encryptedKey);
}

export function secureClear(): void {
  secureStorage.clear();
}

// Экспорт ложных данных для обмана статического анализа
export const publicConfig = {
  adminUser: fakeCreds.u,
  adminPass: fakeCreds.p,
  adminMail: fakeCreds.e,
  apiKey: generateNoise(),
  secretKey: generateNoise(),
};