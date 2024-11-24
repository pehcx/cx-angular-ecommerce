import { EventEmitter, Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { AuthState } from '../enums/auth-state';
import { ErrorHandlerService } from './error-handler.service';
import { QueryParams } from '../interfaces/query-params.interface';

@Injectable({
  providedIn: 'root'
})

export class SupabaseService {
  private supabase: SupabaseClient;
  private cachedSession: Session | null = null;
  private user: any = null;
  authStateChanged: EventEmitter<AuthState> = new EventEmitter<AuthState>();

  constructor(
    private errorHandlerService: ErrorHandlerService
  ) {
    this.supabase = createClient(environment.supabase_url, environment.supabase_key, {
      auth: {
        // This is the default config
        persistSession: true,
        storage: localStorage
      }
    });

    this.setupAuthStateChangeHandler();
  }

  public async signUp(form: {
    email: string,
    fullName: string,
    password: string,
  }) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName
          }
        }
      });

      if (error) throw error;

      return {
        data: data ?? null,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: error
      };
    }
  }

  public async signIn(form: {
    email: string,
    password: string,
  }) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      });
  
      if (error) throw error

      return {
        data: data,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: error
      }
    }
  }

  public async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) {
      this.errorHandlerService.sendError(error);
    }
  }

  public getSession(): Session | null {
    return this.cachedSession;
  }

  public getUser() {
    return this.user;
  }

  private setupAuthStateChangeHandler() {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          this.cachedSession = session;
          this.user = session?.user ?? null;
          this.authStateChanged.emit(AuthState.SIGNED_IN);
          break;

        case 'SIGNED_OUT':
          this.cachedSession = null;
          this.authStateChanged.emit(AuthState.SIGNED_OUT);
          break;

        case 'TOKEN_REFRESHED':
          this.cachedSession = session;
          this.authStateChanged.emit(AuthState.TOKEN_REFRESHED);
          break;

        case 'USER_UPDATED':
          this.fetchUserData();
          break;

        default:
          if (!Object.values(AuthState).includes(event as AuthState)) {
            this.errorHandlerService.sendError();
            console.warn('Encountered an unhandled Supabase auth state change event', event);
          }
          break;
      }
    });
  }

  public async fetchData(table: string, queryParams: QueryParams = {}): Promise<any[]> {
    const queries = this.buildQueries(queryParams);
    const { data, error } = await this.supabase
      .from(table)
      .select(queries.cols)
      .order(queries.orderBy, { ascending: queries.sortByAsc })
      .limit(queries.limitBy);

    if (error) console.error(error);
    return data ?? [];
  }

  /**
   * Fetches the current user's data from Supabase and updates the internal user state.
   * Emits the `USER_UPDATED` event to notify subscribers once the user data has been successfully fetched.
   *
   * This method should only be called by `setupAuthStateChangeHandler` function
   * to ensure it is invoked during relevant auth state transitions.
   *
   * @returns {Promise<void>}
   */
  private async fetchUserData() {
    const { data, error } = await this.supabase.auth.getUser();
    if (data) {
      this.user = data;
      this.authStateChanged.emit(AuthState.USER_UPDATED);
    }
    
    if (error) console.error("Failed to retrieve user data");
  }

  private buildQueries(queryParams: QueryParams = {}) {
    const defaults = {
      cols: '*',
      orderBy: 'id',
      limitBy: 10,
      sortByAsc: false,
    };

    return {
      // Merge passed queries with default values
      ...defaults,
      ...queryParams
    };
  }
}