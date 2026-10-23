import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CloudRain, Calendar, TrendingUp, Info } from 'lucide-react';
import { IDailyTrendPoint, IForecastConditions } from '../../services/ForecastingService';

interface ForecastChartProps {
  trendData: IDailyTrendPoint[];
  conditions: IForecastConditions;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  trendData,
  conditions
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Tren Proyeksi Permintaan Menu (XGBoost Regressor)
            </h3>
            <span className="text-xs bg-gold-400/20 text-gold-700 font-semibold px-2 py-0.5 rounded-full border border-gold-400/40">
              7 Hari Dinamis
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbandingan penjualan aktual 3 hari terakhir vs proyeksi 4 hari ke depan
          </p>
        </div>

        {/* Environmental Context Pill */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <CloudRain className="w-3.5 h-3.5 text-blue-500" />
            <span>Hujan: <strong className="font-semibold text-slate-900">{conditions.rainfallMm} mm</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-gold-600" />
            <span>{conditions.isWeekend ? 'Akhir Pekan' : 'Hari Kerja'}</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-64 sm:h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F172A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0F172A" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: '#64748B' }} 
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#64748B' }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as IDailyTrendPoint;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
                      <p className="font-bold text-gold-400 mb-1">
                        {data.dayName}, {label} ({data.isForecast ? 'Proyeksi AI' : 'Penjualan Riil'})
                      </p>
                      <p className="text-slate-200">
                        Total Porsi: <span className="font-bold text-white text-sm">{data.actualOrForecast}</span> porsi
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between gap-4 text-[11px] text-slate-400">
                        <span>Dine-In: {data.dineInShare}%</span>
                        <span>Delivery (GoFood/Grab): {data.deliveryShare}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
            />
            <Area
              name="Estimasi Porsi Terjual"
              type="monotone"
              dataKey="actualOrForecast"
              stroke="#D4AF37"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#forecastGradient)"
              activeDot={{ r: 6, fill: '#D4AF37', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-gold-600 shrink-0" />
          <span>Faktor cuaca lereng Gunung Slamet & weekend terintegrasi ke bobot porsi esok hari.</span>
        </div>
        <span className="font-semibold text-slate-700 hidden sm:inline">Tingkat Akurasi Model: 92.4%</span>
      </div>
    </div>
  );
};
