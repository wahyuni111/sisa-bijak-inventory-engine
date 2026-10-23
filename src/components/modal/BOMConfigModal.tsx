import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  Utensils, 
  Scale, 
  Check, 
  RotateCcw,
  Info
} from 'lucide-react';
import { Menu } from '../../domain/entities/Menu';
import { Ingredient } from '../../domain/entities/Ingredient';
import { RecipeBOM } from '../../domain/entities/RecipeBOM';

interface BOMConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  menus: Menu[];
  ingredients: Ingredient[];
  boms: RecipeBOM[];
  onUpdateBOM: (bomId: string, newQuantity: number) => void;
}

export const BOMConfigModal: React.FC<BOMConfigModalProps> = ({
  isOpen,
  onClose,
  menus,
  ingredients,
  boms,
  onUpdateBOM
}) => {
  const [selectedMenuId, setSelectedMenuId] = useState<string>(menus[0]?.id || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedMenu = menus.find(m => m.id === selectedMenuId) || menus[0];
  const menuBOMs = boms.filter(b => b.menuId === selectedMenuId);

  const handleQtyChange = (bomId: string, val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      onUpdateBOM(bomId, num);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-400/20 border border-gold-400/40 flex items-center justify-center text-gold-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Konfigurasi Bill of Materials (BOM) Resep
              </h3>
              <p className="text-xs text-slate-400">
                Sesuaikan gramasi bahan baku per 1 porsi menu untuk kalibrasi Reverse-BOM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          {menus.map(menu => (
            <button
              key={menu.id}
              onClick={() => setSelectedMenuId(menu.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedMenuId === menu.id
                  ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {menu.name}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Utensils className="w-4 h-4 text-gold-600" />
                Resep Komposisi: {selectedMenu?.name}
              </h4>
              <p className="text-xs text-slate-500">
                Harga Jual: Rp {selectedMenu?.price.toLocaleString('id-ID')} | Baseline Demand: {selectedMenu?.baseDailyDemand} porsi/hari
              </p>
            </div>

            {savedSuccess && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                Gramasi Tersimpan
              </span>
            )}
          </div>

          <div className="space-y-3">
            {menuBOMs.map(bom => {
              const ing = ingredients.find(i => i.id === bom.ingredientId);
              if (!ing) return null;

              return (
                <div 
                  key={bom.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-gold-400/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold-400/10 flex items-center justify-center text-gold-600 font-bold text-xs">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{ing.name}</p>
                      <p className="text-[11px] text-slate-500">{bom.notes || 'Komposisi standar'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.005"
                      min="0.001"
                      defaultValue={bom.quantityPerPortion}
                      onChange={(e) => handleQtyChange(bom.id, e.target.value)}
                      className="w-24 text-center font-bold text-sm py-1.5 px-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 text-slate-900"
                    />
                    <span className="text-xs font-bold text-slate-600 uppercase w-10">
                      {ing.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Perubahan gramasi porsi resep di atas secara instan memperbarui kalkulasi kebutuhan belanja (*Gross Need*) dan status peringatan *STOP RESTOCK* pada seluruh menu terkait.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Selesai Meninjau
          </button>
        </div>

      </div>
    </div>
  );
};
