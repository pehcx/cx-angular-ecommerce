import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/app/features/account/shared/account.service';
import { catchError, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { Address } from 'src/app/features/account/shared/address.model';
import { MatDialog } from '@angular/material/dialog';
import { AddressDialogComponent } from '../dialogs/address-dialog/address-dialog.component';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})

export class AddressListComponent implements OnInit, OnDestroy {
  @Input() selectable: boolean = false;
  @Output() selection: EventEmitter<number> = new EventEmitter<number>();

  selectedUserAddressId: number = 0;

  private readonly destroy$ = new Subject<void>;

  isLoadingAddresses = false;
  loadAddressesFailed = false;

  addresses: Address[] = [];

  constructor(
    private accountService: AccountService,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.loadAddresses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAddresses() {
    this.loadAddressesFailed = false;
    this.isLoadingAddresses = true;

    this.accountService.getUserAddresses().pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        console.log(error);
        this.errorHandler.sendError("Failed to load addresses. Please try again later");
        this.loadAddressesFailed = true;
        return of([]);
      })
    ).subscribe((addresses) => {
      this.isLoadingAddresses = false;
      this.addresses = addresses;

      if (this.selectable) {
        if (this.selectedUserAddressId !== 0) {
          const checkSelection = this.addresses.find(address => address.id === this.selectedUserAddressId);
          if (!checkSelection) {
            this.selectedUserAddressId = 0;
            this.outputSelectedUserAddressId();
          }
        } else if (this.addresses.length > 0) {
          // Auto select the first one if none is selected
          this.selectedUserAddressId = this.addresses[0].id;
          this.outputSelectedUserAddressId();
        }
      }
    });
  }

  addNewAddress() {
    if (this.addresses.length < 3) {
    const dialogRef = this.dialog.open(AddressDialogComponent, { data: {
      mode: 'new'
    }});

      dialogRef.afterClosed().pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.loadAddresses();
      });
    }
  }

  onModifyAddress(id: any, mode: 'edit' | 'delete') {
    const address = this.addresses.find(add => add.id === id);
    
    if (!address) {
      this.errorHandler.sendError('Something went wrong!');
      return;
    }

    if (mode == 'edit') {
      const dialogRef = this.dialog.open(AddressDialogComponent, { data: {
        address: address,
        mode: mode
      }});

      dialogRef.afterClosed().pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.loadAddresses();
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Are you sure?',
          message: 'Do you really want to delete this address?',
          buttonText: 'Delete'
        }
      });

      dialogRef.afterClosed().pipe(
        takeUntil(this.destroy$),
        switchMap((confirmed) => {
          if (confirmed) {
            return this.accountService.deleteAddress(address).pipe(
              tap(() => {
                this.snackBarService.show('Deleted successfully.');
                this.loadAddresses();
              })
            );
          } else {
            this.loadAddresses();
            return [];
          }
        })
      ).subscribe();
    }
  }

  /* #region Selection (for checkout) */
  outputSelectedUserAddressId() {
    this.selection.emit(this.selectedUserAddressId);
  }

  onAddressSelect(addressId: number): void {
    this.selectedUserAddressId = addressId;
    this.outputSelectedUserAddressId();
  }
  /* #endregion */
}
