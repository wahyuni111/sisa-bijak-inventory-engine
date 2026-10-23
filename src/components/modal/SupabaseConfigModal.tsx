import React, { useState } from 'react';
import { 
  Database, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Code
} from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  isConnected
}) => {
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const envSnippet = `# SISA-BIJAK Supabase Configuration (.env.local)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`;

  const sqlSample = `-- 7 Tables DDL available in supabase/schema.sql
-- 1. stores
-- 2. users
-- 3. ingredients
-- 4. menus
-- 5. recipe_boms
-- 6. daily_stock_opnames
-- 7. procurement_plans`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  const handleCopySQLFile = () => {
    // Read from schema or copy instruction
    navigator.clipboard.writeText("Silakan jalankan isi file supabase/schema.sql di Supabase SQL Editor");
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-400/20 border border-gold-400/40 flex items-center justify-center text-gold-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Status Database & Integrasi Supabase
              </h3>
              <p className="text-xs text-slate-400">
                Arsitektur Decoupled Repository (Mock In-Memory + Supabase PostgreSQL)
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-600 flex-1">
          
          {/* Status Box */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isConnected 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            {isConnected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-sm">
                {isConnected ? 'Terhubung ke Live Supabase Database' : 'Aktif dalam Mode: Mock In-Memory Database'}
              </p>
              <p className="mt-1 leading-relaxed">
                {isConnected 
                  ? 'Data tersinkronisasi secara real-time dengan Supabase PostgreSQL.' 
                  : 'Aplikasi berjalan 100% mandiri dengan seed data realistis Purwokerto (Ayam Geprek Barokah). Semua simulasi, kalkulasi Reverse-BOM, dan stock opname berjalan lancar tanpa memerlukan API key eksternal.'}
              </p>
            </div>
          </div>

          {/* Guide to connect */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Langkah Menghubungkan ke Supabase Project Anda:
            </h4>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800">1. Salin Konfigurasi Environment Variable:</span>
                  <button
                    onClick={handleCopyEnv}
                    className="flex items-center gap-1 text-[11px] font-semibold text-gold-600 hover:text-gold-700"
                  >
                    {copiedEnv ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEnv ? 'Tersalin' : 'Salin .env'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto">
                  {envSnippet}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800">2. Skrip SQL 7 Tabel Supabase:</span>
                  <button
                    onClick={handleCopySQLFile}
                    className="flex items-center gap-1 text-[11px] font-semibold text-gold-600 hover:text-gold-700"
                  >
                    {copiedSQL ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSQL ? 'Tersalin' : 'Salin Instruksi'}</span>
                  </button>
                </div>
                <p className="text-slate-500 mb-2">
                  File SQL telah dibuat lengkap di <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">supabase/schema.sql</code> mencakup DDL tabel: <code className="text-gold-700 font-semibold">stores, users, ingredients, menus, recipe_boms, daily_stock_opnames, procurement_plans</code> beserta seed data.
                </p>
                <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-300 text-[11px] font-mono overflow-x-auto">
{sqlSample}
                </pre>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Tutup Dialog
          </button>
        </div>

      </div>
    </div>
  );
};
