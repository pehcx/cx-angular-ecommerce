import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, finalize, map, of, Subject, takeUntil } from 'rxjs';
import { Product } from '../shared/product.model';
import { environment } from 'src/environments/environment';
import { ProductsService } from '../shared/products.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from 'src/app/shared/components/dialogs/login-dialog/login-dialog.component';
import { CartService } from '../../cart/shared/cart.service';
import { ProductCategory } from '../shared/product-category.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productCategories: any = [];
  selectedCategories: Set<number> = new Set();

  isLoading = true;
  failedLoading = false;
  addToCartIsLoading: any;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private supabase: SupabaseService,
    private productsService: ProductsService,
    private errorHandler: ErrorHandlerService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private cartService: CartService,
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
        product_categories(categories(id, name)),
        stocks(available_quantity)
      `
    };

    this.productsService.getProducts(params).pipe(
      map((products: any[]) => {
        const finalProducts = products;
        // .map(product => ({
        //   ...product,
        //   product_categories: product.product_categories.map((pc: { categories: any; }) => pc.categories),
        //   stocks: product.stocks?.[0]?.available_quantity ?? 0
        // }));
        
        const productCategories: ProductCategory[] = Array.from(
          new Map(finalProducts.flatMap(product => product.product_categories[0].categories).map((category: any) => [category.id, category])).values()
        );

        return { finalProducts, productCategories };
      }),
      finalize(() => {
        this.isLoading = false;
      }),
      takeUntil(this.destroy$),
      catchError((error) => {
        this.failedLoading = true;
        console.error(error);
        this.errorHandler.sendError("Failed to load products. Please try again later");
        return of({ finalProducts: [], productCategories: [] });
      })
    )
    .subscribe(({finalProducts, productCategories}) => {
      this.products = finalProducts;
      this.filteredProducts = finalProducts;
      this.productCategories = productCategories;

      this.productCategories.forEach((category: any) => {
        this.selectedCategories.add(category.id);
      });

      this.addToCartIsLoading = finalProducts.reduce((acc: { [productId: number]: boolean }, product) => {
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
          this.snackBarService.show(`Successfully added ${product.name} into the cart.`);
          this.cartService.updateCartItemCount();
        },
        error: (e) => {
          console.error(e);
          this.errorHandler.sendError(e);
        }
      });
    } else {
      this.dialog.open(LoginDialogComponent);
      this.snackBarService.show("You have to login first.");
      this.addToCartIsLoading[product.id] = false;
    }
  }

  onCategorySelectionChange(categoryId: number, isChecked: boolean) {
    console.log(categoryId)
    if (isChecked) {
      this.selectedCategories.add(categoryId);
    } else {
      this.selectedCategories.delete(categoryId);
    }
    this.filterProducts();
  }

  filterProducts() {
    if (this.selectedCategories.size === 0) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.product_categories.some((productCategory) =>
          this.selectedCategories.has(productCategory.categories.id)
        )
      );
    }
  }

  isLoggedIn() {
    return !!this.supabase.getSession();
  }
}