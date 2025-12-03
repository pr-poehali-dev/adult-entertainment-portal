// Скрипт для расшифровки учетных данных администратора
const encryptKey = 'PoehaliDev2024SecureKey!@#$%';

function simpleDecrypt(encrypted) {
  try {
    const decoded = atob(encrypted);
    return decoded.split('').map((char, i) => {
      return String.fromCharCode(char.charCodeAt(0) ^ encryptKey.charCodeAt(i % encryptKey.length));
    }).join('');
  } catch {
    return '';
  }
}

const ENCRYPTED_ADMIN_DATA = {
  login: 'PwMZCBELGAYPDw4fGREA',
  password: 'OA0bDQsAABsJGgQAGhUfGhYZGQ==',
  email: 'PAIOBBsDBQINGxEYGhMfGhYZGQ8KBR0IBw4AGhASCg==',
};

console.log('=== ДАННЫЕ АДМИНИСТРАТОРА ===');
console.log('Логин:', simpleDecrypt(ENCRYPTED_ADMIN_DATA.login));
console.log('Пароль:', simpleDecrypt(ENCRYPTED_ADMIN_DATA.password));
console.log('Email:', simpleDecrypt(ENCRYPTED_ADMIN_DATA.email));
console.log('=============================');
