import { Component, inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field' ;
import {MatInputModule} from '@angular/material/input' ;
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReviewWindowComponent } from '../review-window/review-window.component';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { User, Address } from 'src/app/shared/interfaces/user';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule, CommonModule, NgIf],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css'
})
export class SignupFormComponent {

  form = new FormGroup({
    firstname: new FormControl('',Validators.required),
    lastname: new FormControl('',Validators.required),
    phonenumber: new FormControl('',[Validators.required, Validators.pattern('^69\\d{8}$') ]),
    email: new FormControl('',[Validators.required, Validators.pattern('[a-zA-Z0-9\.\-]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}')]),
    address:  new FormArray([
      new FormGroup({
        key: new FormControl(''),
        city: new FormControl('', Validators.required),
        area: new FormControl('', Validators.required),
        code: new FormControl('', Validators.required),
        road: new FormControl('', Validators.required),
        number: new FormControl('', Validators.required),
        floor: new FormControl('', Validators.required),
        bell: new FormControl('', Validators.required),
        specifications: new FormControl('(ΣΧΟΛΙΑ)', Validators.required),

      }),
    ]),
    username: new FormControl('',Validators.required),
    password: new FormControl('',[Validators.required]),// Validators.pattern('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&])[A-Za-z\d@$%*?&]{8,}$/') ])
   
});

  constructor(public dialog: MatDialog) {}

 

   openDialogWindow(): void {

    const addressFormArray = this.form.get('address') as FormArray;
    const addressFormGroup = addressFormArray.at(0) as FormGroup;

    const dialogRef = this.dialog.open(ReviewWindowComponent, {
      width: '400px',
      data: { 
        firstname: this.form.get('firstname').value,
        lastname: this.form.get('lastname').value,
        phonenumber: this.form.get('phonenumber').value,
        email: this.form.get('email').value,
        address: addressFormGroup.value,
      
        username: this.form.get('username').value,
        password: this.form.get('password').value
      }
    });
  }

  address = this.form.get('address') as FormArray;

   addAddress() {
    this.address.push(
      new FormGroup({
          city: new FormControl('', Validators.required),
          area: new FormControl('', Validators.required),
          code: new FormControl('', Validators.required),
          road: new FormControl('', Validators.required),
          number: new FormControl('', Validators.required),
          floor: new FormControl('', Validators.required),
          bell: new FormControl('', Validators.required),
          specifications: new FormControl('ΣΧΟΛΙΑ', ),
         })
 ) }

  userService = inject(UserService);

  registrationStatus: { success: boolean; message: string } = {
    success: false,
    message: 'Not attempted yet',
  };

  assignUniqueKeys(addresses: any[]): void {
    addresses.forEach(address => {
      address.key = Date.now().toString(); // Assign a unique key to each address
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

   const addresses = this.form.get('address').value;
  this.assignUniqueKeys(addresses);
  this.form.get('address').setValue(addresses);
  console.log('Addresses with assigned keys:', addresses);

    this.checkDuplicateEmailAndUsername()
      .then(() => {
        const user = this.form.value as User;
        this.userService.registerUser(user).subscribe({
          next: (response) => {
            console.log('User registered', response.msg);
            this.registrationStatus = { success: true, message: response.msg };
          },
          error: (response) => {
            const message = response.error.msg;
            console.log('Error registering user', message);
            this.registrationStatus = { success: false, message };
          },
        });
      })
      .catch((error) => {
        console.log('Duplicate check failed', error);
      });
  }

checkDuplicateEmailAndUsername(): Promise<void> {
    return new Promise((resolve, reject) => {
      const email = this.form.get('email').value;
      const username = this.form.get('username').value;

      this.userService.check_duplicate_email(email).subscribe({
        next: () => {
          this.form.get('email').setErrors(null);
          this.userService.check_duplicate_username(username).subscribe({
            next: () => {
              this.form.get('username').setErrors(null);
              resolve();
            },
            error: (response) => {
              const message = 'Το username χρησιμοποιείται';
              console.log('Duplicate username', message);
              this.form.get('username').setErrors({ duplicateUsername: true });
              reject(message);
            },
          });
        },
        error: (response) => {
          const message = 'Το email χρησιμοποιείται';
          console.log('Duplicate email', message);
          this.form.get('email').setErrors({ duplicateEmail: true });
          reject(message);
        },
      });
    });
  }

  
 

 /**  onSubmit(value: any) {
    console.log(value);

    const user = this.form.value  as User;
   
    this.userService.registerUser(user).subscribe({
      next: (response) => {
        console.log('User registered', response.msg);
        this.registrationStatus = { success: true, message: response.msg };
      },
      error: (response) => {
        const message = response.error.msg;
        console.log('Error registering user', message);
        this.registrationStatus = { success: false, message };
      },
    });
  }

  registerAnotherUser() {
    this.form.reset();
    this.registrationStatus = { success: false, message: 'Not attempted yet' };
  }

  check_duplicate_email() {
    const email = this.form.get('email').value;

    this.userService.check_duplicate_email(email).subscribe({
      next: (response) => {
        console.log(response.msg);
        this.form.get('email').setErrors(null);
      },
      error: (response) => {
        const message = response.error.msg;
        console.log(message);
        this.form.get('email').setErrors({ duplicateEmail: true });
      },
    });
  }


  check_duplicate_username() {
    const username = this.form.get('username').value;

    this.userService.check_duplicate_username(username).subscribe({
      next: (response) => {
        console.log(response.msg);
        this.form.get('username').setErrors(null);
      },
      error: (response) => {
        const message = response.error.msg;
        console.log(message);
        this.form.get('username').setErrors({ duplicateUsername: true });
      },
    });
  }*/


  isCheckClicked = false;

  onCheck() {
    // Perform the necessary checks here
    this.isCheckClicked = true;
  }

  handleSubmit() {
    this.openDialogWindow();
    this.onCheck();
  }
}
