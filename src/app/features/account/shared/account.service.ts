import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { Address } from './address.model';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  constructor(private supabase: SupabaseService) {}

  public deleteAccount() {
    return from(this.supabase.callFunction('delete_account'));
  }

  public getUserAddresses() {
    return from(this.supabase.fetchData('user_addresses'));
  }

  public insertNewAddress(obj: Address) {
    return from(this.supabase.insertData('user_addresses', obj));
  }

  public updateAddress(obj: Address) {
    return from(this.supabase.updateData('user_addresses', obj));
  }

  public deleteAddress(obj: Address) {
    return from(this.supabase.deleteData('user_addresses', obj));
  }
}