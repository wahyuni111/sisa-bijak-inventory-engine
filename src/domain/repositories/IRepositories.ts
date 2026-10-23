import { Store } from '../entities/Store';
import { User } from '../entities/User';
import { Ingredient } from '../entities/Ingredient';
import { Menu } from '../entities/Menu';
import { RecipeBOM } from '../entities/RecipeBOM';
import { StockOpname } from '../entities/StockOpname';
import { ProcurementPlan } from '../entities/ProcurementPlan';

/**
 * Interface-based Repository Pattern
 * Decouples domain logic from persistence mechanisms (Supabase vs In-Memory Mock)
 */
export interface IStoreRepository {
  getAll(): Promise<Store[]>;
  getById(id: string): Promise<Store | null>;
}

export interface IUserRepository {
  getAll(): Promise<User[]>;
  getByEmail(email: string): Promise<User | null>;
  getById(id: string): Promise<User | null>;
}

export interface IIngredientRepository {
  getByStoreId(storeId: string): Promise<Ingredient[]>;
  getById(id: string): Promise<Ingredient | null>;
  updateStock(id: string, newStock: number): Promise<void>;
  update(ingredient: Ingredient): Promise<void>;
}

export interface IMenuRepository {
  getByStoreId(storeId: string): Promise<Menu[]>;
  getById(id: string): Promise<Menu | null>;
}

export interface IRecipeBOMRepository {
  getByMenuId(menuId: string): Promise<RecipeBOM[]>;
  getByStoreId(storeId: string): Promise<RecipeBOM[]>;
  updateQuantity(id: string, newQuantity: number): Promise<void>;
}

export interface IStockOpnameRepository {
  getByDateAndStore(storeId: string, date: string): Promise<StockOpname[]>;
  recordOpnames(opnames: StockOpname[]): Promise<void>;
}

export interface IProcurementRepository {
  savePlan(plans: ProcurementPlan[]): Promise<void>;
  getLatestPlan(storeId: string, date: string): Promise<ProcurementPlan[]>;
}

export interface IUnitOfWork {
  stores: IStoreRepository;
  users: IUserRepository;
  ingredients: IIngredientRepository;
  menus: IMenuRepository;
  recipeBOMs: IRecipeBOMRepository;
  stockOpnames: IStockOpnameRepository;
  procurement: IProcurementRepository;
}
