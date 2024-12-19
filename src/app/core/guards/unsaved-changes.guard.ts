import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';

export interface HasUnsavedChanges {
  hasUnsavedChanges: () => boolean;
}

@Injectable({
  providedIn: 'root'
})

export class UnsavedChangesGuard implements CanDeactivate<HasUnsavedChanges> {
  constructor(private dialog: MatDialog) {}

  canDeactivate(component: HasUnsavedChanges): Observable<boolean> | boolean {
    if (component.hasUnsavedChanges()) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Unsaved Changes',
          message: 'You have unsaved changes. Are you sure you want to leave?',
          buttonText: 'Leave',
        },
      });

      return dialogRef.afterClosed().pipe(
        map((confirmed) => confirmed || false)
      );
    } else {
      return true;
    }
  }
}