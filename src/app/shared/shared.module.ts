import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ErrorDialogComponent } from "./components/dialogs/error-dialog/error-dialog.component";
import { LoginDialogComponent } from "./components/dialogs/login-dialog/login-dialog.component";
import { ReactiveFormsModule } from "@angular/forms";
import { PreventParentScrollDirective } from "./directives/prevent-parent-scroll.directive";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from "@angular/material/menu";
import { IconComponent } from "./components/icon/icon.component";
import { ConfirmationDialogComponent } from "./components/dialogs/confirmation-dialog/confirmation-dialog.component";
import { AddressDialogComponent } from "./components/dialogs/address-dialog/address-dialog.component";
import { AddressListComponent } from "./components/address-list/address-list.component";
import { CardNumberFormatterDirective } from "./directives/card-number-formatter.directive";
import { ExpiryDateFormatterDirective } from "./directives/expiry-date-formatter.directive";
import { OrderDetailsDialogComponent } from "./components/dialogs/order-details-dialog/order-details-dialog.component";

@NgModule({
  declarations: [
    IconComponent,
    ErrorDialogComponent,
    LoginDialogComponent,
    ConfirmationDialogComponent,
    AddressListComponent,
    AddressDialogComponent,
    OrderDetailsDialogComponent,
    PreventParentScrollDirective,
    CardNumberFormatterDirective,
    ExpiryDateFormatterDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  exports: [
    IconComponent,
    ErrorDialogComponent,
    LoginDialogComponent,
    ConfirmationDialogComponent,
    AddressListComponent,
    AddressDialogComponent,
    OrderDetailsDialogComponent,
    PreventParentScrollDirective,
    MatMenuModule,
    CardNumberFormatterDirective,
    ExpiryDateFormatterDirective,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ]
})

export class SharedModule {}