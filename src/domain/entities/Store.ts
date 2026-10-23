/**
 * Domain Entity: Store (Outlet / Cabang Usaha)
 */
export interface IStoreProps {
  id: string;
  name: string;
  location: string;
  ownerId: string;
  createdAt: string;
  phone?: string;
}

export class Store {
  readonly id: string;
  public name: string;
  public location: string;
  readonly ownerId: string;
  readonly createdAt: string;
  public phone: string;

  constructor(props: IStoreProps) {
    this.id = props.id;
    this.name = props.name;
    this.location = props.location;
    this.ownerId = props.ownerId;
    this.createdAt = props.createdAt;
    this.phone = props.phone || '';
  }
}
