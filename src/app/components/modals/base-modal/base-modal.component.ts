import { Component, TemplateRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.scss']
})
export class BaseModalComponent {
  title: string = '';
  content: TemplateRef<any>

  constructor(
    public dialogRef: MatDialogRef<BaseModalComponent>
  ) { }

  closeDialog() {
    this.dialogRef.close();
  }
}
