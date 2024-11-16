import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesRoutingModule } from './features-routing.module';
import { HomeModule } from './home/home.module';

@NgModule({
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    HomeModule,
  ]
})

export class FeaturesModule {}