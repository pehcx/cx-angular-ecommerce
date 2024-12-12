import { Injectable, signal } from "@angular/core";
import { from, Observable, tap } from "rxjs";
import { SupabaseService } from "src/app/core/services/supabase.service";
import { CartItem } from "./cart-item.model";

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
      tap((totalSum: any[]) => {
        const totalItems = totalSum.reduce((sum, item) => sum + (item.sum || 0), 0);
        this.cartItemCount.set(totalItems);
      })
    );
  }

  public getCartItems(): Observable<CartItem[]> {
    const params = {
      cols: `
        id,
        product_id,
        quantity,
        products(name, image_url, price, stocks(available_quantity))
      `,
      orderBy: 'updated_at'
    };

    return from(this.supabase.fetchData('cart_items', params));
  }
  
  public updateCart(params: any) {
    return from(this.supabase.callFunction('update_cart', params));
  }

  public removeFromCart(params: any) {
    return from(this.supabase.callFunction('remove_from_cart', params))
  }

  // Update the cart item count locally to avoid frequent GET calls
  public updateCartItemCount(newValue = 1) {
    this.cartItemCount.update((currentValue) => {
      const updatedValue = currentValue + newValue;
      return Math.max(updatedValue, 0);
    });
  }
}