import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { Product } from 'src/app/core/models/product.model';
import { QueryParams } from 'src/app/core/interfaces/query-params.interface';
import { ProductCategory } from 'src/app/core/models/product-category.model';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  constructor(private supabaseService: SupabaseService) {}

  public getProducts(params: QueryParams = {}): Observable<Product[]> {
    return from(this.supabaseService.fetchData('products', params));
  }

  public getProductCategories(params: QueryParams = {}): Observable<ProductCategory[]> {
    return from(this.supabaseService.fetchData('product_categories', params));
  }
}