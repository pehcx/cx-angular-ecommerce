import { EventEmitter, Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { AuthState } from '../enums/auth-state';
import { QueryParams } from '../interfaces/query-params.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class SupabaseService {
  private supabase: SupabaseClient;
  private session: Session | null = null;
  authStateChanged: EventEmitter<AuthState> = new EventEmitter<AuthState>();

  constructor(
    private router: Router,
  ) {
    this.supabase = createClient(environment.supabase_url, environment.supabase_key, {
      auth: {
        // This is the default config
        persistSession: true,
        storage: localStorage
      }
    });

    this.authStateChangeHandler();
  }

  /* #region Authentication */
  public async signUp(form: {
    email: string,
    full_name: string,
    password: string,
  }) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name
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
  
      if (error) throw error;

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
    const { error } = await this.supabase.auth.signOut();

    if (error) throw error;
  }

  public getSession(): Session | null {
    return this.session;
  }

  public async updateUserData(params: any) {
    try {
      const { data, error } = await this.supabase.auth.updateUser({
        data: params
      });

      if (error) throw error;
      
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

  private authStateChangeHandler() {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          // Triggers:
          // 1. The user signs in
          // 2. Page reloads
          // 3. User gets back to the tab
          this.session = session;
          this.authStateChanged.emit(AuthState.SIGNED_IN);
          break;

        case 'SIGNED_OUT':
          this.session = null;
          this.authStateChanged.emit(AuthState.SIGNED_OUT);
          this.router.navigate(['/']);
          break;

        case 'TOKEN_REFRESHED':
          this.session = session;
          this.authStateChanged.emit(AuthState.TOKEN_REFRESHED);
          break;

        case 'USER_UPDATED':
          this.session = session;
          this.authStateChanged.emit(AuthState.USER_UPDATED);
          // this.supabase.auth.refreshSession();
          break;

        default:
          if (!Object.values(AuthState).includes(event as AuthState)) {
            console.warn('Encountered an unhandled Supabase auth state change event', event);
          }
          break;
      }
    });
  }
  /* #endregion */

  /* #region Database & Queries */
  public async fetchData(table: string, queryParams: QueryParams = {}): Promise<any[]> {
    const queries = this.buildQueries(queryParams);
    let sbQueries = this.supabase
      .from(table)
      .select(queries.cols)
      .order(queries.orderBy, { ascending: queries.sortByAsc })
      .limit(queries.limitBy);

    if (queries.eq && queries.eq.column && queries.eq.value) {
      sbQueries = sbQueries.eq(queries.eq.column, queries.eq.value);
    }

    const { data, error } = await sbQueries;

    if (error) throw error;
    return data ?? [];
  }

  public async callFunction(func: string, params?: object) {
    const { data, error } = params
      ? await this.supabase.rpc(func, params)
      : await this.supabase.rpc(func);

    if (error) throw error;
    return data ?? [];
  }
  /* #endregion */

  /* #region Helpers */
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
  /* #endregion */
}