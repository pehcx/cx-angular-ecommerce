import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Injectable({
  providedIn: 'root'
})

export class CheckoutService {
  private readonly timerKey = 'checkoutTimer';
  private readonly countdownDuration = 5 * 60 * 1000;

  constructor(private supabase: SupabaseService) {}

  public checkout(params: any) {
    return from(this.supabase.callFunction('checkout', params));
  }
}