import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './components/account.component';
import { AccountRoutingModule } from './account-routing.module';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AccountComponent,
    AccountSettingsComponent,
    ProfileComponent,
    OrderHistoryComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    RouterModule,
    MatTabsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})

export class AccountModule {}