import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { HasUnsavedChanges } from 'src/app/core/guards/unsaved-changes.guard';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { AccountService } from '../../shared/account.service';
import { Subject } from 'rxjs';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

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

  user: any;

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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hasUnsavedChanges(): boolean {
    return this.updateProfileForm.dirty;
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
