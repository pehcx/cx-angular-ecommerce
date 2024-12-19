import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  constructor(private supabase: SupabaseService) {}

  public deleteAccount() {
    return from(this.supabase.callFunction('delete_account'));
  }
}