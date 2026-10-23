import { Store } from '../domain/entities/Store';
import { User } from '../domain/entities/User';
import { Ingredient } from '../domain/entities/Ingredient';
import { Menu } from '../domain/entities/Menu';
import { RecipeBOM } from '../domain/entities/RecipeBOM';

export const INITIAL_STORES: Store[] = [
  new Store({
    id: 'store-barokah-pwt',
    name: 'Ayam Geprek Sambal Korek Barokah - Purwokerto Branch',
    location: 'Jl. HR Bunyamin No. 45, Grendeng, Purwokerto Utara (Depan Kampus Unsoed)',
    ownerId: 'user-owner',
    createdAt: '2024-01-15T08:00:00Z',
    phone: '+6281234567890'
  }),
  new Store({
    id: 'store-barokah-dukuhwaluh',
    name: 'Ayam Geprek Sambal Korek Barokah - Dukuhwaluh Branch',
    location: 'Jl. Raden Patah No. 12, Kembaran, Banyumas (Dekat UMP)',
    ownerId: 'user-owner',
    createdAt: '2024-06-01T08:00:00Z',
    phone: '+6281298765432'
  })
];

export const INITIAL_USERS: User[] = [
  new User({
    id: 'user-owner',
    storeId: 'store-barokah-pwt',
    email: 'owner@sisabijak.com',
    fullName: 'H. Barokah Al-Fatih',
    role: 'OWNER',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  }),
  new User({
    id: 'user-staff',
    storeId: 'store-barokah-pwt',
    email: 'staff@sisabijak.com',
    fullName: 'Budi Santoso',
    role: 'STAFF',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  })
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  new Ingredient({
    id: 'ing-ayam',
    storeId: 'store-barokah-pwt',
    name: 'Daging Ayam Karkas Segar',
    unit: 'kg',
    costPerUnit: 34000,
    safetyStock: 3.0,
    currentStock: 5.5, // Menipis dibandingkan forecast 14.5 kg -> Triggers BELI 12 kg
    category: 'protein',
    shelfLifeDays: 2
  }),
  new Ingredient({
    id: 'ing-keju',
    storeId: 'store-barokah-pwt',
    name: 'Keju Mozarella Block Melt',
    unit: 'kg',
    costPerUnit: 105000,
    safetyStock: 1.0,
    currentStock: 4.8, // Dead-stock melimpah! -> Triggers STOP RESTOCK / JANGAN BELI (Aman 6-7 hari)
    category: 'dairy',
    shelfLifeDays: 21
  }),
  new Ingredient({
    id: 'ing-cabai',
    storeId: 'store-barokah-pwt',
    name: 'Cabai Rawit Merah Segar (Lokal)',
    unit: 'kg',
    costPerUnit: 58000,
    safetyStock: 1.0,
    currentStock: 1.2, // Cepat busuk dalam 2 hari, perlu kalkulasi presisi
    category: 'perishable',
    shelfLifeDays: 3
  }),
  new Ingredient({
    id: 'ing-minyak',
    storeId: 'store-barokah-pwt',
    name: 'Minyak Goreng Sawit Kelapa',
    unit: 'liter',
    costPerUnit: 17500,
    safetyStock: 5.0,
    currentStock: 6.2,
    category: 'condiment',
    shelfLifeDays: 90
  }),
  new Ingredient({
    id: 'ing-beras',
    storeId: 'store-barokah-pwt',
    name: 'Beras Pulen Cianjur Super',
    unit: 'kg',
    costPerUnit: 15500,
    safetyStock: 10.0,
    currentStock: 11.5,
    category: 'dry',
    shelfLifeDays: 60
  }),
  new Ingredient({
    id: 'ing-bawang',
    storeId: 'store-barokah-pwt',
    name: 'Bawang Putih Kating Kupas',
    unit: 'kg',
    costPerUnit: 42000,
    safetyStock: 1.0,
    currentStock: 1.4,
    category: 'condiment',
    shelfLifeDays: 14
  }),
  new Ingredient({
    id: 'ing-tepung',
    storeId: 'store-barokah-pwt',
    name: 'Tepung Bumbu Crispy Barokah',
    unit: 'kg',
    costPerUnit: 16000,
    safetyStock: 4.0,
    currentStock: 5.0,
    category: 'dry',
    shelfLifeDays: 90
  }),
  new Ingredient({
    id: 'ing-gulateh',
    storeId: 'store-barokah-pwt',
    name: 'Gula Pasir & Racikan Daun Teh Melati',
    unit: 'kg',
    costPerUnit: 18000,
    safetyStock: 2.5,
    currentStock: 8.0, // Sangat melimpah -> Triggers STOP RESTOCK
    category: 'dry',
    shelfLifeDays: 90
  })
];

