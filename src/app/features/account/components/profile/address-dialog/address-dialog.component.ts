import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { AccountService } from '../../../shared/account.service';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { Address } from '../../../shared/address.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss']
})

export class AddressDialogComponent implements OnInit {
  addressForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      mode: 'new' | 'edit',
      address?: Address
    },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddressDialogComponent>,
  ) {
    this.addressForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(1)]],
      line1: ['', [Validators.required, Validators.minLength(1)]],
      line2: ['', [Validators.required, Validators.minLength(1)]],
      postalCode: ['', [Validators.required, Validators.minLength(1)]],
      city: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    if (this.data?.address) {
      this.addressForm.patchValue({
        full_name: this.data.address.full_name,
        line1: this.data.address.line1,
        line2: this.data.address.line2,
        postal_code: this.data.address.postal_code,
        city: this.data.address.city,
      });
    } else {
      
    }
  }
  
  onSubmit() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
