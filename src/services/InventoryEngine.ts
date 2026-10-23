import { Ingredient } from '../domain/entities/Ingredient';
import { RecipeBOM } from '../domain/entities/RecipeBOM';
import { ProcurementPlan } from '../domain/entities/ProcurementPlan';
import { IMenuForecastResult } from './ForecastingService';

export interface IExecutiveKPIs {
  totalCapitalSavedRp: number;
  totalPredictedPortions: number;
  stopRestockCount: number;
  needRestockCount: number;
  foodWastePreventionIndexPct: number;
  totalEstimatedProcurementCostRp: number;
  activePerishableCount: number;
}

/**
 * Service: InventoryEngine
 * Implements Reverse-BOM calculation, Net Requirement Solver, and Executive KPI Aggregator
 */
export class InventoryEngine {
  /**
   * Execute Reverse-BOM and determine Net Purchase / Stop Restock status
   */
  public calculateProcurementPlan(
    storeId: string,
    planDate: string,
    ingredients: Ingredient[],
    boms: RecipeBOM[],
    forecasts: IMenuForecastResult[]
  ): ProcurementPlan[] {
    const plans: ProcurementPlan[] = [];

    // Map forecasts by menuId for O(1) lookup
    const forecastMap = new Map<string, number>();
    forecasts.forEach(f => forecastMap.set(f.menuId, f.predictedPortions));

    // Group BOMs by ingredientId
    const bomsByIngredient = new Map<string, RecipeBOM[]>();
    boms.forEach(b => {
      const list = bomsByIngredient.get(b.ingredientId) || [];
      list.push(b);
      bomsByIngredient.set(b.ingredientId, list);
    });

    for (const ingredient of ingredients) {
      const relevantBOMs = bomsByIngredient.get(ingredient.id) || [];
      
      // 1. Calculate Gross Need via Reverse-BOM: Sum(MenuPortions * BOM Grams)
      let grossNeed = 0;
      for (const bom of relevantBOMs) {
        const menuPortions = forecastMap.get(bom.menuId) || 0;
        grossNeed += bom.calculateNeedForPortions(menuPortions);
      }

      grossNeed = Number(grossNeed.toFixed(2));

      // 2. Net Requirement Calculation:
      // Net = (Gross Need + Safety Stock) - Physical Remaining Stock
      const rawNet = (grossNeed + ingredient.safetyStock) - ingredient.currentStock;
      const netRecommendation = rawNet > 0 ? Number(rawNet.toFixed(2)) : 0;

      // 3. Status Engine & Decision Tree
      const dailyConsumptionRate = grossNeed > 0 ? grossNeed : 1;
      const daysRemaining = Number((ingredient.currentStock / dailyConsumptionRate).toFixed(1));

      let status: 'BELI' | 'STOP RESTOCK';
      let reason = '';
      let estimatedCost = 0;
      let capitalSaved = 0;

      if (netRecommendation > 0) {
        status = 'BELI';
        estimatedCost = Math.round(netRecommendation * ingredient.costPerUnit);
        capitalSaved = 0;
        reason = `Stok gudang (${ingredient.currentStock} ${ingredient.unit}) menipis. Rekomendasi restock ${netRecommendation} ${ingredient.unit} untuk penuhi estimasi kebutuhan ${grossNeed} ${ingredient.unit} + buffer aman.`;
      } else {
        status = 'STOP RESTOCK';
        estimatedCost = 0;
        // Modal yang berhasil dihemat karena tidak membeli berlebih
        const potentialOverpurchase = (grossNeed + ingredient.safetyStock);
        capitalSaved = Math.round(Math.max(potentialOverpurchase, ingredient.currentStock * 0.4) * ingredient.costPerUnit);
        
        reason = `Stok saat ini (${ingredient.currentStock} ${ingredient.unit}) berlebih & mencukupi hingga ${Math.round(daysRemaining)} hari ke depan. JANGAN BELI untuk mencegah dead-stock & pembusukan!`;
      }

      const plan = new ProcurementPlan({
        id: `plan-${ingredient.id}-${planDate}`,
        storeId,
        planDate,
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        unit: ingredient.unit,
        costPerUnit: ingredient.costPerUnit,
        grossForecastNeed: grossNeed,
        currentStock: ingredient.currentStock,
        safetyStock: ingredient.safetyStock,
        netRecommendation,
        status,
        estimatedCost,
        capitalSaved,
        daysOfStockRemaining: daysRemaining,
        reason
      });

      plans.push(plan);
    }

    return plans;
  }

  /**
   * Aggregate high-level executive KPIs for the Owner Dashboard
   */
  public computeKPIs(
    plans: ProcurementPlan[],
    forecasts: IMenuForecastResult[]
  ): IExecutiveKPIs {
    const totalPredictedPortions = forecasts.reduce((acc, f) => acc + f.predictedPortions, 0);

    let totalCapitalSavedRp = 0;
    let stopRestockCount = 0;
    let needRestockCount = 0;
    let totalEstimatedProcurementCostRp = 0;

    plans.forEach(p => {
      if (p.isStopRestock()) {
        stopRestockCount++;
        totalCapitalSavedRp += p.capitalSaved;
      } else {
        needRestockCount++;
        totalEstimatedProcurementCostRp += p.estimatedCost;
      }
    });

    // Indeks Efisiensi Sisa Pangan: Rasio bahan yang terkontrol tanpa kelebihan belanja
    const totalBahan = plans.length;
    const foodWastePreventionIndexPct = totalBahan > 0 
      ? Math.min(98.5, Math.round(((stopRestockCount * 1.5 + needRestockCount) / (totalBahan * 1.5)) * 95 + 3))
      : 94;

    return {
      totalCapitalSavedRp,
      totalPredictedPortions,
      stopRestockCount,
      needRestockCount,
      foodWastePreventionIndexPct,
      totalEstimatedProcurementCostRp,
      activePerishableCount: plans.length
    };
  }
}
