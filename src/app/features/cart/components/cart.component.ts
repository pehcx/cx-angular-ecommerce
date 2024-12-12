import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../shared/cart.service';
import { catchError, concatMap, of, Subject, takeUntil } from 'rxjs';
import { CartItem } from '../shared/cart-item.model';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private errorHandler: ErrorHandlerService,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.cartService.getCartItems().pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        this.errorHandler.sendError(error);
        return of([]);
      })
    ).subscribe((cartItems) => {
      this.cartItems = cartItems;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateCart(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.value == '') {
      input.value = '1';
    }

    const cartItem = this.cartItems.find((item) => item.product_id == Number(input.id));

    if (cartItem) {
      const available_qty = cartItem.products.stocks[0].available_quantity;

      if (Number(input.value) > available_qty) {
        this.errorHandler.sendError(`You cannot have more than the available stock of ${available_qty}.`);
        input.value = available_qty.toString();
      }

      const params = {
        input_product_id: input.id,
        input_quantity: input.value
      };

      this.cartService.updateCart(params).pipe(
        concatMap(() => this.cartService.getCartItemCount().pipe(
          catchError((error) => {
            this.errorHandler.sendError(error);
            return of(null);
          })
        ))
      ).subscribe({
        next: (cartItemCount) => {
          // The cart item count will be updated automatically
        },
        error: (error) => {
          this.errorHandler.sendError(error);
        }
      });
    }
  }

  checkout() {
    
  }

  restrictToNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    const numericValue = value.replace(/[^0-9]/g, '');
    if (value !== numericValue) {
      input.value = numericValue;
      event.preventDefault();
    }
  }

  getImagePath(imageUrl: string) {
    return environment.supabase_url + '/storage/v1/object/public/products/' + imageUrl;
  }
}
