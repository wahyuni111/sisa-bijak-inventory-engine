import { User, UserRole } from '../domain/entities/User';

export interface IDemoPreset {
  email: string;
  fullName: string;
  role: UserRole;
  badgeTitle: string;
  description: string;
}

export class AuthService {
  public static readonly PRESETS: Record<UserRole, IDemoPreset> = {
    OWNER: {
      email: 'owner@sisabijak.com',
      fullName: 'H. Barokah (Owner)',
      role: 'OWNER',
      badgeTitle: 'Owner / Manager',
      description: 'Akses penuh: Analitik finansial, forecast AI, konfigurasi resep BOM, & approval belanja'
    },
    STAFF: {
      email: 'staff@sisabijak.com',
      fullName: 'Budi Santoso (Staff Dapur)',
      role: 'STAFF',
      badgeTitle: 'Kitchen Staff',
      description: 'Akses cepat: Formulir Stock Opname fisik closing shift (< 3 menit)'
    }
  };

  private currentUser: User;

  constructor(initialRole: UserRole = 'OWNER', storeId: string = 'store-barokah-pwt') {
    const preset = AuthService.PRESETS[initialRole];
    this.currentUser = new User({
      id: `user-${initialRole.toLowerCase()}`,
      storeId,
      email: preset.email,
      fullName: preset.fullName,
      role: preset.role,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${initialRole}`
    });
  }

  public getCurrentUser(): User {
    return this.currentUser;
  }

  public switchRole(role: UserRole, storeId: string = 'store-barokah-pwt'): User {
    const preset = AuthService.PRESETS[role];
    this.currentUser = new User({
      id: `user-${role.toLowerCase()}`,
      storeId,
      email: preset.email,
      fullName: preset.fullName,
      role: preset.role,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${role}`
    });
    return this.currentUser;
  }

  public isOwner(): boolean {
    return this.currentUser.isOwner();
  }

  public isStaff(): boolean {
    return this.currentUser.isStaff();
  }
}
