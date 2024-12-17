import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ProductsService } from '../../shared/products.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { Product } from '../../shared/product.model';
import * as Helper from 'src/app/core/helpers/common-helper' ;
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { CartService } from 'src/app/features/cart/shared/cart.service';
import { LoginDialogComponent } from 'src/app/shared/components/dialogs/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthState } from 'src/app/core/enums/auth-state';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit, OnDestroy {
  getImagePath = Helper.getImagePath;
  restrictToNumbers = Helper.restrictToNumbers;
  
  private destroy$ = new Subject<void>();
  product: Product;
  productId: number;
  cartItemCount: number;
  isLoading = true;
  addToCartIsLoading = false;

  quantity = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private supabase: SupabaseService,
    private cartService: CartService,
    private productsService: ProductsService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      takeUntil(this.destroy$),
      map(params => params['id']),
      switchMap(productId => {
        const params = {
          cols: `
            *,
            product_categories(categories(id, name)),
            stocks(available_quantity),
            cart_items(quantity)
          `,
          eq: {
            column: "id",
            value: productId
          }
        };

        return this.productsService.getProducts(params);
      })
    ).subscribe({
      next: (products) => {
        if (products && products.length > 0) {
          this.product = products[0];
          this.cartItemCount = this.product?.cart_items?.length > 0 ? this.product?.cart_items[0].quantity: 0;
          this.isLoading = false;
        } else {
          this.errorHandler.sendError("The product you're looking for cannot be found!");
          this.router.navigate(['/products']);
        }
      },
      error: (error) => {
        // Navigate users back to Products page instead of providing a `Reload` button
        this.errorHandler.sendError(error);
        this.router.navigate(['/products']);
      }
    });

    this.supabase.authStateChanged.pipe(
      takeUntil(this.destroy$),
      switchMap((authState: AuthState) => {
        if (authState === AuthState.SIGNED_IN || authState === AuthState.TOKEN_REFRESHED) {
          return this.cartService.getCartItemCount(this.product.id).pipe(
            catchError((error) => {
              this.errorHandler.sendError(error);
              return of(null);
            })
          );
        }

        return of(null);
      })
    ).subscribe((res) => {
      if (res) {
        this.cartItemCount = res[0].sum;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  modifyQuantity(decrement = false) {
    const modifier = decrement ? -1: 1;
    this.quantity += modifier;
  }

  addToCart() {
    this.addToCartIsLoading = true;

    if (this.isLoggedIn()) {
          const params = {
            input_product_id: this.product.id,
            input_quantity: this.quantity
          }
    
          this.productsService.addToCart(params).pipe(
            finalize(() => {
              this.addToCartIsLoading = false
            }),
            takeUntil(this.destroy$),
          )
          .subscribe({
            next: () => {
              this.snackBarService.show(`Successfully added ${this.product.name} into the cart.`);
              this.cartService.updateCartItemCount();
              this.cartItemCount += this.quantity;
            },
            error: (e) => {
              console.error(e);
              this.errorHandler.sendError(e);
            }
          });
        } else {
          this.dialog.open(LoginDialogComponent);
          this.snackBarService.show("You have to login first.");
          this.addToCartIsLoading = false;
        }
  }

  inputValidator(event: any) {
    this.restrictToNumbers(event);
    const max = Math.max((this.product.stocks[0].available_quantity - this.cartItemCount), 1);

    this.quantity = Math.min(Number(event.target.value), max);
  }

  isLoggedIn() {
    return !!this.supabase.getSession();
  }
}