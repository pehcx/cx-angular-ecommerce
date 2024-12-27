import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../../shared/account.service';
import { catchError, map, of, Subject, takeUntil } from 'rxjs';
import { Order } from '../../shared/order.model';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetailsDialogComponent } from 'src/app/shared/components/dialogs/order-details-dialog/order-details-dialog.component';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})

export class OrderHistoryComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  orders: Order[] = [];
  loading = true;
  failedLoading = false;

  constructor(
    private accountService: AccountService,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders() {
    this.loading = true;
    this.failedLoading = false;

    const params = {
      cols: `
        *,
        order_items(*, products(*)),
        deliveries(*, delivery_addresses(*))
      `,
    };

    this.accountService.getOrders(params).pipe(
      takeUntil(this.destroy$),
      map((orders: Order[]) => {
        return orders.map((order) => ({
          ...order,
          total: order.order_items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        }))
      }),
      catchError((error) => {
        this.failedLoading = true;
        this.errorHandler.sendError(error);
        return of([]);
      })
    ).subscribe((orders) => {
      this.loading = false;
      this.orders = orders;
    });
  }

  viewOrderDetails(order: Order) {
    this.dialog.open(OrderDetailsDialogComponent, {
      data: {
        order: order
      }
    });
  }
}