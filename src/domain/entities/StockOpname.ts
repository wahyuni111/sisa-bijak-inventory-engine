/**
 * Domain Entity: StockOpname (Pencatatan Fisik Dapur Harian)
 * Recorded during closing shift by kitchen staff (<3 mins)
 */
export interface IStockOpnameProps {
  id: string;
  storeId: string;
  opnameDate: string; // YYYY-MM-DD
  ingredientId: string;
  remainingStock: number;
  recordedBy: string;
  recordedAt: string;
  note?: string;
}

export class StockOpname {
  readonly id: string;
  readonly storeId: string;
  readonly opnameDate: string;
  readonly ingredientId: string;
  public remainingStock: number;
  readonly recordedBy: string;
  readonly recordedAt: string;
  public note: string;

  constructor(props: IStockOpnameProps) {
    if (props.remainingStock < 0) {
      throw new Error('Stock opname quantity cannot be negative');
    }
    this.id = props.id;
    this.storeId = props.storeId;
    this.opnameDate = props.opnameDate;
    this.ingredientId = props.ingredientId;
    this.remainingStock = Number(props.remainingStock.toFixed(2));
    this.recordedBy = props.recordedBy;
    this.recordedAt = props.recordedAt;
    this.note = props.note || '';
  }
}
