import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Header 
} from './components/layout/Header';
import { 
  KPICards 
} from './components/dashboard/KPICards';
import { 
  ForecastChart 
} from './components/dashboard/ForecastChart';
import { 
  SimulationControls 
} from './components/dashboard/SimulationControls';
import { 
  ProcurementTable 
} from './components/dashboard/ProcurementTable';
import { 
  FastStockOpname 
} from './components/kitchen/FastStockOpname';
import { 
  BOMConfigModal 
} from './components/modal/BOMConfigModal';
import { 
  SupabaseConfigModal 
} from './components/modal/SupabaseConfigModal';

import { UserRole } from './domain/entities/User';
import { Ingredient } from './domain/entities/Ingredient';
import { Menu } from './domain/entities/Menu';
import { RecipeBOM } from './domain/entities/RecipeBOM';
import { Store } from './domain/entities/Store';
import { ProcurementPlan } from './domain/entities/ProcurementPlan';

import { AuthService } from './services/AuthService';
import { ForecastingService, IForecastConditions } from './services/ForecastingService';
import { InventoryEngine } from './services/InventoryEngine';
import { MockUnitOfWork } from './data/MockRepository';
import { SupabaseService } from './data/SupabaseRepository';

import { 
  ShieldCheck, 
  UtensilsCrossed, 
  Sparkles, 
  Store as StoreIcon,
  RefreshCw,
  Info
} from 'lucide-react';

