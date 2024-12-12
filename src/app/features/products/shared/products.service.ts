import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { Product } from './product.model';
import { QueryParams } from 'src/app/core/interfaces/query-params.interface';
import { ProductCategory } from './product-category.model';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  constructor(private supabase: SupabaseService) {}

  public getProducts(params: QueryParams = {}): Observable<Product[]> {
    return from(this.supabase.fetchData('products', params));
  }

  public getProductCategories(params: QueryParams = {}): Observable<ProductCategory[]> {
    return from(this.supabase.fetchData('product_categories', params));
  }

  public addToCart(params: any): Observable<Product> {
    return from(this.supabase.callFunction('add_to_cart', params));
  }
}