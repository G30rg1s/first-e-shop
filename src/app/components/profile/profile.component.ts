import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, inject  } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { User, LoggedInUser, UserData, MySimpleAddress, Address } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ],  
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  simpleAddress : MySimpleAddress[]
  userData: UserData;
  userDetailsSubscription: Subscription;
  selectedAddress: any; 
  selectUpdateAddress : any;
  updateAddressVisible: boolean =  false ;
  fullAddressVisible: boolean = false;
  simpleAddressVisible: boolean ;
  addressFormVisible: boolean = false;
  personaldataVisible : boolean;
  emptyDtaVisible : boolean ;

  constructor(private userService: UserService,  private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    
    this.simpleAddressVisible = true;
    this.personaldataVisible = true;
    this.emptyDtaVisible = true ;

    const token = localStorage.getItem('access_token');
    if (token) {
     
      this.userDetailsSubscription = this.userService.getMyDetails(token).subscribe(
        (userData: UserData) => {
          this.userData = userData;
          console.log('User details:', this.userData);
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('JWT token not found in local storage');
    }
  }

  ngOnDestroy(): void {
    
    if (this.userDetailsSubscription) {
      this.userDetailsSubscription.unsubscribe();
    }
  }
  showFullAddress(address: any): void {
    this.selectedAddress = address;
    this.fullAddressVisible = true;
    this.simpleAddressVisible = false;
    this.personaldataVisible =false;
    this.emptyDtaVisible = false ;
  }

  closeFullAddress(address: any): void {
    this.selectedAddress = null;
    this.fullAddressVisible = false;
    this.simpleAddressVisible = true;
    this.personaldataVisible = true;
    this.emptyDtaVisible = true;
  }

  toggleAddressFormVisibility(): void {
    this.addressFormVisible = true;
    this.simpleAddressVisible = false;
  this.personaldataVisible =false;
  this.emptyDtaVisible = false ;
  }

  closeAddAddress(): void{
    this.addressFormVisible = false;
    this.simpleAddressVisible = true;
    this.personaldataVisible =true;
    this.emptyDtaVisible = true ;
  }

  openUpdate(address:any): void{
    this.updateAddressForm.patchValue({
      key: address.key,
  });
    this.selectUpdateAddress = address;
    this.updateAddressVisible = true;
    this.simpleAddressVisible = false;
    this.personaldataVisible =false;
    this.emptyDtaVisible = false ;
  }

  closeUpdate(address:any): void{
    this.selectUpdateAddress = null;
    this.updateAddressVisible = false;
    this.simpleAddressVisible = true;
    this.personaldataVisible =true;
    this.emptyDtaVisible = true ;
  }



  updateAddressForm= this.formBuilder.group({
    key:[''],
    bell: ['', ],
    specifications: ['', ]
  })

  handleUpdate(address: any) {
    const { key, bell, specifications } = this.updateAddressForm.value;
    let mybell = bell ? bell : address.bell;
    let myspecifications = specifications ? specifications : address.specifications;
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return;
    }
  this.userService.updateAddress(key, mybell, myspecifications).subscribe({
      next: (response) => {
        console.log('Address updated successfully:', response);
       
        window.location.reload();
      },
      error: (error) => {
        console.error('Error updating address:', error);
        if (error.status === 404) {
          console.error('User not found.');
        } else {
          console.error('An error occurred while updating the address.');
        }
      }
    });
  }
  
    
 handleDelete(event: Event, address: any) {    
    event.stopPropagation();
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return; 
    }
    const { key } = address.key;
    this.userService.deleteAddress(address).subscribe({
      next: (response) => {
        console.log('Address deleted successfully:', response);
        window.location.reload();
        
      },
      error: (error) => {
        console.error('Error deleting address:', error);
        if (error.status === 404) {
          console.error('User not found.');
        } else {
          console.error('An error occurred while deleting the address.');
        }
      }
    });
  }

   addressForm = this.formBuilder.group({
      key: ['',], 
      city: ['', Validators.required],
      area: ['', Validators.required],
      code: ['', Validators.required],
      road: ['', Validators.required],
      number: ['', Validators.required],
      floor: ['', Validators.required],
      bell: ['', Validators.required],
      specifications: ['(ΣΧΟΛΙΑ)', ]
    });

   

   
    assignUniqueKeys(address: any): void {
      address.key = Date.now().toString(); }

    addNewAddress() {
      const addressData = this.addressForm.value as Address; 
      this.assignUniqueKeys(addressData);
      const token = localStorage.getItem('access_token');
      console.log('addresData :', addressData);
      if (!token) {
        console.error('JWT token not found in local storage');
        return; 
      }
     this.userService.addAddress(addressData).subscribe({
      next: (response) => {
      
          console.log('Address added successfully:', response);
          this.addressForm.reset();
         this.closeAddAddress();
         window.location.reload();
         error => {
          console.error('Error adding address:', error);
           if (error.status === 404) {
            console.error('User not found.');
          } else {
           console.error('An error occurred while adding the address.');
          }
        }
      }
    }
    );
    }

   
}

