import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, finalize, map, of, Subject, takeUntil } from 'rxjs';
import { Product } from '../shared/product.model';
import { environment } from 'src/environments/environment';
import { ProductsService } from '../shared/products.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading = true;
  addToCartIsLoading = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private supabase: SupabaseService,
    private productsService: ProductsService,
    private errorHandler: ErrorHandlerService,
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
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
        this.isLoading = false
      }),
      takeUntil(this.destroy$),
      catchError((error) => {
        console.error(error);
        this.errorHandler.sendError("Failed to load products. Please try again later");
        return of([]);
      })
    )
    .subscribe(products => {
      this.products = products;
    });
  }

  getImagePath(imageUrl: string) {
    return environment.supabase_url + '/storage/v1/object/public/products/' + imageUrl;
  }

  addToCart(product_id: any) {
    if (this.isLoggedIn()) {
      const params = {
        input_product_id: product_id,
        input_quantity: 1
      }

      this.productsService.addToCart(params).pipe(
        finalize(() => {
          this.addToCartIsLoading = true
        }),
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error(error);
          this.errorHandler.sendError("Failed to Add To Cart. Please try again later");
          return of([]);
        })
      )
      .subscribe(data => console.log(data));
    }
  }

  isLoggedIn() {
    return !!this.supabase.getSession();
  }
}