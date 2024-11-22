import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, combineLatest, finalize, forkJoin, of, Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/core/models/product.model';
import { environment } from 'src/environments/environment';
import { ProductsService } from '../services/products.service';
import { ProductCategory } from 'src/app/core/models/product-category.model';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading = true;
  private readonly destroy$ = new Subject<void>();

  constructor(
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
    forkJoin([
      this.productsService.getProducts(),
      this.productsService.getProductCategories()
    ])
    .pipe(
      finalize(() => {
        this.isLoading = false
      }),
      takeUntil(this.destroy$),
      catchError((error) => {
        console.error(error);
        this.errorHandler.sendError("Failed to load products. Please try again later");
        return of([[],[]]);
      })
    )
    .subscribe(([products, categories]) => {
      this.products = products.map(product => {
        const productCategories = categories
          .filter(category => category.product_id === product.id)
          .map(category => category.category_id);
        return { ...product, categories: productCategories };
      });
      console.log(this.products);
    });
  }

  getImagePath(imageUrl: string) {
    return environment.supabase_url + '/storage/v1/object/public/products/' + imageUrl;
  }
}