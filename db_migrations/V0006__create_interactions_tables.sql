-- Favorites: избранное пользователей
CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    catalog_item_id BIGINT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, catalog_item_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- Bookings: бронирования
CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    catalog_item_id BIGINT,
    service_id BIGINT,
    
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    duration INT,
    note TEXT,
    
    status VARCHAR(20) DEFAULT 'pending',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_catalog_item ON bookings(catalog_item_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);

-- Reviews: отзывы
CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    catalog_item_id BIGINT,
    service_id BIGINT,
    
    rating INT NOT NULL,
    text TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_catalog_item ON reviews(catalog_item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service ON reviews(service_id);

COMMENT ON TABLE favorites IS 'Избранные объявления пользователей';
COMMENT ON TABLE bookings IS 'Бронирования услуг';
COMMENT ON TABLE reviews IS 'Отзывы о услугах';