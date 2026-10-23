import React, { useState } from 'react';
import { 
  ShoppingBag, 
  AlertOctagon, 
  CheckCircle2, 
  Share2, 
  Printer, 
  Filter, 
  HelpCircle,
  Copy,
  Check,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ProcurementPlan } from '../../domain/entities/ProcurementPlan';

interface ProcurementTableProps {
  plans: ProcurementPlan[];
  activeFilter: 'ALL' | 'BELI' | 'STOP_RESTOCK';
  onFilterChange: (filter: 'ALL' | 'BELI' | 'STOP_RESTOCK') => void;
  storeName: string;
}

export const ProcurementTable: React.FC<ProcurementTableProps> = ({
  plans,
  activeFilter,
  onFilterChange,
  storeName
}) => {
  const [copiedWA, setCopiedWA] = useState(false);
  const [selectedPlanDetail, setSelectedPlanDetail] = useState<ProcurementPlan | null>(null);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredPlans = plans.filter(p => {
    if (activeFilter === 'BELI') return p.status === 'BELI';
    if (activeFilter === 'STOP_RESTOCK') return p.status === 'STOP RESTOCK';
    return true;
  });

  const beliCount = plans.filter(p => p.status === 'BELI').length;
  const stopCount = plans.filter(p => p.status === 'STOP RESTOCK').length;

  // Generate WhatsApp formatted text message
  const handleCopyWhatsApp = () => {
    const today = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const beliItems = plans.filter(p => p.status === 'BELI');
    const stopItems = plans.filter(p => p.status === 'STOP RESTOCK');

    let text = `*DAFTAR PENGADAAN BAHAN BAKU HARIAN (SISA-BIJAK)*\n`;
    text += `*Outlet:* ${storeName}\n`;
    text += `*Tanggal Kebutuhan:* ${today}\n`;
    text += `-------------------------------------------\n\n`;

    if (beliItems.length > 0) {
      text += `*DAFTAR BELANJA RESTOCK (URGENT):*\n`;
      beliItems.forEach((item, idx) => {
        text += `${idx + 1}. *${item.ingredientName}* : ${item.netRecommendation} ${item.unit} (Est: ${formatRupiah(item.estimatedCost)})\n`;
      });
      text += `\n`;
    } else {
      text += `_Semua bahan masih mencukupi, tidak ada belanja baru esok hari._\n\n`;
    }

    if (stopItems.length > 0) {
      text += `*JANGAN BELI (STOK MASIH AMAN/DEAD-STOCK):*\n`;
      stopItems.forEach((item) => {
        text += `- ${item.ingredientName} (Sisa gudang: ${item.currentStock} ${item.unit}, aman ${item.daysOfStockRemaining} hari)\n`;
      });
      text += `\n`;
    }

    text += `_Dihitung otomatis melalui Mesin Reverse-BOM & Prediktif SISA-BIJAK._`;

    navigator.clipboard.writeText(text);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Tabel Rekomendasi Belanja Bersih (Net Procurement Engine)
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
              {plans.length} Bahan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kalkulasi Netto = (Kebutuhan Forecast Gross + Buffer Safety Stock) - Sisa Stok Fisik Gudang
          </p>
        </div>

        {/* Action Buttons: WhatsApp & Print */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Salin rekap belanja ke clipboard WhatsApp format"
          >
            {copiedWA ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWA ? 'Tersalin!' : 'Ekspor WhatsApp'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Cetak lembar belanja"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200/70 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>

        <button
          onClick={() => onFilterChange('ALL')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
            activeFilter === 'ALL'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          Semua Bahan ({plans.length})
        </button>

        <button
          onClick={() => onFilterChange('BELI')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeFilter === 'BELI'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <ShoppingBag className="w-3 h-3" />
          Perlu Dibeli ({beliCount})
        </button>

        <button
          onClick={() => onFilterChange('STOP_RESTOCK')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeFilter === 'STOP_RESTOCK'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-700 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          <AlertOctagon className="w-3 h-3" />
          Stop Restock ({stopCount})
        </button>
      </div>

      {/* The Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Bahan Baku</th>
              <th className="py-3 px-3 text-center">Satuan</th>
              <th className="py-3 px-3 text-right">Stok Fisik Gudang</th>
              <th className="py-3 px-3 text-right">Kebutuhan Gross</th>
              <th className="py-3 px-3 text-right">Safety Buffer</th>
              <th className="py-3 px-3 text-right font-extrabold text-slate-900">Saran Belanja Bersih</th>
              <th className="py-3 px-4 text-center">Status Keputusan</th>
              <th className="py-3 px-3 text-center">Analisis Alasan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPlans.map(plan => {
              const isBeli = plan.status === 'BELI';
              return (
                <tr 
                  key={plan.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    !isBeli ? 'bg-amber-50/20' : ''
                  }`}
                >
                  {/* Bahan Baku */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isBeli ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                      <span>{plan.ingredientName}</span>
                    </div>
                  </td>

                  {/* Satuan */}
                  <td className="py-3.5 px-3 text-center font-medium text-slate-500">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-bold">
                      {plan.unit}
                    </span>
                  </td>

                  {/* Stok Fisik */}
                  <td className="py-3.5 px-3 text-right font-medium text-slate-700">
                    {plan.currentStock} {plan.unit}
                  </td>

                  {/* Gross Forecast */}
                  <td className="py-3.5 px-3 text-right font-medium text-slate-600">
                    {plan.grossForecastNeed} {plan.unit}
                  </td>

                  {/* Safety Buffer */}
                  <td className="py-3.5 px-3 text-right text-slate-500">
                    {plan.safetyStock} {plan.unit}
                  </td>

                  {/* Saran Belanja Bersih */}
                  <td className="py-3.5 px-3 text-right">
                    {isBeli ? (
                      <div>
                        <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          +{plan.netRecommendation} {plan.unit}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Est: {formatRupiah(plan.estimatedCost)}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg line-through">
                          0 {plan.unit}
                        </span>
                        <div className="text-[10px] font-bold text-amber-700 mt-0.5">
                          Hemat: {formatRupiah(plan.capitalSaved)}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {isBeli ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <ShoppingBag className="w-3 h-3" />
                        REKOMENDASI BELI
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-sm shadow-rose-200">
                        <AlertOctagon className="w-3 h-3" />
                        STOP RESTOCK
                      </span>
                    )}
                  </td>

                  {/* Reason Detail Modal Trigger */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => setSelectedPlanDetail(plan)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                      title="Lihat rincian kalkulasi"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Summary Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Beli: Prioritas pengadaan esok</span>
          <span className="mx-2 text-slate-300">|</span>
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Stop Restock: Cegah dead-stock & pembusukan</span>
        </div>
        <div className="font-semibold text-slate-800">
          Total Nilai Belanja Restock Esok: {formatRupiah(plans.filter(p => p.status === 'BELI').reduce((a, b) => a + b.estimatedCost, 0))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPlanDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-gold-600" />
                {selectedPlanDetail.ingredientName}
              </h4>
              <button
                onClick={() => setSelectedPlanDetail(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-700 mb-1">Rasional & Rekomendasi Sistem:</p>
                <p className="text-slate-600 leading-relaxed">{selectedPlanDetail.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Stok Gudang</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedPlanDetail.currentStock} {selectedPlanDetail.unit}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Kebutuhan Gross Esok</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedPlanDetail.grossForecastNeed} {selectedPlanDetail.unit}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Buffer Safety Stock</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedPlanDetail.safetyStock} {selectedPlanDetail.unit}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase">Daya Tahan Stok</span>
                  <span className="font-bold text-gold-600 text-sm">{selectedPlanDetail.daysOfStockRemaining} Hari</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlanDetail(null)}
                className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
