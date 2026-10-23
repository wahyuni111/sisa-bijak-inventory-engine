import React from 'react';
import { CloudRain, Sun, Calendar, Sparkles, Sliders } from 'lucide-react';
import { IForecastConditions } from '../../services/ForecastingService';

interface SimulationControlsProps {
  conditions: IForecastConditions;
  onChangeConditions: (newConditions: IForecastConditions) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  conditions,
  onChangeConditions
}) => {
  const days = [
    { val: 0, label: 'Minggu' },
    { val: 1, label: 'Senin' },
    { val: 2, label: 'Selasa' },
    { val: 3, label: 'Rabu' },
    { val: 4, label: 'Kamis' },
    { val: 5, label: 'Jumat' },
    { val: 6, label: 'Sabtu' },
  ];

  const handleDayChange = (val: number) => {
    const isWk = val === 0 || val === 6;
    onChangeConditions({
      ...conditions,
      dayOfWeek: val,
      isWeekend: isWk
    });
  };

  const handleRainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeConditions({
      ...conditions,
      rainfallMm: Number(e.target.value)
    });
  };

  const handleHolidayToggle = () => {
    onChangeConditions({
      ...conditions,
      isHoliday: !conditions.isHoliday
    });
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-5 border border-gold-400/30 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-400/20 border border-gold-400/40 flex items-center justify-center text-gold-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white">
                Simulasi Kondisi Eksternal (What-If Analysis)
              </h4>
              <span className="text-[10px] font-bold bg-gold-400/20 text-gold-300 border border-gold-400/30 px-1.5 py-0.2 rounded uppercase">
                Live Re-calculate
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Ubah parameter cuaca & kalender untuk melihat reaksi instan model XGBoost & Reverse-BOM
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          
          {/* Day of Week Selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            {days.map(d => (
              <button
                key={d.val}
                onClick={() => handleDayChange(d.val)}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
                  conditions.dayOfWeek === d.val
                    ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d.label.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Weather Slider */}
          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
            {conditions.rainfallMm > 20 ? (
              <CloudRain className="w-4 h-4 text-blue-400 shrink-0" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Curah Hujan: {conditions.rainfallMm} mm
              </span>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={conditions.rainfallMm}
                onChange={handleRainChange}
                className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-gold-400"
              />
            </div>
          </div>

          {/* Holiday Toggle Button */}
          <button
            onClick={handleHolidayToggle}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              conditions.isHoliday
                ? 'bg-gold-400/20 text-gold-300 border-gold-400 shadow-gold-glow'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span>{conditions.isHoliday ? 'Hari Libur / Wisuda: Aktif' : 'Hari Normal'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
