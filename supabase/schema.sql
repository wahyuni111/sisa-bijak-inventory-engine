-- ==============================================================================
-- SISA-BIJAK: Platform Audit Sisa Pangan dan Rekomendasi Pengadaan Cerdas
-- Database Schema for Supabase (PostgreSQL 15+)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STORES (Outlet Restoran UMKM)
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    owner_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. USERS (Pengguna Sistem dengan Peran OWNER / STAFF)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('OWNER', 'STAFF')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. INGREDIENTS (Daftar Bahan Baku & Stok Gudang)
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'kg', 'liter', 'gram', 'ml', 'pcs'
    cost_per_unit NUMERIC(12, 2) NOT NULL DEFAULT 0,
    safety_stock NUMERIC(10, 2) NOT NULL DEFAULT 0,
    current_stock NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. MENUS (Daftar Menu Siap Saji)
CREATE TABLE IF NOT EXISTS menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. RECIPE BOMS (Bill of Materials Gramasi Bahan per Porsi Menu)
CREATE TABLE IF NOT EXISTS recipe_boms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID REFERENCES menus(id) ON DELETE CASCADE NOT NULL,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE RESTRICT NOT NULL,
    quantity_per_portion NUMERIC(10, 4) NOT NULL, -- Gramasi atau liter per 1 porsi menu
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(menu_id, ingredient_id)
);

