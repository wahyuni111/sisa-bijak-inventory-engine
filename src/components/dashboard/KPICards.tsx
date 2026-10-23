import React from 'react';
import { 
  TrendingUp, 
  PiggyBank, 
  AlertOctagon, 
  Leaf, 
  ArrowUpRight, 
  ShieldAlert,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { IExecutiveKPIs } from '../../services/InventoryEngine';

interface KPICardsProps {
  kpis: IExecutiveKPIs;
  onFilterStopRestock: () => void;
  onFilterNeedRestock: () => void;
}

export const KPICards: React.FC<KPICardsProps> = ({
  kpis,
  onFilterStopRestock,
  onFilterNeedRestock
}) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      
      {/* CARD 1: PENGHEMATAN MODAL KERJA */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gold-400/30 p-5 shadow-sm hover:shadow-gold-glow transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold-400/15 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-500 group-hover:scale-110 transition-transform">
            <PiggyBank className="w-6 h-6 text-gold-600" />
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            Anti Overstock
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
            Estimasi Modal Diselamatkan
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {formatRupiah(kpis.totalCapitalSavedRp)}
          </h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            Dari pencegahan belanja bahan berlebih
          </p>
        </div>
      </div>

      {/* CARD 2: PROYEKSI PENJUALAN MENU */}
      <div 
        onClick={onFilterNeedRestock}
        className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:border-gold-400/60 hover:shadow-sm cursor-pointer transition-all duration-300 group"
      >
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            Restock: {kpis.needRestockCount} Bahan
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
            Total Proyeksi Permintaan
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {kpis.totalPredictedPortions}
            </h3>
            <span className="text-sm font-semibold text-slate-500">Porsi Esok</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Klik untuk filter {kpis.needRestockCount} bahan perlu dibeli
          </p>
        </div>
      </div>

      {/* CARD 3: STOP RESTOCK ALERT BADGE (Crimson/Gold Glow) */}
      <div 
        onClick={onFilterStopRestock}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50/50 border border-rose-300/80 p-5 shadow-sm hover:shadow-crimson-glow cursor-pointer transition-all duration-300 group"
      >
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
            Klik Filter
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold text-rose-700 tracking-wide uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            Status: STOP RESTOCK
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-extrabold text-rose-900 tracking-tight">
              {kpis.stopRestockCount} Bahan
            </h3>
            <span className="text-xs font-bold text-rose-600">JANGAN BELI</span>
          </div>
          <p className="text-xs text-rose-600/90 mt-1">
            Stok masih melimpah (contoh: Keju Mozarella)
          </p>
        </div>
      </div>

      {/* CARD 4: FOOD WASTE PREVENTION INDEX */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-emerald-200/90 p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Green Kitchen
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
            Potensi Food Waste Tercegah
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-extrabold text-emerald-600 tracking-tight">
              {kpis.foodWastePreventionIndexPct}%
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              Sangat Efisien
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Indeks ketahanan & zero spoilage bahan
          </p>
        </div>
      </div>

    </div>
  );
};
