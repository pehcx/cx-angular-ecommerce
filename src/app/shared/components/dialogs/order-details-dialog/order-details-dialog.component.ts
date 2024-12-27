import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from 'src/app/features/account/shared/order.model';
import { getImagePath } from 'src/app/core/helpers/common-helper';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.scss']
})

export class OrderDetailsDialogComponent implements OnInit {
  getImagePath = getImagePath;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      order: Order
    },
    private dialogRef: MatDialogRef<OrderDetailsDialogComponent>,
  ) { }

  ngOnInit(): void {
    this.data.order.order_items.sort((a, b) => a.id - b.id);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
