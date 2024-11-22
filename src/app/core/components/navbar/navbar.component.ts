import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SupabaseService } from '../../services/supabase.service';
import { Subscription } from 'rxjs';
import { AuthState } from '../../enums/auth-state';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
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
        transform: 'translateY(0)'
      })),
      state('isClosed', style({
         transform: 'translateY(-100px)'
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
  session: any = null;
  user: any;

  constructor(
    private dialog: MatDialog,
    private supabase: SupabaseService,
  ) {
    this.session = this.supabase.getSession();
    this.user = this.supabase.getUser();
  }

  ngOnInit(): void {
    this.authSubscription = this.supabase.authStateChanged.subscribe((authState: AuthState) => {
      if (authState === AuthState.SIGNED_OUT) {
        
      }
    })
  }

  onButtonClick(button: string) {
    if (button === 'login') {
      
    } else if (button === 'logout') {

    }
  }

  isLoggedIn() {
    return !!this.supabase.getSession();
  }
}