export const INITIAL_MENUS: Menu[] = [
  new Menu({
    id: 'menu-geprek-ori',
    storeId: 'store-barokah-pwt',
    name: 'Paket Geprek Original Barokah',
    category: 'Makanan Utama',
    price: 16000,
    isActive: true,
    baseDailyDemand: 65 // baseline porsi per hari
  }),
  new Menu({
    id: 'menu-geprek-keju',
    storeId: 'store-barokah-pwt',
    name: 'Paket Geprek Keju Mozarella Melt',
    category: 'Makanan Utama',
    price: 22000,
    isActive: true,
    baseDailyDemand: 28
  }),
  new Menu({
    id: 'menu-bakar-madu',
    storeId: 'store-barokah-pwt',
    name: 'Paket Ayam Bakar Madu Purwokerto',
    category: 'Makanan Utama',
    price: 20000,
    isActive: true,
    baseDailyDemand: 32
  }),
  new Menu({
    id: 'menu-kulit-crispy',
    storeId: 'store-barokah-pwt',
    name: 'Kulit Ayam Crispy Barokah (Camilan)',
    category: 'Side Dish',
    price: 12000,
    isActive: true,
    baseDailyDemand: 25
  }),
  new Menu({
    id: 'menu-esteh-jumbo',
    storeId: 'store-barokah-pwt',
    name: 'Es Teh Manis Jumbo Barokah',
    category: 'Minuman Segar',
    price: 5000,
    isActive: true,
    baseDailyDemand: 110
  })
];

export const INITIAL_BOMS: RecipeBOM[] = [
  // 1. Paket Geprek Original
  new RecipeBOM({ id: 'bom-1', menuId: 'menu-geprek-ori', ingredientId: 'ing-ayam', quantityPerPortion: 0.180, notes: '180g daging ayam potong' }),
  new RecipeBOM({ id: 'bom-2', menuId: 'menu-geprek-ori', ingredientId: 'ing-beras', quantityPerPortion: 0.120, notes: '120g beras pulen matang' }),
  new RecipeBOM({ id: 'bom-3', menuId: 'menu-geprek-ori', ingredientId: 'ing-minyak', quantityPerPortion: 0.030, notes: '30ml serapan minyak' }),
  new RecipeBOM({ id: 'bom-4', menuId: 'menu-geprek-ori', ingredientId: 'ing-cabai', quantityPerPortion: 0.015, notes: '15g cabai rawit (level pedas standar)' }),
  new RecipeBOM({ id: 'bom-5', menuId: 'menu-geprek-ori', ingredientId: 'ing-bawang', quantityPerPortion: 0.008, notes: '8g bumbu korek bawang' }),
  new RecipeBOM({ id: 'bom-6', menuId: 'menu-geprek-ori', ingredientId: 'ing-tepung', quantityPerPortion: 0.040, notes: '40g adonan tepung crispy' }),

  // 2. Paket Geprek Keju Mozarella
  new RecipeBOM({ id: 'bom-7', menuId: 'menu-geprek-keju', ingredientId: 'ing-ayam', quantityPerPortion: 0.180, notes: '180g daging ayam' }),
  new RecipeBOM({ id: 'bom-8', menuId: 'menu-geprek-keju', ingredientId: 'ing-beras', quantityPerPortion: 0.120, notes: '120g beras pulen' }),
  new RecipeBOM({ id: 'bom-9', menuId: 'menu-geprek-keju', ingredientId: 'ing-minyak', quantityPerPortion: 0.030, notes: '30ml minyak' }),
  new RecipeBOM({ id: 'bom-10', menuId: 'menu-geprek-keju', ingredientId: 'ing-cabai', quantityPerPortion: 0.015, notes: '15g cabai rawit' }),
  new RecipeBOM({ id: 'bom-11', menuId: 'menu-geprek-keju', ingredientId: 'ing-keju', quantityPerPortion: 0.045, notes: '45g keju mozzarella parut bakar' }),
  new RecipeBOM({ id: 'bom-12', menuId: 'menu-geprek-keju', ingredientId: 'ing-tepung', quantityPerPortion: 0.040, notes: '40g tepung crispy' }),

  // 3. Paket Ayam Bakar Madu
  new RecipeBOM({ id: 'bom-13', menuId: 'menu-bakar-madu', ingredientId: 'ing-ayam', quantityPerPortion: 0.180, notes: '180g daging ayam ungkep' }),
  new RecipeBOM({ id: 'bom-14', menuId: 'menu-bakar-madu', ingredientId: 'ing-beras', quantityPerPortion: 0.120, notes: '120g beras' }),
  new RecipeBOM({ id: 'bom-15', menuId: 'menu-bakar-madu', ingredientId: 'ing-minyak', quantityPerPortion: 0.015, notes: '15ml olesan panggang' }),
  new RecipeBOM({ id: 'bom-16', menuId: 'menu-bakar-madu', ingredientId: 'ing-bawang', quantityPerPortion: 0.010, notes: '10g bumbu bakar madu' }),

  // 4. Kulit Crispy Barokah
  new RecipeBOM({ id: 'bom-17', menuId: 'menu-kulit-crispy', ingredientId: 'ing-minyak', quantityPerPortion: 0.025, notes: '25ml minyak deep fryer' }),
  new RecipeBOM({ id: 'bom-18', menuId: 'menu-kulit-crispy', ingredientId: 'ing-tepung', quantityPerPortion: 0.050, notes: '50g tepung balur crispy' }),

  // 5. Es Teh Jumbo
  new RecipeBOM({ id: 'bom-19', menuId: 'menu-esteh-jumbo', ingredientId: 'ing-gulateh', quantityPerPortion: 0.035, notes: '35g sirup teh & gula' })
];
