import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './components/products.component';
import { ProductDetailsComponent } from './components/product-details.component';
import { ProductIdGuard } from 'src/app/core/guards/product-id.guard';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent
  },
  {
    path: ':id',
    component: ProductDetailsComponent,
    canActivate: [ProductIdGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductsRoutingModule {}