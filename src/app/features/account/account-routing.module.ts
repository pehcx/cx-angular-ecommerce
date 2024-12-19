import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account.component';
import { ProfileComponent } from './components/profile/profile.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { UnsavedChangesGuard } from 'src/app/core/guards/unsaved-changes.guard';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: '',
        component: AccountSettingsComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canDeactivate: [UnsavedChangesGuard]
      },
      {
        path: 'order-history',
        component: OrderHistoryComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AccountRoutingModule {}