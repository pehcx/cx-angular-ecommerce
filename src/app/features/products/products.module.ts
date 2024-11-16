import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './components/products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductDetailsComponent } from './components/product-details.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductDetailsComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
  ]
})

export class ProductsModule {}