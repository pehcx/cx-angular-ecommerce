import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})

export class LoginDialogComponent {
  @Input() page = 'login';
  email = new FormControl('');
  password = new FormControl('');
  loginForm: FormGroup;
  signUpForm: FormGroup;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private errorHandler: ErrorHandlerService,
    private snackBarService: SnackBarService,
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    this.isLoading = true;

    // Close the Login/Signup modal only when the attempt is successful
    if (this.page === 'login' && this.loginForm.valid) {
      await this.supabase.signIn(this.loginForm.value).then(({ data, error }) => {
        if (error) {
          this.errorHandler.sendError(error);
        }

        if (data) {
          this.closeDialog();
          this.snackBarService.show(`🍇🍉 Welcome back, ${data.user.user_metadata['full_name']}! 🍒🍌`);
        }
      });
    } else if (this.page === 'signup' && this.signUpForm.valid) {
      await this.supabase.signUp(this.signUpForm.value).then(({ data, error }) => {
        if (error) {
          this.errorHandler.sendError(error);
        }

        if (data) {
          this.closeDialog();
          this.snackBarService.show("🎉 Signed up successfully!");
        }
      });
    } else {
      this.errorHandler.sendError('Invalid form submission');
    }

    this.isLoading = false;
  }

  switchPage() {
    // Switch the form and clear the fields
    this.page = this.page === 'login' ? 'signup': 'login';
    if (this.page === 'login') {
      this.signUpForm.reset();
    } else {
      this.loginForm.reset();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}