import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IconComponent } from "./components/icon/icon.component";
import { ErrorDialogComponent } from "./components/dialogs/error-dialog/error-dialog.component";

@NgModule({
  declarations: [
    IconComponent,
    ErrorDialogComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IconComponent,
    ErrorDialogComponent,
  ],
})

export class SharedModule {}