-- Catalog Items: объявления девушек (старая система + агентства)
CREATE TABLE IF NOT EXISTS catalog_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    agency_id BIGINT,
    agency_name VARCHAR(255),
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    
    age INT,
    height INT,
    body_type VARCHAR(50),
    country VARCHAR(100),
    location VARCHAR(255),
    
    image_url TEXT,
    avatar_url TEXT,
    images TEXT[],
    
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    work_schedule JSONB,
    
    views_count INT DEFAULT 0,
    bookings_count INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_catalog_items_user ON catalog_items(user_id);
CREATE INDEX IF NOT EXISTS idx_catalog_items_agency ON catalog_items(agency_id);
CREATE INDEX IF NOT EXISTS idx_catalog_items_category ON catalog_items(category);
CREATE INDEX IF NOT EXISTS idx_catalog_items_active ON catalog_items(is_active);
CREATE INDEX IF NOT EXISTS idx_catalog_items_location ON catalog_items(location);

COMMENT ON TABLE catalog_items IS 'Объявления девушек из каталога';