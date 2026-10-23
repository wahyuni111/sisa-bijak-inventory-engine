/**
 * Domain Entity: Ingredient (Bahan Baku)
 * Strict OOP Representation with invariant validation and helper methods
 */
export type IngredientUnit = 'kg' | 'gram' | 'liter' | 'ml' | 'butir' | 'pcs';

export interface IIngredientProps {
  id: string;
  storeId: string;
  name: string;
  unit: IngredientUnit;
  costPerUnit: number;
  safetyStock: number;
  currentStock: number;
  category?: 'perishable' | 'dry' | 'condiment' | 'protein' | 'dairy';
  shelfLifeDays?: number;
}

export class Ingredient {
  readonly id: string;
  readonly storeId: string;
  public name: string;
  public unit: IngredientUnit;
  public costPerUnit: number;
  public safetyStock: number;
  public currentStock: number;
  public category: 'perishable' | 'dry' | 'condiment' | 'protein' | 'dairy';
  public shelfLifeDays: number;

  constructor(props: IIngredientProps) {
    if (props.costPerUnit < 0) throw new Error('Cost per unit cannot be negative');
    if (props.safetyStock < 0) throw new Error('Safety stock cannot be negative');

    this.id = props.id;
    this.storeId = props.storeId;
    this.name = props.name;
    this.unit = props.unit;
    this.costPerUnit = props.costPerUnit;
    this.safetyStock = props.safetyStock;
    this.currentStock = Math.max(0, props.currentStock);
    this.category = props.category || 'perishable';
    this.shelfLifeDays = props.shelfLifeDays || 3;
  }

  /**
   * Update stock based on physical opname
   */
  public updateCurrentStock(newStock: number): void {
    if (newStock < 0) throw new Error('Physical stock cannot be negative');
    this.currentStock = Number(newStock.toFixed(2));
  }

  /**
   * Check if current stock has breached safety stock
   */
  public isBelowSafetyStock(): boolean {
    return this.currentStock < this.safetyStock;
  }

  /**
   * Calculate current stock financial asset value
   */
  public calculateAssetValue(): number {
    return this.currentStock * this.costPerUnit;
  }
}
