import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar,
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    this.isLoading = true;
    if (this.page === 'login' && this.loginForm.valid) {
      await this.supabase.signIn(this.loginForm.value).then(({ data, error }) => {
        if (error) {
          this.errorHandler.sendError(error);
        }

        if (data) {
          this.closeDialog();
          this.showSnackbar("Logged in successfully!");
        }
      });
    } else if (this.page === 'signup' && this.signUpForm.valid) {
      await this.supabase.signUp(this.signUpForm.value).then(({ data, error }) => {
        if (error) {
          this.errorHandler.sendError(error);
        }

        if (data) {
          this.closeDialog();
          this.showSnackbar("Signed up successfully!");
        }
      });
    } else {
      this.errorHandler.sendError('Invalid form submission');
    }

    this.isLoading = false;
  }

  switchPage() {
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

  showSnackbar(message: string) {
    this.snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}