export const App: React.FC = () => {
  // 1. Core Services & Unit of Work (OOP Service Architecture)
  const authService = useMemo(() => new AuthService('OWNER'), []);
  const forecastingService = useMemo(() => new ForecastingService(), []);
  const inventoryEngine = useMemo(() => new InventoryEngine(), []);
  const [unitOfWork] = useState(() => new MockUnitOfWork());

  // 2. Application State
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [stores, setStores] = useState<Store[]>([]);
  const [activeStoreId, setActiveStoreId] = useState<string>('store-barokah-pwt');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [boms, setBoms] = useState<RecipeBOM[]>([]);
  const [plans, setPlans] = useState<ProcurementPlan[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'BELI' | 'STOP_RESTOCK'>('ALL');

  // Modals state
  const [isBOMModalOpen, setIsBOMModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Environmental simulation conditions (Feature Engineering parameters)
  const [conditions, setConditions] = useState<IForecastConditions>(() => {
    const today = new Date();
    const dow = today.getDay();
    return {
      date: today.toISOString().split('T')[0],
      dayOfWeek: dow,
      isWeekend: dow === 0 || dow === 6,
      isHoliday: false,
      rainfallMm: 15 // Hujan gerimis sore lereng Gunung Slamet Purwokerto
    };
  });

  // Load initial data from Repository
  const loadInitialData = useCallback(async () => {
    const storeList = await unitOfWork.stores.getAll();
    const ingList = await unitOfWork.ingredients.getByStoreId(activeStoreId);
    const menuList = await unitOfWork.menus.getByStoreId(activeStoreId);
    const bomList = await unitOfWork.recipeBOMs.getByStoreId(activeStoreId);

    setStores(storeList);
    setIngredients(ingList);
    setMenus(menuList);
    setBoms(bomList);

    const supaStatus = SupabaseService.initialize();
    setIsSupabaseConnected(supaStatus.isConnected);
  }, [unitOfWork, activeStoreId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Recalculate Reverse-BOM & Procurement Plan whenever conditions, ingredients, or BOMs change
  const recalculateAll = useCallback(() => {
    if (menus.length === 0 || ingredients.length === 0 || boms.length === 0) return;

    // 1. Run XGBoost Predictive Model on each menu
    const forecastResults = menus.map(menu => 
      forecastingService.predictMenuDemand(menu, conditions)
    );

    // 2. Run Reverse-BOM & Net Procurement calculation
    const calculatedPlans = inventoryEngine.calculateProcurementPlan(
      activeStoreId,
      conditions.date,
      ingredients,
      boms,
      forecastResults
    );

    setPlans(calculatedPlans);
  }, [menus, ingredients, boms, conditions, activeStoreId, forecastingService, inventoryEngine]);

  useEffect(() => {
    recalculateAll();
  }, [recalculateAll]);

  // Handle Role Switch
  const handleSwitchRole = (role: UserRole) => {
    const updatedUser = authService.switchRole(role, activeStoreId);
    setCurrentUser(updatedUser);
  };

  // Handle Kitchen Staff Opname Submission
  const handleSaveOpname = async (updatedStocks: Record<string, number>) => {
    for (const [id, stock] of Object.entries(updatedStocks)) {
      await unitOfWork.ingredients.updateStock(id, stock);
    }
    // Refresh ingredients from repo
    const refreshed = await unitOfWork.ingredients.getByStoreId(activeStoreId);
    setIngredients([...refreshed]);
  };

  // Handle Recipe BOM Grammage Update
  const handleUpdateBOM = async (bomId: string, newQty: number) => {
    await unitOfWork.recipeBOMs.updateQuantity(bomId, newQty);
    const refreshedBOMs = await unitOfWork.recipeBOMs.getByStoreId(activeStoreId);
    setBoms([...refreshedBOMs]);
  };

  // Reset data to defaults
  const handleResetData = async () => {
    unitOfWork.resetToDefault();
    await loadInitialData();
  };

  // Calculate Executive KPIs
  const kpis = useMemo(() => {
    const forecastResults = menus.map(menu => 
      forecastingService.predictMenuDemand(menu, conditions)
    );
    return inventoryEngine.computeKPIs(plans, forecastResults);
  }, [plans, menus, conditions, forecastingService, inventoryEngine]);

  // Generate 7-day trend for primary menu
  const trendData = useMemo(() => {
    const primaryMenu = menus[0];
    if (!primaryMenu) return [];
    return forecastingService.generate7DayTrend(primaryMenu);
  }, [menus, forecastingService]);

  const activeStore = stores.find(s => s.id === activeStoreId) || stores[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-gold-200">
      
      {/* 1. TOP STICKY NAVIGATION BAR */}
      <Header
        currentUser={currentUser}
        stores={stores}
        activeStoreId={activeStoreId}
        onSelectStore={(id) => setActiveStoreId(id)}
        onSwitchRole={handleSwitchRole}
        onOpenBOMModal={() => setIsBOMModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onResetData={handleResetData}
        isSupabaseConnected={isSupabaseConnected}
      />

      {/* 2. SUB-BAR: QUICK PERSONA TOGGLE BANNER */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Konteks Sesi: <strong>{activeStore?.name}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Tampilan Saat Ini:</span>
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                onClick={() => handleSwitchRole('OWNER')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  currentUser.isOwner()
                    ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Owner Dashboard</span>
              </button>

              <button
                onClick={() => handleSwitchRole('STAFF')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  currentUser.isStaff()
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Closing Kitchen Staff (&lt;3 Min)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* VIEW 1: OWNER / MANAGER EXECUTIVE DASHBOARD */}
        {currentUser.isOwner() && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            
            {/* Dashboard Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Executive Dashboard Pengadaan & Food Waste Audit
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Rekomendasi belanja presisi harian berbasis kalkulasi Reverse-BOM & Machine Learning.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={recalculateAll}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-gold-400 text-slate-700 text-xs font-bold shadow-sm transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
                  <span>Hitung Ulang AI</span>
                </button>
              </div>
            </div>

            {/* TOP 4 KPI CARDS */}
            <KPICards
              kpis={kpis}
              onFilterStopRestock={() => setActiveFilter('STOP_RESTOCK')}
              onFilterNeedRestock={() => setActiveFilter('BELI')}
            />

            {/* SIMULATION WHAT-IF CONTROLS */}
            <SimulationControls
              conditions={conditions}
              onChangeConditions={setConditions}
            />

            {/* PREDICTIVE FORECAST CHART (RECHARTS) */}
            <ForecastChart
              trendData={trendData}
              conditions={conditions}
            />

            {/* SMART PROCUREMENT TABLE */}
            <ProcurementTable
              plans={plans}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              storeName={activeStore?.name || 'Ayam Geprek Barokah Purwokerto'}
            />

          </div>
        )}

        {/* VIEW 2: KITCHEN STAFF FAST STOCK OPNAME (< 3 MINUTES) */}
        {currentUser.isStaff() && (
          <div className="animate-in fade-in duration-300">
            <FastStockOpname
              ingredients={ingredients}
              onSaveOpname={handleSaveOpname}
              staffName={currentUser.fullName}
            />
          </div>
        )}

      </main>

      {/* 4. FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SISA-BIJAK</span>
            <span>—</span>
            <span>Platform Audit Sisa Pangan & Pengadaan Cerdas UMKM Kuliner</span>
          </div>
          <div className="text-slate-400">
            Purwokerto Branch Case Study • Clean Architecture & XGBoost Regressor
          </div>
        </div>
      </footer>

      {/* 5. MODALS */}
      <BOMConfigModal
        isOpen={isBOMModalOpen}
        onClose={() => setIsBOMModalOpen(false)}
        menus={menus}
        ingredients={ingredients}
        boms={boms}
        onUpdateBOM={handleUpdateBOM}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        isConnected={isSupabaseConnected}
      />

    </div>
  );
};
