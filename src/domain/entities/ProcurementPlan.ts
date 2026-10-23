/**
 * Domain Entity: ProcurementPlan / ProcurementRecommendation
 * Result of Reverse-BOM calculation & predictive inventory analysis
 */
export type ProcurementStatus = 'BELI' | 'STOP RESTOCK';

export interface IProcurementPlanProps {
  id: string;
  storeId: string;
  planDate: string; // YYYY-MM-DD
  ingredientId: string;
  ingredientName: string;
  unit: string;
  costPerUnit: number;
  grossForecastNeed: number;
  currentStock: number;
  safetyStock: number;
  netRecommendation: number;
  status: ProcurementStatus;
  estimatedCost: number;
  capitalSaved: number;
  daysOfStockRemaining: number;
  reason: string;
}

export class ProcurementPlan {
  readonly id: string;
  readonly storeId: string;
  readonly planDate: string;
  readonly ingredientId: string;
  readonly ingredientName: string;
  readonly unit: string;
  readonly costPerUnit: number;
  public grossForecastNeed: number;
  public currentStock: number;
  public safetyStock: number;
  public netRecommendation: number;
  public status: ProcurementStatus;
  public estimatedCost: number;
  public capitalSaved: number;
  public daysOfStockRemaining: number;
  public reason: string;

  constructor(props: IProcurementPlanProps) {
    this.id = props.id;
    this.storeId = props.storeId;
    this.planDate = props.planDate;
    this.ingredientId = props.ingredientId;
    this.ingredientName = props.ingredientName;
    this.unit = props.unit;
    this.costPerUnit = props.costPerUnit;
    this.grossForecastNeed = Number(props.grossForecastNeed.toFixed(2));
    this.currentStock = Number(props.currentStock.toFixed(2));
    this.safetyStock = Number(props.safetyStock.toFixed(2));
    this.netRecommendation = Number(props.netRecommendation.toFixed(2));
    this.status = props.status;
    this.estimatedCost = Number(props.estimatedCost.toFixed(0));
    this.capitalSaved = Number(props.capitalSaved.toFixed(0));
    this.daysOfStockRemaining = Number(props.daysOfStockRemaining.toFixed(1));
    this.reason = props.reason;
  }

  public isStopRestock(): boolean {
    return this.status === 'STOP RESTOCK';
  }

  public isRestockNeeded(): boolean {
    return this.status === 'BELI';
  }
}
