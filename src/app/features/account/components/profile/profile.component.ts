import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { HasUnsavedChanges } from 'src/app/core/guards/unsaved-changes.guard';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, HasUnsavedChanges {
  updateProfileForm: FormGroup;
  user: any;
  unsavedChanges = false;

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
  ) {
    this.updateProfileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.user = this.supabase.getSession()?.user.user_metadata;

    if (this.user) {
      this.updateProfileForm.patchValue({
        fullName: this.user.full_name
      });
    }
  }

  hasUnsavedChanges(): boolean {
    return true;
  }
  
  onSubmit() {

  }
}
