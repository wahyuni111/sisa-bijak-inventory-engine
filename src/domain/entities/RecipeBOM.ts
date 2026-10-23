/**
 * Domain Entity: RecipeBOM (Bill of Materials per Portion)
 * Maps each Menu portion to precise ingredient consumption
 */
export interface IRecipeBOMProps {
  id: string;
  menuId: string;
  ingredientId: string;
  quantityPerPortion: number; // In the ingredient's standard base unit (e.g., kg, liter, pcs)
  notes?: string;
}

export class RecipeBOM {
  readonly id: string;
  readonly menuId: string;
  readonly ingredientId: string;
  public quantityPerPortion: number;
  public notes: string;

  constructor(props: IRecipeBOMProps) {
    if (props.quantityPerPortion <= 0) {
      throw new Error('Quantity per portion must be greater than zero');
    }
    this.id = props.id;
    this.menuId = props.menuId;
    this.ingredientId = props.ingredientId;
    this.quantityPerPortion = props.quantityPerPortion;
    this.notes = props.notes || '';
  }

  /**
   * Calculate total ingredient requirement for a given number of menu portions
   */
  public calculateNeedForPortions(portions: number): number {
    if (portions < 0) return 0;
    return Number((portions * this.quantityPerPortion).toFixed(3));
  }

  public updateQuantity(newQty: number): void {
    if (newQty <= 0) throw new Error('Quantity must be greater than zero');
    this.quantityPerPortion = Number(newQty.toFixed(4));
  }
}
