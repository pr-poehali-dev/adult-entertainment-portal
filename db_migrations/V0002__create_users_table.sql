-- Users table: хранение всех пользователей (обычные и бизнес-аккаунты)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'buyer',
    business_type VARCHAR(20),
    referral_code VARCHAR(50) UNIQUE,
    referred_by_id BIGINT,
    
    name VARCHAR(255),
    nickname VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    phone VARCHAR(50),
    telegram_username VARCHAR(100),
    
    profile_completed BOOLEAN DEFAULT FALSE,
    kyc_completed BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMP,
    
    agency_id BIGINT,
    agency_name VARCHAR(255),
    agency_type VARCHAR(20),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

COMMENT ON TABLE users IS 'Все пользователи: обычные покупатели, продавцы и бизнес-аккаунты';