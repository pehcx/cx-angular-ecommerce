import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { environment } from 'src/environments/environment';
import { IconComponent } from './components/icon/icon.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { SplitPipe } from './pipes/split.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    IconComponent,
    HomeComponent,
    ProductsComponent,
    AboutusComponent,
    SplitPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // NgHcaptchaModule.forRoot({
    //   siteKey: environment.hcaptcha_sitekey,
    //   languageCode: 'en' // optional, will default to browser language
    // }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
