import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CartItem } from '../../cart/shared/cart-item.model';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../cart/shared/cart.service';
import { Router } from '@angular/router';
import { CheckoutService } from '../shared/checkout.service';
import { AccountService } from '../../account/shared/account.service';
import { Address } from '../../account/shared/address.model';
import { expiryDateValidator } from 'src/app/core/helpers/common-helper';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, OnDestroy {
  expiryDateValidator = expiryDateValidator;

  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  addresses: Address[] = [];

  isLoading = true;
  failedLoading = false;

  selectedUserAddressId: number = 0;
  
  private readonly destroy$ = new Subject<void>();

  constructor(
    private errorHandler: ErrorHandlerService,
    private snackBarService: SnackBarService,
    private fb: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
  ) {
    this.checkoutForm = this.fb.group({
      card_holder_name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]],
      expiry_date: ['', [Validators.required, expiryDateValidator()]], //
      card_number: ['', [Validators.required, Validators.minLength(19), Validators.maxLength(19)]],
      user_address_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.getCartItems().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.cartItems = res;

        if (this.cartItems.length == 0) {
          this.router.navigate(['cart']);
          this.errorHandler.sendError("You cannot checkout with an empty cart!");
        }
      },
      error: (error) => {
        this.router.navigate(['cart']);
        this.errorHandler.sendError("Something went wrong! Please try again later.");
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  total(): number {
    let total = 0;
    this.cartItems.forEach((item) => {
      total += item.quantity * item.products.price;
    });

    return total;
  }

  onAddressSelection(selectedAddressId: number): void {
    if (selectedAddressId) {
      this.checkoutForm.patchValue({
        user_address_id: selectedAddressId
      });
    } else {
      this.checkoutForm.patchValue({
        user_address_id: null
      });
    }
  }

  makePayment() {
    this.checkoutService.checkout({
      input_data: {
        ...this.checkoutForm.value,
        card_number: this.checkoutForm.value.card_number?.replace(/\s+/g, '')
      }
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.router.navigate(['/account/profile']);
        this.snackBarService.show("Your purchase was successful. We will process your order within 24 hours.");
      },
      error: (error) => {
        this.router.navigate(['/']);
        this.errorHandler.sendError(error);
      }
    });
  }
}
