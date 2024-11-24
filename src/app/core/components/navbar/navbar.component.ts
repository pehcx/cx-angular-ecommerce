import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SupabaseService } from '../../services/supabase.service';
import { Subscription } from 'rxjs';
import { AuthState } from '../../enums/auth-state';
import { LoginDialogComponent } from 'src/app/shared/components/dialogs/login-dialog/login-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    // Animations for mobile menu
    trigger('menuButton', [
      state('isOpen', style({
        transform: 'rotate(360deg) scale(0)'
      })),
      state('isClosed', style({
        transform: 'rotate(0deg) scale(1)'
      })),
      transition('isOpen => isClosed', [animate('0.3s')]),
      transition('isClosed => isOpen', [animate('0.3s')]),
    ]),
    trigger('closeButton', [
      state('isOpen', style({
        transform: 'rotate(0deg) scale(1)'
      })),
      state('isClosed', style({
        transform: 'rotate(-360deg) scale(0)'
      })),
      transition('isOpen => isClosed', [animate('0.3s')]),
      transition('isClosed => isOpen', [animate('0.3s')]),
    ]),
    trigger('drawer', [
      state('isOpen', style({
        transform: 'translateX(0)'
      })),
      state('isClosed', style({
         transform: 'translateX(-100vw)'
      })),
      transition('isOpen => isClosed', [animate('0.3s')]),
      transition('isClosed => isOpen', [animate('0.3s')]),
    ])
  ]
})

export class NavbarComponent implements OnInit {
  private authSubscription: Subscription;
  cartItems = 0;
  isOpen = false;
  session: any;
  user: any;

  constructor(
    private dialog: MatDialog,
    private supabase: SupabaseService,
    private snackBar: MatSnackBar,
  ) {
    this.session = this.supabase.getSession();
    this.user = this.supabase.getUser();
  }

  ngOnInit(): void {
    this.authSubscription = this.supabase.authStateChanged.subscribe((authState: AuthState) => {
      if (authState === AuthState.SIGNED_OUT) {
        this.showSnackbar("You've been signed out.");
      }
    })
  }

  onButtonClick(button: string, isMobile = false) {
    if (isMobile) this.isOpen = !this.isOpen;
    if (button === 'login') {
      this.dialog.open(LoginDialogComponent);
    } else if (button === 'logout') {
      this.supabase.signOut();
    } else if (button === 'profile') {

    }
  }

  isLoggedIn() {
    return !!this.supabase.getSession();
  }

  showSnackbar(message: string) {
    this.snackBar.open(message, '', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}