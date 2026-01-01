-- Business Services Categories
CREATE TABLE IF NOT EXISTS business_service_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Business Services: услуги от бизнес-аккаунтов
CREATE TABLE IF NOT EXISTS business_services (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    
    images TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_business_services_user ON business_services(user_id);
CREATE INDEX IF NOT EXISTS idx_business_services_category ON business_services(category_id);
CREATE INDEX IF NOT EXISTS idx_business_services_status ON business_services(status);

-- Service Programs: тарифные планы для каждой услуги
CREATE TABLE IF NOT EXISTS service_programs (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'RUB',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_programs_service ON service_programs(service_id);

COMMENT ON TABLE business_services IS 'Услуги от бизнес-аккаунтов с программами обслуживания';
COMMENT ON TABLE service_programs IS 'Тарифные планы для бизнес-услуг (час/ночь/день)';