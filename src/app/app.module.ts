import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FeaturesModule } from './features/features.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        SharedModule,
        BrowserAnimationsModule,
        FeaturesModule,
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
    ]
})

export class AppModule { }