import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from './services/supabase.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  providers: [
    SupabaseService,
    ErrorHandlerService,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
  ]
})

export class CoreModule {}