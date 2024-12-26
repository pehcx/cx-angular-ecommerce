import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../shared/cart.service';
import { catchError, concatMap, finalize, of, Subject, takeUntil } from 'rxjs';
import { CartItem } from '../shared/cart-item.model';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import * as Helper from 'src/app/core/helpers/common-helper' ;
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  isLoading = true;
  failedLoading = false;
  cartItems: CartItem[] = [];
  getImagePath = Helper.getImagePath;
  restrictToNumbers = Helper.restrictToNumbers;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private errorHandler: ErrorHandlerService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCartItems() {
    this.isLoading = true;
    this.failedLoading = false;

    this.cartService.getCartItems().pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.isLoading = false;
      }),
      catchError((error) => {
        this.failedLoading = true;
        this.errorHandler.sendError(error);
        return of([]);
      })
    ).subscribe((cartItems) => {
      this.cartItems = cartItems;
    });
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

  modifyCartItemQuantity(productId: any, decrement = false) {
    const input = document.getElementById(`${productId}`) as HTMLInputElement;
    
    if (input) {
      input.value = (decrement ? Number(input.value) - 1: Number(input.value) + 1).toString();
      this.updateCart(input);
    } else {
      console.error('Bad input');
      this.errorHandler.sendError('Something went wrong. Please reload the page.');
    }
  }

  preRemove(productId: any) {
    const dialogRef = this.confirmationDialog();

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.removeFromCart(productId);
      }
    });
  }

  subtotal(cartItem: CartItem) {
    const input = document.getElementById(`${cartItem.product_id}`) as HTMLInputElement;

    if (input) {
      return cartItem.products.price * Number(input.value);
    } else {
      // Before input component generation
      return cartItem.products.price * cartItem.quantity;
    }
  }

  total(cartItems: CartItem[]) {
    let total = 0;

    cartItems.forEach(item => {
      total += this.subtotal(item);
    });

    return total;
  }

  checkout() {
    
    this.router.navigate(['/checkout'], { state: { checkout: true } })
  }

  private updateCart(input: HTMLInputElement) {
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
      const dialogRef = this.confirmationDialog();

      dialogRef.afterClosed().pipe(
        takeUntil(this.destroy$)
      ).subscribe((confirmed) => {
        if (confirmed) {
          this.removeFromCart(input.id);
        } else {
          input.value = '1';
          update();
        }
      });
    } else {
      const cartItem = this.cartItems.find((item) => item.product_id == Number(input.id));

      if (cartItem) {
        const available_qty = cartItem.products.stocks[0].available_quantity;

        if (Number(input.value) > available_qty) {
          this.errorHandler.sendError(`You cannot have more than the available stock of ${available_qty}.`);
          input.value = available_qty.toString();
        }

        update();
      }
    }
  }

  private removeFromCart(productId: any) {
    const params = {
      input_product_id: productId
    };

    this.cartService.removeFromCart(params).pipe(
      concatMap(() => this.cartService.getCartItemCount().pipe(
        catchError((error) => {
          this.errorHandler.sendError(error);
          return of(null);
        })
      )),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.product_id !== Number(productId));
        this.snackBarService.show("Removed successfully.");
      },
      error: (error) => {
        this.errorHandler.sendError(error);
      }
    });
  }

  private confirmationDialog() {
    return this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure?',
        message: 'Do you really want to remove this item from your cart?',
        buttonText: 'Remove'
      }
    });
  }
}
