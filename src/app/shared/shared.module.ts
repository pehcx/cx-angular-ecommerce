import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IconComponent } from "./components/icon/icon.component";
import { ErrorDialogComponent } from "./components/dialogs/error-dialog/error-dialog.component";
import { LoginDialogComponent } from "./components/dialogs/login-dialog/login-dialog.component";
import { ReactiveFormsModule } from "@angular/forms";
import { PreventParentScrollDirective } from "./directives/prevent-parent-scroll.directive";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
  declarations: [
    IconComponent,
    ErrorDialogComponent,
    LoginDialogComponent,
    PreventParentScrollDirective,
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
    PreventParentScrollDirective,
    MatMenuModule,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ]
})

export class SharedModule {}