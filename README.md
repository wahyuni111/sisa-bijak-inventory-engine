# 🌾 SISA-BIJAK
> **Platform Audit Sisa Pangan dan Rekomendasi Pengadaan Bahan Baku Berbasis Analitik Prediktif pada UMKM Kuliner**

![Theme](https://img.shields.io/badge/Theme-Refined%20Culinary%20Gold-D4AF37)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20OOP%20%26%20Domain%20Driven-0F172A)
![Stack](https://img.shields.io/badge/Tech%20Stack-React%2018%20%7C%20TypeScript%20%7C%20TailwindCSS%20%7C%20Supabase-blue)

---

## 📌 1. Latar Belakang & Konteks Pilot
**SISA-BIJAK** dirancang khusus untuk mengatasi dilema klasik UMKM kuliner di Indonesia:
- **Capital Lockup & Bahan Busuk (*Perishables*)**: Pengadaan bahan basah (ayam potong, cabai rawit, bumbu) sering kali dilakukan secara intuitif ("kira-kira"), mengakibatkan kelebihan stok (*overstock*) yang berakhir menjadi sampah pangan (*food waste*).
- **Reverse-BOM Gap**: Ketiadaan kalkulasi otomatis dari proyeksi menu porsi matang ke gramasi bahan mentah fisik.
- **Kasus Uji Nyata**: *Ayam Geprek Sambal Korek Barokah - Cabang Purwokerto (Depan Kampus Unsoed)*, dengan dinamika cuaca lereng Gunung Slamet dan lonjakan konsumsi akhir pekan (*weekend surge*).

---

## 🏛️ 2. Clean Architecture & Object-Oriented Design (OOP)

Sistem dibangun dengan pemisahan tanggung jawab yang ketat (*Separation of Concerns*):

```
e:\SISA BIJAK\
├── src/
│   ├── domain/
│   │   ├── entities/                  # Domain Entities & Invariant Validation
│   │   │   ├── Ingredient.ts          # Bahan Baku, unit, safety stock, cost
│   │   │   ├── Menu.ts                # Produk jadi restoran, baseline demand
│   │   │   ├── RecipeBOM.ts           # Gramasi bahan per 1 porsi piring
│   │   │   ├── StockOpname.ts         # Audit fisik closing shift dapur
│   │   │   ├── ProcurementPlan.ts     # Status Rekomendasi BELI vs STOP RESTOCK
│   │   │   ├── Store.ts               # Outlet / Cabang usaha
│   │   │   └── User.ts                # Pengguna peran OWNER vs STAFF
│   │   └── repositories/
│   │       └── IRepositories.ts       # Interface-based Repository Pattern
│   │
│   ├── services/
│   │   ├── ForecastingService.ts      # Machine Learning Predictor (XGBoost logic wrapper)
│   │   ├── InventoryEngine.ts         # Reverse-BOM Calculator & Net Requirement Solver
│   │   └── AuthService.ts             # Role-based access & switch presets
│   │
│   ├── data/
│   │   ├── seedData.ts                # Data riil Purwokerto (Ayam Geprek Barokah)
│   │   ├── MockRepository.ts          # InMemory UnitOfWork Driver (Zero config)
│   │   └── SupabaseRepository.ts      # Supabase Client Driver
│   │
│   ├── components/
│   │   ├── layout/Header.tsx          # Sticky bar, Active Store chip, Role Switcher
│   │   ├── dashboard/KPICards.tsx     # 4 Executive KPI cards (Modal, Waste %, etc.)
│   │   ├── dashboard/ForecastChart.tsx # Recharts actual sales vs AI forecast
│   │   ├── dashboard/SimulationControls.tsx # What-if analysis (Curah Hujan & Weekend)
│   │   ├── dashboard/ProcurementTable.tsx # Tabel pengadaan cerdas & Ekspor WA/PDF
│   │   ├── kitchen/FastStockOpname.tsx # Formulir closing shift dapur (< 3 menit)
│   │   └── modal/                     # Modal BOM Resep & Integrasi Supabase
│   │
│   ├── App.tsx                        # Root Component
│   ├── main.tsx
│   └── index.css                      # Refined Culinary Gold styling
│
├── supabase/
│   └── schema.sql                     # PostgreSQL DDL 7 Tabel & Seed SQL
├── PRD.md                             # Product Requirements Document resmi
└── package.json
```

---

## 🧮 3. Algoritma Prediktif & Logika Reverse-BOM

### A. Model Prediksi Permintaan (XGBoost Regressor)
Memproyeksikan porsi menu esok hari ($D+1$) dengan *feature engineering*:
$$\text{Proyeksi Porsi}_m = \text{BaseDemand}_m \times \text{Factor}(\text{DayOfWeek}) \times \text{Factor}(\text{Weekend}) \times \text{Factor}(\text{Holiday}) \times \text{Factor}(\text{Rainfall\_mm})$$
- **Hujan Lebat di Purwokerto ($>25\text{ mm}$)**: Pesanan pesan-antar makanan pedas hangat meningkat ($+12\%$), sedangkan konsumsi minuman es menurun ($-18\%$).
- **Weekend / Hari Libur**: Lonjakan konsumsi paket keluarga hingga $+35\%\text{ s/d }+50\%$.

### B. Mesin Reverse-BOM & Belanja Bersih (Net Requirement Engine)
1. **Kebutuhan Kotor (*Gross Need*)**:
   $$\text{Gross}_i = \sum_{m} (\text{Predicted Portions}_m \times \text{Gramasi Resep}_{m, i})$$
2. **Kebutuhan Belanja Bersih (*Net Recommendation*)**:
   $$\text{Net}_i = (\text{Gross}_i + \text{Safety Stock}_i) - \text{Stok Fisik Gudang}_i$$
3. **Status Alert**:
   - Jika $\text{Net}_i > 0 \rightarrow$ **`REKOMENDASI BELI`** (dengan kalkulasi estimasi anggaran belanja).
   - Jika $\text{Net}_i \le 0 \rightarrow$ **`STOP RESTOCK / JANGAN BELI`** (dengan kalkulasi estimasi modal kerja yang berhasil dihemat dan durasi ketahanan sisa stok).

---

## 🧪 4. Studi Kasus & Edge Cases pada Data Uji

1. **Daging Ayam Karkas (Stok Rendah, Kebutuhan Tinggi)**:
   - Sisa gudang: 5.5 Kg
   - Kebutuhan esok + buffer: 14.0 Kg
   - **Keputusan**: `REKOMENDASI BELI` $\rightarrow$ **+8.5 Kg** (Prioritas belanja).
2. **Keju Mozarella (Dead-Stock Berlebih)**:
   - Sisa gudang: 4.8 Kg (Pembelian berlebih shift sebelumnya).
   - Kebutuhan esok: 0.7 Kg
   - **Keputusan**: `STOP RESTOCK / JANGAN BELI` (Badge menyala Crimson/Gold. Stok aman mencukupi hingga 6–7 hari ke depan, menghemat modal Rp 400.000+).

---

## 🚀 5. Cara Menjalankan Aplikasi Secara Lokal

### Prasyarat
- Node.js (v18 ke atas atau v24)
- npm

### Langkah Eksekusi:
```bash
# 1. Masuk ke direktori proyek
cd "e:\SISA BIJAK"

# 2. Jalankan development server
npm run dev
```

Buka browser Anda di `http://localhost:3000`. Aplikasi akan langsung aktif dalam mode **Mock In-Memory Repository** dengan data realistik Purwokerto siap pakai tanpa konfigurasi awal.

---

## 🗄️ 6. Menghubungkan ke Supabase (Opsional)

Jika Anda ingin menyimpan data secara persisten ke cloud Supabase:

1. Buat project baru di [supabase.com](https://supabase.com).
2. Masuk ke menu **SQL Editor** di dashboard Supabase.
3. Buka file `supabase/schema.sql` pada proyek ini, salin seluruh kodenya, dan jalankan (*Run*) di Supabase SQL Editor.
4. Buat file `.env.local` di root proyek:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Restart aplikasi (`npm run dev`), dan status database pada header akan otomatis beralih menjadi **`Supabase Live`**.

---

## 👥 7. Panduan Peran Pengguna (Role Switcher)

Anda dapat menguji kedua perspektif peran secara instan menggunakan tombol **Switch Role** pada header:
- **Owner / Manager (`owner@sisabijak.com`)**:
  - Melihat 4 Kartu KPI Eksekutif (Estimasi Penghematan Modal, Proyeksi Porsi, Jumlah Stop Restock, Indeks Food Waste).
  - Melakukan simulasi skenario cuaca & hari libur (*What-If Analysis*).
  - Melihat grafik Recharts tren permintaan 7 hari.
  - Memfilter tabel rekomendasi belanja dan mengekspor daftar belanja langsung ke format **WhatsApp** atau cetak **PDF**.
  - Mengubah gramasi resep BOM per menu.
- **Kitchen Staff (`staff@sisabijak.com`)**:
  - Tampilan formulir cepat audit fisik penutupan shift (*Closing Stock Opname*).
  - Desain tombol stepper numerik cepat ($-1$, $-0.5$, $+0.5$, $+1$) yang dirancang tuntas dalam **waktu kurang dari 3 menit**.
  - Sekali klik simpan, kalkulasi belanja esok hari langsung terbarui secara reaktif di dashboard Owner.
