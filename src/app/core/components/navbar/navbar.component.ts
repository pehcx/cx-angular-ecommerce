import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SupabaseService } from '../../services/supabase.service';
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs';
import { AuthState } from '../../enums/auth-state';
import { LoginDialogComponent } from 'src/app/shared/components/dialogs/login-dialog/login-dialog.component';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { CartService } from 'src/app/features/cart/shared/cart.service';

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
    ]),
    trigger('accountMenu', [
      state('isOpen', style({
        height: '*',
        overflow: 'hidden'
      })),
      state('isClosed', style({
        height: '0px',
        overflow: 'hidden'
      })),
      transition('isOpen <=> isClosed', [animate('0.3s')]),
    ])
  ]
})

export class NavbarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  cartItemCount: any;
  drawerIsOpen = false;
  accountMenuIsOpen = false;
  session: any;

  constructor(
    private dialog: MatDialog,
    private errorHandler: ErrorHandlerService,
    private supabase: SupabaseService,
    private snackBarService: SnackBarService,
    private cartService: CartService,
  ) {
    effect(() => {
      this.cartItemCount = this.cartService.cartItemCount();
    });
  }

  ngOnInit(): void {
    this.supabase.authStateChanged.pipe(
      takeUntil(this.destroy$),
      switchMap((authState: AuthState) => {
        this.session = this.supabase.getSession();
  
        if (authState === AuthState.SIGNED_IN || authState === AuthState.TOKEN_REFRESHED) {
          // Get the latest cart item count upon signing in
          return this.cartService.getCartItemCount().pipe(
            catchError((error) => {
              this.errorHandler.sendError(error);
              return of(null);
            })
          );
        } else if (authState === AuthState.SIGNED_OUT) {
            this.snackBarService.show("👋 Goodbye and have a nice day.");
        }

        return of(null);
      })
    ).subscribe();

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
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onButtonClick(button: string, isMobile = false) {
    if (isMobile) this.drawerIsOpen = !this.drawerIsOpen;
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

  isLoggedIn() {
    return !!this.supabase.getSession();
  }
}