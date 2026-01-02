-- Таблица для хранения всех криптовалютных транзакций
CREATE TABLE IF NOT EXISTS crypto_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    invoice_id VARCHAR(255) UNIQUE NOT NULL,
    currency VARCHAR(10) NOT NULL,
    amount_crypto DECIMAL(20, 8) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_crypto_transactions_user_id ON crypto_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_transactions_invoice_id ON crypto_transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_crypto_transactions_status ON crypto_transactions(status);
CREATE INDEX IF NOT EXISTS idx_crypto_transactions_created_at ON crypto_transactions(created_at DESC);

COMMENT ON TABLE crypto_transactions IS 'История всех криптовалютных транзакций (депозиты и выводы)';
COMMENT ON COLUMN crypto_transactions.invoice_id IS 'UUID инвойса из CryptoCloud';
COMMENT ON COLUMN crypto_transactions.amount_crypto IS 'Сумма в криптовалюте';
COMMENT ON COLUMN crypto_transactions.processed_at IS 'Время обработки транзакции (зачисления/списания)';
