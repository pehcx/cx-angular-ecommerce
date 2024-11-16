import { EventEmitter, Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { AuthState } from '../enums/auth-state';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})

export class SupabaseService {
  private supabase: SupabaseClient;
  private cachedSession: Session | null;
  private user: any;
  authStateChanged: EventEmitter<AuthState> = new EventEmitter<AuthState>();

  constructor(
    private errorHandlerService: ErrorHandlerService
  ) {
    this.supabase = createClient(environment.supabase_url, environment.supabase_key, {
      auth: {
        // Default config
        persistSession: true,
        storage: localStorage
      }
    });

    this.setupAuthStateChangeHandler();
  }

  async fetchData() {
    try {
      const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .order('id');

      if (error) {
        throw error;
      }
    } catch (error) {

    }
  }

  getSession(): Session | null {
    return this.cachedSession || null;
  }

  getUser() {
    return this.user;
  }

  async fetchUserData() {
    try {
      const { data, error } = await this.supabase.auth.getUser();

      if (error) {
        throw error;
      }

      this.user = data;
    } catch (error) {
      this.errorHandlerService.sendError(error);
    }
  }

  private setupAuthStateChangeHandler() {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          this.cachedSession = session;
          this.user = session ? session.user: null;
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
          this.authStateChanged.emit(AuthState.USER_UPDATED);
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
}