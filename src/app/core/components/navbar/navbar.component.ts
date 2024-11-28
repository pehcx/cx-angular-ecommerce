import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SupabaseService } from '../../services/supabase.service';
import { Subscription } from 'rxjs';
import { AuthState } from '../../enums/auth-state';
import { LoginDialogComponent } from 'src/app/shared/components/dialogs/login-dialog/login-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from '../../services/error-handler.service';

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

export class NavbarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  cartItems = 0;
  isOpen = false;
  session: any;

  constructor(
    private dialog: MatDialog,
    private errorHandler: ErrorHandlerService,
    private supabase: SupabaseService,
    private snackBar: MatSnackBar,
  ) {
    
  }

  ngOnInit(): void {
    this.subscriptions.push(this.supabase.authStateChanged.subscribe((authState: AuthState) => {
      this.session = this.supabase.getSession();
      
      if (authState === AuthState.SIGNED_OUT) {
        this.showSnackbar("👋 Goodbye and have a nice day.");
      }
    }));

    // this.supabase.retrieveSession().then(({data, error}) => {
    //   if (error) {
    //     this.errorHandler.sendError(error);
    //   }

    //   if (data) {
    //     this.session = data.session;
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async onButtonClick(button: string, isMobile = false) {
    if (isMobile) this.isOpen = !this.isOpen;
    if (button === 'login') {
      this.dialog.open(LoginDialogComponent);
    } else if (button === 'logout') {
      try {
        await this.supabase.signOut();
      } catch (error) {
        if (error) this.errorHandler.sendError(error);
      }
    } else if (button === 'profile') {

    }
  }

  toggleAccountMenu() {
    const accountMenu = document.querySelector('.account-menu');
    const down = document.querySelector('#down');

    if (accountMenu) accountMenu.classList.toggle('hidden');
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