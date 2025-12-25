-- Таблица для хранения истории платежей через Telegram
CREATE TABLE IF NOT EXISTS telegram_payments (
    id SERIAL PRIMARY KEY,
    telegram_user_id BIGINT NOT NULL,
    telegram_payment_charge_id TEXT NOT NULL UNIQUE,
    provider_payment_charge_id TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'RUB',
    payload JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

-- Индексы для быстрого поиска
CREATE INDEX idx_telegram_payments_user_id ON telegram_payments(telegram_user_id);
CREATE INDEX idx_telegram_payments_status ON telegram_payments(status);
CREATE INDEX idx_telegram_payments_created_at ON telegram_payments(created_at DESC);

-- Таблица для связи telegram_user_id с внутренним user_id
CREATE TABLE IF NOT EXISTS user_telegram_mapping (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    telegram_user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_telegram_user_id ON user_telegram_mapping(user_id);
CREATE INDEX idx_user_telegram_tg_id ON user_telegram_mapping(telegram_user_id);
