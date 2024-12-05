import { Injectable } from "@angular/core";
import { from } from "rxjs";
import { SupabaseService } from "src/app/core/services/supabase.service";

@Injectable({
  providedIn: 'root'
})

export class CartService {
  constructor(
    private supabase: SupabaseService,
  ) { }

  public getCartItemCount() {
    const params = {
      cols: `id, product_id, quantity.sum()`
    };

    return from(this.supabase.fetchData('cart_items', params));
  }
}