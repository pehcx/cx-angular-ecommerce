import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../shared/cart.service';
import { catchError, concatMap, of, Subject, takeUntil } from 'rxjs';
import { CartItem } from '../shared/cart-item.model';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';

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
    private dialog: MatDialog,
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

  preUpdateCart(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.value == '') {
      input.value = '1';
    } else if (Number(input.value) <= 0) {
      input.value = '0';
    }

    const cartItem = this.cartItems.find((item) => item.product_id == Number(input.id));

    if (cartItem) {
      const available_qty = cartItem.products.stocks[0].available_quantity;

      if (Number(input.value) > available_qty) {
        this.errorHandler.sendError(`You cannot have more than the available stock of ${available_qty}.`);
        input.value = available_qty.toString();
      }

      this.updateCart(input);
    }
  }

  updateCart(input: HTMLInputElement) {
    const update = () => {
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
        )),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (cartItemCount) => {
          // Do nothing as the cart item count will be updated automatically
        },
        error: (error) => {
          this.errorHandler.sendError(error);
        }
      });
    };

    if (Number(input.value) <= 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Are you sure?',
          message: 'Do you really want to remove this item from your cart?',
          buttonText: 'Remove'
        }
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          const params = {
            input_product_id: input.id
          };
          this.cartService.removeFromCart(params).pipe(
            takeUntil(this.destroy$)
          ).subscribe({
            next: () => {
              this.cartItems = this.cartItems.filter(item => item.product_id !== Number(input.id));
              this.snackBarService.show("Removed successfully.");
            },
            error: (error) => {
              this.errorHandler.sendError(error);
            }
          });
        } else {
          input.value = '1';
          update();
        }
      });
    } else {
      update();
    }
  }

  modifyCartItemQuantity(productId: any, decrement = false) {
    const input = document.getElementById(`${productId}`) as HTMLInputElement;
    
    if (input) {
      input.value = (decrement ? Number(input.value) - 1: Number(input.value) + 1).toString();
    }

    this.updateCart(input);
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
