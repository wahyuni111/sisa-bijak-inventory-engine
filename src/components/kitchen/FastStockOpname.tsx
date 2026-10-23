import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Minus, 
  Plus, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  Timer, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Ingredient } from '../../domain/entities/Ingredient';

interface FastStockOpnameProps {
  ingredients: Ingredient[];
  onSaveOpname: (updatedStocks: Record<string, number>) => void;
  staffName: string;
}

export const FastStockOpname: React.FC<FastStockOpnameProps> = ({
  ingredients,
  onSaveOpname,
  staffName
}) => {
  // Local state for fast input tracking
  const [stockValues, setStockValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    ingredients.forEach(i => {
      initial[i.id] = i.currentStock;
    });
    return initial;
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleStep = (id: string, delta: number) => {
    setStockValues(prev => {
      const current = prev[id] ?? 0;
      const next = Math.max(0, Number((current + delta).toFixed(2)));
      return { ...prev, [id]: next };
    });
  };

  const handleInputChange = (id: string, val: string) => {
    const num = parseFloat(val);
    setStockValues(prev => ({
      ...prev,
      [id]: isNaN(num) ? 0 : Math.max(0, num)
    }));
  };

  const handleResetToCurrent = () => {
    const reset: Record<string, number> = {};
    ingredients.forEach(i => {
      reset[i.id] = i.currentStock;
    });
    setStockValues(reset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveOpname(stockValues);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Kitchen Staff Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-gold-400/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gold-400/20 border border-gold-400/40 flex items-center justify-center text-gold-400">
                <ClipboardCheck className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                Closing Shift Audit Module
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Audit Sisa Bahan Fisik Dapur (Stock Opname)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Petugas Dapur: <strong className="text-white">{staffName}</strong>. Masukkan sisa timbangan bahan fisik sebelum tutup outlet. Data akan otomatis mengkalkulasi rekomendasi belanja esok hari.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 self-start sm:self-auto">
            <Timer className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Target Waktu</p>
              <p className="text-xs font-bold text-white">&lt; 3 Menit Selesai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Opname Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Daftar Timbangan Sisa Bahan Fisik Gudang & Dapur
            </h3>
            <p className="text-xs text-slate-500">
              Gunakan tombol plus/minus cepat atau ketik langsung angka hasil timbangan.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetToCurrent}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>
        </div>

        {/* Input Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {ingredients.map(ing => {
            const currentVal = stockValues[ing.id] ?? 0;
            const isCritical = currentVal <= ing.safetyStock;

            return (
              <div 
                key={ing.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCritical 
                    ? 'border-rose-300/80 bg-rose-50/30' 
                    : 'border-slate-200 bg-white hover:border-gold-400/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {ing.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Safety Stock Minimum: <span className="font-semibold text-slate-700">{ing.safetyStock} {ing.unit}</span>
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isCritical 
                      ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}>
                    {isCritical ? 'Perlu Restock' : 'Stok Aman'}
                  </span>
                </div>

                {/* Counter / Input Controls */}
                <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStep(ing.id, -1)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 font-bold transition-all"
                      title="-1.0"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStep(ing.id, -0.5)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 text-xs font-bold transition-all"
                      title="-0.5"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Input Center */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={currentVal}
                      onChange={(e) => handleInputChange(ing.id, e.target.value)}
                      className="w-20 text-center font-extrabold text-base py-1.5 px-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 focus:bg-white text-slate-900"
                    />
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      {ing.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStep(ing.id, 0.5)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 text-xs font-bold transition-all"
                      title="+0.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStep(ing.id, 1)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 font-bold transition-all"
                      title="+1.0"
                    >
                      +1
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Kalkulasi Reverse-BOM & Rencana Pengadaan esok hari langsung ter-update seketika.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-slate-950 font-extrabold text-sm shadow-gold-glow hover:shadow-gold-glow-lg transition-all active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Simpan & Sinkronisasi Dapur</span>
          </button>
        </div>

        {/* Success Alert */}
        {isSaved && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Stock Opname fisik berhasil dicatat! Mesin Reverse-BOM telah menghitung ulang rekomendasi belanja bersih di Dashboard Owner.</span>
          </div>
        )}

      </form>

    </div>
  );
};
