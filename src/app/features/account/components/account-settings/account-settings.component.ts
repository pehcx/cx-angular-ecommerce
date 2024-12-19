import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { AccountService } from '../../shared/account.service';
import { Subject, takeUntil } from 'rxjs';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})

export class AccountSettingsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  user: any;

  constructor(
    private supabase: SupabaseService,
    private accountService: AccountService,
    private errorHandler: ErrorHandlerService,
    private snackBarService: SnackBarService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.user = this.supabase.getSession()?.user.user_metadata;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();  
  }

  deleteAccount() {
    const dialogRef = this.confirmationDialog();

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.accountService.deleteAccount().pipe(
          takeUntil(this.destroy$),
        ).subscribe({
          next: () => {
            // Clear session
            localStorage.clear();

            // Redirect to homepage
            window.location.reload();
            this.snackBarService.show('Your account has been removed. We hope you enjoy exploring this demo project!');
          },
          error: (e) => {
            console.error(e);
            this.errorHandler.sendError(e);
          }
        });
      }
    });
  }

  private confirmationDialog() {
    return this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure?',
        message: 'Do you really want to delete your account?',
        buttonText: 'Delete'
      }
    });
  }
}
