import React, { useState } from 'react';
import { 
  Wheat, 
  Store as StoreIcon, 
  ChevronDown, 
  UserCheck, 
  ShieldCheck, 
  UtensilsCrossed, 
  Database, 
  SlidersHorizontal,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { User, UserRole } from '../../domain/entities/User';
import { Store } from '../../domain/entities/Store';

interface HeaderProps {
  currentUser: User;
  stores: Store[];
  activeStoreId: string;
  onSelectStore: (storeId: string) => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenBOMModal: () => void;
  onOpenSupabaseModal: () => void;
  onResetData: () => void;
  isSupabaseConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  stores,
  activeStoreId,
  onSelectStore,
  onSwitchRole,
  onOpenBOMModal,
  onOpenSupabaseModal,
  onResetData,
  isSupabaseConnected
}) => {
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const activeStore = stores.find(s => s.id === activeStoreId) || stores[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* 1. BRANDING & SYSTEM LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center shadow-gold-glow">
              <Wheat className="w-6 h-6 text-slate-950 transform rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-white">
                  SISA<span className="text-gold-400">-BIJAK</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-400/20 text-gold-300 border border-gold-400/30 px-1.5 py-0.5 rounded">
                  v1.0 AI Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Audit Sisa Pangan & Pengadaan Cerdas UMKM
              </p>
            </div>
          </div>

          {/* 2. ACTIVE STORE CONTEXT CHIP */}
          <div className="relative">
            <button
              onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-gold-400/20 hover:border-gold-400/40 transition-all text-left shadow-sm group"
            >
              <div className="w-7 h-7 rounded-lg bg-gold-400/15 flex items-center justify-center text-gold-400 group-hover:scale-105 transition-transform">
                <StoreIcon className="w-4 h-4" />
              </div>
              <div className="max-w-[200px] md:max-w-[280px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-200 truncate block">
                    {activeStore ? activeStore.name : 'Pilih Cabang Outlet'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate">
                  <MapPin className="w-3 h-3 text-gold-400 shrink-0" />
                  <span className="truncate">{activeStore?.location || 'Purwokerto'}</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${storeDropdownOpen ? 'rotate-180 text-gold-400' : ''}`} />
            </button>

            {/* Store Dropdown Menu */}
            {storeDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Daftar Cabang Aktif
                </div>
                {stores.map(store => (
                  <button
                    key={store.id}
                    onClick={() => {
                      onSelectStore(store.id);
                      setStoreDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 hover:bg-slate-800/80 transition-colors ${
                      store.id === activeStoreId ? 'bg-gold-400/10 text-gold-300 font-medium' : 'text-slate-300'
                    }`}
                  >
                    <StoreIcon className={`w-4 h-4 mt-0.5 shrink-0 ${store.id === activeStoreId ? 'text-gold-400' : 'text-slate-500'}`} />
                    <div>
                      <p className="text-xs font-semibold">{store.name}</p>
                      <p className="text-[11px] text-slate-400">{store.location}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. RIGHT CONTROLS: RECIPE BOM, DATABASE & USER ROLE BADGE */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* BOM Recipe Modal Button */}
            <button
              onClick={onOpenBOMModal}
              title="Atur Gramasi Resep & BOM per Menu"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-gold-300 text-xs font-medium border border-slate-700 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden md:inline">Konfigurasi BOM</span>
            </button>

            {/* Supabase Status Pill */}
            <button
              onClick={onOpenSupabaseModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isSupabaseConnected 
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600/40' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-gold-400/40'
              }`}
              title="Status Database & Schema Supabase"
            >
              <Database className={`w-3.5 h-3.5 ${isSupabaseConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="hidden lg:inline">
                {isSupabaseConnected ? 'Supabase Live' : 'Mock In-Memory'}
              </span>
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              title="Reset Simulasi ke Seed Data Awal"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* USER ROLE INDICATOR & SWITCHER */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-gold-400/30 hover:border-gold-400 transition-all group"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  currentUser.isOwner() 
                    ? 'bg-gradient-to-tr from-gold-500 to-amber-300 text-slate-950' 
                    : 'bg-gradient-to-tr from-cyan-600 to-blue-400 text-white'
                }`}>
                  {currentUser.isOwner() ? 'OW' : 'KS'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-200">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tight ${
                      currentUser.isOwner() 
                        ? 'bg-gold-400/20 text-gold-300 border border-gold-400/40' 
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Dropdown Switcher */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in">
                  <div className="px-3.5 py-2 border-b border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Demo Persona (Role Switcher)
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Ganti peran untuk menguji pengalaman pengguna yang berbeda:
                    </p>
                  </div>

                  {/* Owner Option */}
                  <button
                    onClick={() => {
                      onSwitchRole('OWNER');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 hover:bg-slate-800 transition-colors ${
                      currentUser.isOwner() ? 'bg-gold-400/10 text-gold-300' : 'text-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-gold-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">Owner / Manager</span>
                        {currentUser.isOwner() && <span className="text-[10px] bg-gold-400 text-slate-950 px-1 font-bold rounded">Aktif</span>}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Akses Executive Dashboard, Proyeksi Forecast, & Rekomendasi Belanja Bersih.
                      </p>
                    </div>
                  </button>

                  {/* Kitchen Staff Option */}
                  <button
                    onClick={() => {
                      onSwitchRole('STAFF');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 hover:bg-slate-800 transition-colors ${
                      currentUser.isStaff() ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-300'
                    }`}
                  >
                    <UtensilsCrossed className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">Kitchen Staff (Dapur)</span>
                        {currentUser.isStaff() && <span className="text-[10px] bg-cyan-400 text-slate-950 px-1 font-bold rounded">Aktif</span>}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Akses Cepat Stock Opname Fisik Closing Shift (&lt; 3 menit).
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
