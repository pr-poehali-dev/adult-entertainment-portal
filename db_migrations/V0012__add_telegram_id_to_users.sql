-- Добавляем поле telegram_id для авторизации через Telegram
ALTER TABLE t_p38218043_adult_entertainment_.users 
ADD COLUMN IF NOT EXISTS telegram_id BIGINT UNIQUE;

-- Создаём индекс для быстрого поиска по telegram_id
CREATE INDEX IF NOT EXISTS idx_users_telegram_id 
ON t_p38218043_adult_entertainment_.users(telegram_id);

-- Комментарий к полю
COMMENT ON COLUMN t_p38218043_adult_entertainment_.users.telegram_id 
IS 'Telegram ID пользователя для авторизации через Telegram';