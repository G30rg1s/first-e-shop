import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field' ;
import {MatInputModule} from '@angular/material/input' ;
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReviewWindowComponent } from '../review-window/review-window.component';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule,ReviewWindowComponent],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css'
})
export class SignupFormComponent {

  form = new FormGroup({
    firstname: new FormControl('',Validators.required),
    lastname: new FormControl('',Validators.required),
    phonenumber: new FormControl('',Validators.pattern('^69\\d{8}$')),
    email: new FormControl('',[Validators.required, Validators.pattern('[a-zA-Z0-9\.\-]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}')]),
    address: new FormControl('',Validators.required),
    username: new FormControl('',Validators.required),
    password: new FormControl('',[Validators.required, Validators.pattern('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&])[A-Za-z\d@$%*?&]{8,}$/')])
  });

  constructor(public dialog: MatDialog) {}


  openDialogWindow(): void {
    const dialogRef = this.dialog.open(ReviewWindowComponent, {
      width: '400px',
      data: { // Pass the form data here
        firstname: this.form.get('firstname').value,
        lastname: this.form.get('lastname').value,
        phonenumber: this.form.get('phonenumber').value,
        email: this.form.get('email').value,
        address: this.form.get('address').value,
        username: this.form.get('username').value,
        password: this.form.get('password').value
      }
    });
  }
}
