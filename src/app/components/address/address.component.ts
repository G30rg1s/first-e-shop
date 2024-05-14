import { Component, EventEmitter, Output } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field' ;
import {MatInputModule} from '@angular/material/input' ;
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReviewWindowComponent } from '../review-window/review-window.component';
import { FormsModule } from '@angular/forms';
import{User} from 'src/app/shared/interfaces/user';
import { AddressReviewComponent } from '../address-review/address-review.component';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule,ReviewWindowComponent],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {
 


  
  form = new FormGroup({
    city: new FormControl('',Validators.required),
    area: new FormControl('',Validators.required),
    code: new FormControl('',Validators.required),
    road: new FormControl('',Validators.required, ),
    number: new FormControl('',Validators.required),
    floor: new FormControl('',Validators.required),
    bell: new FormControl('',[Validators.required]),
    specifications : new FormControl('')
  });

  constructor(public dialog: MatDialog) {}


  openDialogWindow(): void {
    const dialogRef = this.dialog.open(AddressReviewComponent, {
      width: '400px',
      data: { 
        city: this.form.get('city').value,
        area: this.form.get('area').value,
        code: this.form.get('code').value,
        road: this.form.get('road').value,
        number: this.form.get('number').value,
        floor: this.form.get('floor').value,
        bell: this.form.get('bell').value,
        specifications : this.form.get('specifications').value
      }
    });
  }

 


}
