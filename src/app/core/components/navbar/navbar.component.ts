import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


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
  cartItems = 0;
  isOpen = false;
  isAuthenticated: any;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    
  }

  openDialog(dialog: string) {
    switch (dialog) {
      case 'login':

    }
  }
}
