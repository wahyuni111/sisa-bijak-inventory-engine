import { Store } from '../domain/entities/Store';
import { User } from '../domain/entities/User';
import { Ingredient } from '../domain/entities/Ingredient';
import { Menu } from '../domain/entities/Menu';
import { RecipeBOM } from '../domain/entities/RecipeBOM';
import { StockOpname } from '../domain/entities/StockOpname';
import { ProcurementPlan } from '../domain/entities/ProcurementPlan';
import {
  IStoreRepository,
  IUserRepository,
  IIngredientRepository,
  IMenuRepository,
  IRecipeBOMRepository,
  IStockOpnameRepository,
  IProcurementRepository,
  IUnitOfWork
} from '../domain/repositories/IRepositories';
import {
  INITIAL_STORES,
  INITIAL_USERS,
  INITIAL_INGREDIENTS,
  INITIAL_MENUS,
  INITIAL_BOMS
} from './seedData';

export class MockStoreRepository implements IStoreRepository {
  private stores: Store[] = [...INITIAL_STORES];

  async getAll(): Promise<Store[]> {
    return [...this.stores];
  }

  async getById(id: string): Promise<Store | null> {
    return this.stores.find(s => s.id === id) || null;
  }
}

export class MockUserRepository implements IUserRepository {
  private users: User[] = [...INITIAL_USERS];

  async getAll(): Promise<User[]> {
    return [...this.users];
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async getById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
}

export class MockIngredientRepository implements IIngredientRepository {
  private ingredients: Ingredient[] = [...INITIAL_INGREDIENTS];

  async getByStoreId(storeId: string): Promise<Ingredient[]> {
    return this.ingredients.filter(i => i.storeId === storeId);
  }

  async getById(id: string): Promise<Ingredient | null> {
    return this.ingredients.find(i => i.id === id) || null;
  }

  async updateStock(id: string, newStock: number): Promise<void> {
    const item = this.ingredients.find(i => i.id === id);
    if (item) {
      item.updateCurrentStock(newStock);
    }
  }

  async update(ingredient: Ingredient): Promise<void> {
    const idx = this.ingredients.findIndex(i => i.id === ingredient.id);
    if (idx !== -1) {
      this.ingredients[idx] = ingredient;
    }
  }
}

export class MockMenuRepository implements IMenuRepository {
  private menus: Menu[] = [...INITIAL_MENUS];

  async getByStoreId(storeId: string): Promise<Menu[]> {
    return this.menus.filter(m => m.storeId === storeId);
  }

  async getById(id: string): Promise<Menu | null> {
    return this.menus.find(m => m.id === id) || null;
  }
}

export class MockRecipeBOMRepository implements IRecipeBOMRepository {
  private boms: RecipeBOM[] = [...INITIAL_BOMS];

  async getByMenuId(menuId: string): Promise<RecipeBOM[]> {
    return this.boms.filter(b => b.menuId === menuId);
  }

  async getByStoreId(storeId: string): Promise<RecipeBOM[]> {
    // Return all BOMs that belong to menus of this store
    return [...this.boms];
  }

  async updateQuantity(id: string, newQuantity: number): Promise<void> {
    const bom = this.boms.find(b => b.id === id);
    if (bom) {
      bom.updateQuantity(newQuantity);
    }
  }
}

export class MockStockOpnameRepository implements IStockOpnameRepository {
  private opnames: StockOpname[] = [];

  async getByDateAndStore(storeId: string, date: string): Promise<StockOpname[]> {
    return this.opnames.filter(o => o.storeId === storeId && o.opnameDate === date);
  }

  async recordOpnames(newOpnames: StockOpname[]): Promise<void> {
    this.opnames.push(...newOpnames);
  }
}

export class MockProcurementRepository implements IProcurementRepository {
  private plans: ProcurementPlan[] = [];

  async savePlan(plans: ProcurementPlan[]): Promise<void> {
    this.plans = [...plans];
  }

  async getLatestPlan(storeId: string, date: string): Promise<ProcurementPlan[]> {
    return this.plans.filter(p => p.storeId === storeId && p.planDate === date);
  }
}

export class MockUnitOfWork implements IUnitOfWork {
  public stores = new MockStoreRepository();
  public users = new MockUserRepository();
  public ingredients = new MockIngredientRepository();
  public menus = new MockMenuRepository();
  public recipeBOMs = new MockRecipeBOMRepository();
  public stockOpnames = new MockStockOpnameRepository();
  public procurement = new MockProcurementRepository();

  public resetToDefault(): void {
    this.stores = new MockStoreRepository();
    this.users = new MockUserRepository();
    this.ingredients = new MockIngredientRepository();
    this.menus = new MockMenuRepository();
    this.recipeBOMs = new MockRecipeBOMRepository();
    this.stockOpnames = new MockStockOpnameRepository();
    this.procurement = new MockProcurementRepository();
  }
}
