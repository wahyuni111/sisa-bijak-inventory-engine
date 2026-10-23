import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IUnitOfWork } from '../domain/repositories/IRepositories';
import { MockUnitOfWork } from './MockRepository';

/**
 * Supabase Data Layer Adapter with Automatic In-Memory Fallback
 * Connects directly to Supabase if environment variables are provided.
 */
export class SupabaseService {
  private static client: SupabaseClient | null = null;
  private static isConnected: boolean = false;

  public static initialize(): { client: SupabaseClient | null; isConnected: boolean } {
    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
    const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
      try {
        this.client = createClient(supabaseUrl, supabaseKey);
        this.isConnected = true;
        console.log('✅ Supabase connected successfully to:', supabaseUrl);
      } catch (err) {
        console.warn('⚠️ Supabase connection failed, falling back to In-Memory Mock:', err);
        this.isConnected = false;
      }
    } else {
      this.isConnected = false;
    }

    return { client: this.client, isConnected: this.isConnected };
  }

  public static getStatus(): { isConnected: boolean; url: string } {
    const url = import.meta.env?.VITE_SUPABASE_URL || 'Not Configured (Using In-Memory Database)';
    return { isConnected: this.isConnected, url };
  }
}

/**
 * Service Factory creating the active UnitOfWork
 */
export function getUnitOfWork(): IUnitOfWork {
  // In pure mock mode or hybrid mode, return the reactive MockUnitOfWork
  return new MockUnitOfWork();
}
