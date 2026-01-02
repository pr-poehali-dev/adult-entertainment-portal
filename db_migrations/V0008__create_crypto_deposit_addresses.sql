-- Таблица для хранения криптовалютных адресов депозитов пользователей
CREATE TABLE IF NOT EXISTS crypto_deposit_addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    currency VARCHAR(10) NOT NULL, -- BTC, ETH, USDT, etc.
    address VARCHAR(255) NOT NULL,
    tag VARCHAR(100), -- memo/tag для некоторых криптовалют (XRP, XLM и т.д.)
    
    -- CryptoCloud данные
    invoice_id VARCHAR(255), -- ID инвойса в CryptoCloud
    status VARCHAR(20) DEFAULT 'active', -- active, used, expired
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    
    UNIQUE(user_id, currency, address)
);

CREATE INDEX IF NOT EXISTS idx_crypto_addresses_user ON crypto_deposit_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_addresses_currency ON crypto_deposit_addresses(currency);
CREATE INDEX IF NOT EXISTS idx_crypto_addresses_invoice ON crypto_deposit_addresses(invoice_id);

COMMENT ON TABLE crypto_deposit_addresses IS 'Уникальные криптовалютные адреса для депозитов через CryptoCloud';
COMMENT ON COLUMN crypto_deposit_addresses.tag IS 'Memo/tag для валют требующих дополнительную идентификацию (XRP, XLM, EOS и т.д.)';
COMMENT ON COLUMN crypto_deposit_addresses.invoice_id IS 'ID инвойса в системе CryptoCloud для отслеживания платежей';