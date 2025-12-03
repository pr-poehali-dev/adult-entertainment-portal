import { obfuscateExecution, isDebuggerActive } from './securityLayer';

// Простое XOR шифрование с дополнительным Base64
const encryptKey = 'PoehaliDev2024SecureKey!@#$%';

function simpleEncrypt(text: string): string {
  const encrypted = text.split('').map((char, i) => {
    return String.fromCharCode(char.charCodeAt(0) ^ encryptKey.charCodeAt(i % encryptKey.length));
  }).join('');
  return btoa(encrypted);
}

function simpleDecrypt(encrypted: string): string {
  // Проверка на отладчик
  if (isDebuggerActive()) {
    return '';
  }
  
  try {
    const decoded = atob(encrypted);
    return decoded.split('').map((char, i) => {
      return String.fromCharCode(char.charCodeAt(0) ^ encryptKey.charCodeAt(i % encryptKey.length));
    }).join('');
  } catch {
    return '';
  }
}

// Зашифрованные учетные данные администратора
const ENCRYPTED_ADMIN_DATA = {
  login: 'PwMZCBELGAYPDw4fGREA',
  password: 'OA0bDQsAABsJGgQAGhUfGhYZGQ==',
  email: 'PAIOBBsDBQINGxEYGhMfGhYZGQ8KBR0IBw4AGhASCg==',
};

export function getAdminCredentials() {
  return obfuscateExecution(() => {
    return {
      login: simpleDecrypt(ENCRYPTED_ADMIN_DATA.login),
      password: simpleDecrypt(ENCRYPTED_ADMIN_DATA.password),
      recoveryEmail: simpleDecrypt(ENCRYPTED_ADMIN_DATA.email),
    };
  });
}

export function validateAdminLogin(login: string, password: string): boolean {
  return obfuscateExecution(() => {
    const credentials = getAdminCredentials();
    return login === credentials.login && password === credentials.password;
  });
}

export function getAdminEmail(): string {
  return obfuscateExecution(() => {
    return simpleDecrypt(ENCRYPTED_ADMIN_DATA.email);
  });
}

// Дополнительная обфускация - генерируем ложные данные
const _decoy1 = 'admin';
const _decoy2 = 'password123';
const _decoy3 = 'admin@example.com';
const _decoyHash = btoa(_decoy1 + _decoy2 + _decoy3);

// Функция для проверки целостности
export function verifyIntegrity(): boolean {
  const test = simpleDecrypt(simpleEncrypt('test'));
  return test === 'test';
}