-- 6. DAILY STOCK OPNAMES (Pencatatan Fisik Sisa Bahan Saat Tutup Shift)
CREATE TABLE IF NOT EXISTS daily_stock_opnames (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    opname_date DATE NOT NULL DEFAULT CURRENT_DATE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE RESTRICT NOT NULL,
    remaining_stock NUMERIC(10, 2) NOT NULL,
    recorded_by UUID REFERENCES users(id),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PROCUREMENT PLANS (Hasil Kalkulasi Rekomendasi Belanja Bersih & Status Peringatan)
CREATE TABLE IF NOT EXISTS procurement_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    plan_date DATE NOT NULL DEFAULT CURRENT_DATE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE RESTRICT NOT NULL,
    gross_forecast_need NUMERIC(10, 2) NOT NULL,
    current_stock NUMERIC(10, 2) NOT NULL,
    net_recommendation NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) CHECK (status IN ('BELI', 'STOP RESTOCK')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_ingredients_store ON ingredients(store_id);
CREATE INDEX IF NOT EXISTS idx_menus_store ON menus(store_id);
CREATE INDEX IF NOT EXISTS idx_boms_menu ON recipe_boms(menu_id);
CREATE INDEX IF NOT EXISTS idx_opnames_date_store ON daily_stock_opnames(store_id, opname_date);
CREATE INDEX IF NOT EXISTS idx_procurement_date ON procurement_plans(store_id, plan_date);

-- ==============================================================================
-- SEED DATA (Ayam Geprek Sambal Korek Barokah - Cabang Purwokerto)
-- ==============================================================================

-- 1. Insert Store
INSERT INTO stores (id, name, location) 
VALUES ('a1b2c3d4-0001-4000-8000-000000000001', 'Ayam Geprek Sambal Korek Barokah - Purwokerto Branch', 'Jl. HR Bunyamin No. 45, Purwokerto Utara, Banyumas')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Users
INSERT INTO users (id, store_id, email, full_name, role)
VALUES 
('b1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'owner@sisabijak.com', 'H. Barokah (Owner)', 'OWNER'),
('b1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001', 'staff@sisabijak.com', 'Budi Santoso (Kitchen Staff)', 'STAFF')
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Ingredients
INSERT INTO ingredients (id, store_id, name, unit, cost_per_unit, safety_stock, current_stock)
VALUES 
('c1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'Daging Ayam Karkas', 'kg', 34000, 3.0, 5.5),
('c1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001', 'Keju Mozarella', 'kg', 105000, 1.0, 4.8),
('c1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000001', 'Cabai Rawit Merah', 'kg', 58000, 1.0, 1.2),
('c1b2c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0001-4000-8000-000000000001', 'Minyak Goreng', 'liter', 17500, 5.0, 6.2),
('c1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0001-4000-8000-000000000001', 'Beras Pulen', 'kg', 15500, 10.0, 11.5),
('c1b2c3d4-0006-4000-8000-000000000006', 'a1b2c3d4-0001-4000-8000-000000000001', 'Bawang Putih Kating', 'kg', 42000, 1.0, 1.4),
('c1b2c3d4-0007-4000-8000-000000000007', 'a1b2c3d4-0001-4000-8000-000000000001', 'Tepung Bumbu Crispy', 'kg', 16000, 4.0, 5.0),
('c1b2c3d4-0008-4000-8000-000000000008', 'a1b2c3d4-0001-4000-8000-000000000001', 'Gula Pasir & Teh', 'kg', 18000, 2.5, 8.0)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Menus
INSERT INTO menus (id, store_id, name, category, price, is_active)
VALUES
('d1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'Paket Geprek Original', 'Makanan', 16000, true),
('d1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000001', 'Paket Geprek Keju Mozarella', 'Makanan', 22000, true),
('d1b2c3d4-0003-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000001', 'Paket Ayam Bakar Madu', 'Makanan', 20000, true),
('d1b2c3d4-0004-4000-8000-000000000004', 'a1b2c3d4-0001-4000-8000-000000000001', 'Kulit Crispy Barokah', 'Camilan', 12000, true),
('d1b2c3d4-0005-4000-8000-000000000005', 'a1b2c3d4-0001-4000-8000-000000000001', 'Es Teh Jumbo', 'Minuman', 5000, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Recipe BOMs (Gramasi per Porsi Menu)
INSERT INTO recipe_boms (menu_id, ingredient_id, quantity_per_portion)
VALUES
-- Geprek Original: 180g Ayam, 120g Beras, 30ml Minyak, 15g Cabai, 8g Bawang, 40g Tepung
('d1b2c3d4-0001-4000-8000-000000000001', 'c1b2c3d4-0001-4000-8000-000000000001', 0.180),
('d1b2c3d4-0001-4000-8000-000000000001', 'c1b2c3d4-0005-4000-8000-000000000005', 0.120),
('d1b2c3d4-0001-4000-8000-000000000001', 'c1b2c3d4-0004-4000-8000-000000000004', 0.030),
('d1b2c3d4-0001-4000-8000-000000000001', 'c1b2c3d4-0003-4000-8000-000000000003', 0.015),
('d1b2c3d4-0001-4000-8000-000000000001', 'c1b2c3d4-0006-4000-8000-000000000006', 0.008),
('d1b2c3d4-0001-4000-8000-000000000001', 'c1b2c3d4-0007-4000-8000-000000000007', 0.040),

-- Geprek Keju Mozarella: 180g Ayam, 120g Beras, 30ml Minyak, 15g Cabai, 45g Keju, 40g Tepung
('d1b2c3d4-0002-4000-8000-000000000002', 'c1b2c3d4-0001-4000-8000-000000000001', 0.180),
('d1b2c3d4-0002-4000-8000-000000000002', 'c1b2c3d4-0005-4000-8000-000000000005', 0.120),
('d1b2c3d4-0002-4000-8000-000000000002', 'c1b2c3d4-0004-4000-8000-000000000004', 0.030),
('d1b2c3d4-0002-4000-8000-000000000002', 'c1b2c3d4-0003-4000-8000-000000000003', 0.015),
('d1b2c3d4-0002-4000-8000-000000000002', 'c1b2c3d4-0002-4000-8000-000000000002', 0.045),
('d1b2c3d4-0002-4000-8000-000000000002', 'c1b2c3d4-0007-4000-8000-000000000007', 0.040),

-- Es Teh Jumbo: 35g Gula & Racikan Teh
('d1b2c3d4-0005-4000-8000-000000000005', 'c1b2c3d4-0008-4000-8000-000000000008', 0.035)
ON CONFLICT DO NOTHING;
