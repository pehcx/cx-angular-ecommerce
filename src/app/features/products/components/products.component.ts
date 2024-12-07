import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, finalize, map, of, Subject, takeUntil } from 'rxjs';
import { Product } from '../shared/product.model';
import { environment } from 'src/environments/environment';
import { ProductsService } from '../shared/products.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading = true;
  failedLoading = false;
  addToCartIsLoading: any;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private supabase: SupabaseService,
    private productsService: ProductsService,
    private errorHandler: ErrorHandlerService,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.isLoading = true;
    this.failedLoading = false;

    const params = {
      cols: `
        *,
        product_categories(categories(id, name))
      `
    };

    this.productsService.getProducts(params).pipe(
      map((products: any[]) =>
        products.map(product => ({
          ...product,
          product_categories: product.product_categories.map((pc: { categories: any; }) => pc.categories)
        }))
      ),
      finalize(() => {
        this.isLoading = false;
      }),
      takeUntil(this.destroy$),
      catchError((error) => {
        this.failedLoading = true;
        console.error(error);
        this.errorHandler.sendError("Failed to load products. Please try again later");
        return of([]);
      })
    )
    .subscribe((products) => {
      this.products = products;
      this.addToCartIsLoading = products.reduce((acc: { [key: number]: boolean }, product) => {
        acc[product.id] = false;
        return acc;
      }, {});
    });
  }

  getImagePath(imageUrl: string) {
    return environment.supabase_url + '/storage/v1/object/public/products/' + imageUrl;
  }

  addToCart(product: any) {
    this.addToCartIsLoading[product.id] = true;
    if (this.isLoggedIn()) {
      const params = {
        input_product_id: product.id,
        input_quantity: 1
      }

      this.productsService.addToCart(params).pipe(
        finalize(() => {
          this.addToCartIsLoading[product.id] = false
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: () => {
          this.snackBarService.show(`Successfully added ${product.name} into the cart.`)
        },
        error: (e) => {
          console.error(e);
          this.errorHandler.sendError(e);
        }
      });
    }
  }

  isLoggedIn() {
    return !!this.supabase.getSession();
  }
}