import { Injectable, signal } from "@angular/core";
import { from, tap } from "rxjs";
import { SupabaseService } from "src/app/core/services/supabase.service";

@Injectable({
  providedIn: 'root'
})

export class CartService {
  cartItemCount = signal(0);

  constructor(
    private supabase: SupabaseService,
  ) { }

  public getCartItemCount() {
    const params = {
      cols: `id, product_id, quantity.sum()`
    };
    
    return from(this.supabase.fetchData('cart_items', params)).pipe(
      tap((cartItems: any[]) => {
        const totalItems = cartItems.reduce((sum, item) => sum + (item.sum || 0), 0);
        this.cartItemCount.set(totalItems);
      })
    );
  }

  // Update the cart item count locally to avoid frequent GET calls
  public updateCartItemCount(newValue = 1) {
    this.cartItemCount.update((currentValue) => {
      const updatedValue = currentValue + newValue;
      return Math.max(updatedValue, 0);
    });
  }
}