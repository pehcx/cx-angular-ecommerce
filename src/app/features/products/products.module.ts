import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './components/products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductDetailsComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MatCheckboxModule
  ]
})

export class ProductsModule {}