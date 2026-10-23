/**
 * Domain Entity: Menu (Produk Siap Saji / Menu Restoran)
 */
export interface IMenuProps {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
  baseDailyDemand?: number;
}

export class Menu {
  readonly id: string;
  readonly storeId: string;
  public name: string;
  public category: string;
  public price: number;
  public isActive: boolean;
  public baseDailyDemand: number;

  constructor(props: IMenuProps) {
    if (props.price < 0) throw new Error('Menu price cannot be negative');

    this.id = props.id;
    this.storeId = props.storeId;
    this.name = props.name;
    this.category = props.category;
    this.price = props.price;
    this.isActive = props.isActive;
    this.baseDailyDemand = props.baseDailyDemand ?? 50; // default baseline portions/day
  }

  public toggleActive(): void {
    this.isActive = !this.isActive;
  }
}
