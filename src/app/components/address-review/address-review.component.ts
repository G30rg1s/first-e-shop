import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-address-review',
  standalone: true,
  imports: [],
  templateUrl: './address-review.component.html',
  styleUrl: './address-review.component.css'
})
export class AddressReviewComponent {
  

  constructor(
    public dialogRef: MatDialogRef<AddressReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
   
    this.dialogRef.close(true); // Close the dialog and return true to indicate confirmation
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close the dialog and return false to indicate cancellation
  }
 
  
}
