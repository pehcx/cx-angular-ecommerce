import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AccountService } from '../../../../features/account/shared/account.service';
import { Subject, takeUntil } from 'rxjs';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { Address } from '../../../../features/account/shared/address.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss']
})

export class AddressDialogComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  addressForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      mode: 'new' | 'edit',
      address?: Address
    },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddressDialogComponent>,
    private accountService: AccountService,
    private errorHandler: ErrorHandlerService,
    private snackBarService: SnackBarService,
  ) {
    this.addressForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]],
      line_1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      line_2: ['', [Validators.minLength(1), Validators.maxLength(255)]],
      postal_code: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      city: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    if (this.data?.address) {
      this.addressForm.patchValue({
        full_name: this.data.address.full_name,
        line_1: this.data.address.line_1,
        line_2: this.data.address.line_2,
        postal_code: this.data.address.postal_code,
        city: this.data.address.city,
      });
    } else {
      
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onSubmit() {
    if (this.data.mode == 'new') {
      this.accountService.insertNewAddress(this.addressForm.value).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.snackBarService.show('Address has been added successfully.')
          this.closeDialog();
        },
        error: (error) => {
          this.errorHandler.sendError(error);
        }
      });
    } else {
      const params = {
        id: this.data.address?.id,
        ...this.addressForm.value
      }
      
      this.accountService.updateAddress(params).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.snackBarService.show('The address has been updated successfully.')
          this.closeDialog();
        },
        error: (error) => {
          this.errorHandler.sendError(error);
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
