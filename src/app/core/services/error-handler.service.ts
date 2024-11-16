import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/components/dialogs/error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})

export class ErrorHandlerService {

  constructor(
    private dialog: MatDialog
  ) {}

  sendError(error?: any): void {
    const errorMessage = 
      typeof error === 'string' ? error : 
      (error && typeof error === 'object' && error.message ? error.message : 'An unexpected error occurred!');
    
    this.dialog.open(ErrorDialogComponent, {
      data: { message: errorMessage }
    });
    
    console.error('Error:', error);
  }
}
