import { Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
  
export class SnackBarService {
  constructor(
    private snackBar: MatSnackBar,
  ) { }

  show(message: string) {
    this.snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}