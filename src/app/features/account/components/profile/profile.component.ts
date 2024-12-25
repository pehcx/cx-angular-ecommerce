import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { HasUnsavedChanges } from 'src/app/core/guards/unsaved-changes.guard';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { AccountService } from '../../shared/account.service';
import { catchError, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { Address } from '../../shared/address.model';
import { MatDialog } from '@angular/material/dialog';
import { AddressDialogComponent } from '../../../../shared/components/dialogs/address-dialog/address-dialog.component';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy, HasUnsavedChanges {
  private readonly destroy$ = new Subject<void>;

  updateProfileForm: FormGroup;
  unsavedChanges = false;
  isUpdating = false;
  isLoadingAddresses = false;
  loadAddressesFailed = false;

  user: any;
  addresses: Address[] = [];

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private accountService: AccountService,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
  ) {
    this.updateProfileForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.user = this.supabase.getSession()?.user.user_metadata;

    if (this.user) {
      this.updateProfileForm.patchValue({
        full_name: this.user.full_name
      });
    }

    this.loadAddresses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hasUnsavedChanges(): boolean {
    return this.updateProfileForm.dirty;
  }

  loadAddresses() {
    this.loadAddressesFailed = false;
    this.isLoadingAddresses = true;

    this.accountService.getUserAddresses().pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        console.log(error);
        this.errorHandler.sendError("Failed to load addresses. Please try again later");
        this.loadAddressesFailed = true;
        return of([]);
      })
    ).subscribe((addresses) => {
      this.isLoadingAddresses = false;
      this.addresses = addresses;
    });
  }

  addNewAddress() {
    if (this.addresses.length < 3) {
    const dialogRef = this.dialog.open(AddressDialogComponent, { data: {
      mode: 'new'
    }});

      dialogRef.afterClosed().pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.loadAddresses();
      });
    }
  }

  onModifyAddress(id: any, mode: 'edit' | 'delete') {
    const address = this.addresses.find(add => add.id === id);
    
    if (!address) {
      this.errorHandler.sendError('Something went wrong!');
      return;
    }

    if (mode == 'edit') {
      const dialogRef = this.dialog.open(AddressDialogComponent, { data: {
        address: address,
        mode: mode
      }});

      dialogRef.afterClosed().pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.loadAddresses();
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Are you sure?',
          message: 'Do you really want to delete this address?',
          buttonText: 'Delete'
        }
      });

      dialogRef.afterClosed().pipe(
        takeUntil(this.destroy$),
        switchMap((confirmed) => {
          if (confirmed) {
            return this.accountService.deleteAddress(address).pipe(
              tap(() => {
                this.snackBarService.show('Deleted successfully.');
                this.loadAddresses();
              })
            );
          } else {
            this.loadAddresses();
            return [];
          }
        })
      ).subscribe();
    }
  }
  
  onUpdateProfile() {
    this.isUpdating = true;
    const params = {
      full_name: this.updateProfileForm.controls['full_name'].value
    };

    this.supabase.updateUserData(params).then(({ data, error }) => {
      if (error) {
        this.errorHandler.sendError(error);
      }

      if (data) {
        this.snackBarService.show('Profile has been updated successfully!');
        this.updateProfileForm.markAsPristine();
      }
    }).catch(exception => {
      this.errorHandler.sendError(exception);
    }).finally(() => {
      this.isUpdating = false;
    });
  }
}
