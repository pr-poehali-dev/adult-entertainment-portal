-- Создание таблицы для кодов сброса пароля
CREATE TABLE IF NOT EXISTS t_p38218043_adult_entertainment_.password_reset_codes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES t_p38218043_adult_entertainment_.users(id)
);

CREATE INDEX IF NOT EXISTS idx_password_reset_codes_user_id ON t_p38218043_adult_entertainment_.password_reset_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_codes_code ON t_p38218043_adult_entertainment_.password_reset_codes(code);
CREATE INDEX IF NOT EXISTS idx_password_reset_codes_expires_at ON t_p38218043_adult_entertainment_.password_reset_codes(expires_at);
