import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})

export class AccountSettingsComponent implements OnInit {
  user: any;

  constructor(
    private supabase: SupabaseService,
  ) {}

  ngOnInit(): void {
    this.user = this.supabase.getSession()?.user.user_metadata;
  }

  deleteAccount() {
    
  }
}
