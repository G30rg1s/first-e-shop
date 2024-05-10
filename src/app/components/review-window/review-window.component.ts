import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-review-window',
  standalone: true,
  imports: [],
  templateUrl: './review-window.component.html',
  styleUrls: ['./review-window.component.css']
})
export class ReviewWindowComponent {
  constructor(
    public dialogRef: MatDialogRef<ReviewWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Close the dialog and return true to indicate confirmation
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close the dialog and return false to indicate cancellation
  }
}
