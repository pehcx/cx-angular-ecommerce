import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgHcaptchaModule.forRoot({
      siteKey: environment.hcaptcha_sitekey,
      languageCode: 'en' // optional, will default to browser language
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
