/**
 * Domain Entity: User (Pengguna Sistem SISA-BIJAK)
 */
export type UserRole = 'OWNER' | 'STAFF';

export interface IUserProps {
  id: string;
  storeId: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

export class User {
  readonly id: string;
  public storeId: string;
  public email: string;
  public fullName: string;
  public role: UserRole;
  public avatarUrl: string;

  constructor(props: IUserProps) {
    this.id = props.id;
    this.storeId = props.storeId;
    this.email = props.email;
    this.fullName = props.fullName;
    this.role = props.role;
    this.avatarUrl = props.avatarUrl || '';
  }

  public isOwner(): boolean {
    return this.role === 'OWNER';
  }

  public isStaff(): boolean {
    return this.role === 'STAFF';
  }
}
