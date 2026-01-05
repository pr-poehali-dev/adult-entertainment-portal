-- Обновление хешей паролей для существующих тестовых пользователей на bcrypt
-- SHA256 hash 'test123' -> bcrypt hash 'test123'
UPDATE t_p38218043_adult_entertainment_.users 
SET password_hash = '$2b$12$K.EQxGr0pC8DVTYJBwzqLOzPR/xQkjJXNz6qG8YF.4.P0T6C6yJsO'
WHERE email = 'test@example.com' AND password_hash = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';
