import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { environment } from 'src/environments/environment';
import { IconComponent } from './components/icon/icon.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { SplitPipe } from './pipes/split.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { TermsComponent } from './components/terms/terms.component';
import { CartComponent } from './components/cart/cart.component';
import { AuthModalComponent } from './components/modals/auth-modal/auth-modal.component';
import { ProductModalComponent } from './components/modals/product-modal/product-modal.component';
import { BaseModalComponent } from './components/modals/base-modal/base-modal.component';
import { MatDialogModule } from '@angular/material';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        IconComponent,
        HomeComponent,
        ProductsComponent,
        AboutusComponent,
        SplitPipe,
        FooterComponent,
        TermsComponent,
        CartComponent,
        AuthModalComponent,
        ProductModalComponent,
        BaseModalComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatDialogModule,
    ], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
