import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutusComponent } from './components/aboutus.component';
import { AboutusRoutingModule } from './aboutus-routing.module';


@NgModule({
  declarations: [
    AboutusComponent,
  ],
  imports: [
    CommonModule,
    AboutusRoutingModule,
  ]
})
export class AboutusModule {}
