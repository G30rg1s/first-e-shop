import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserData, AdminReadUsers } from 'src/app/shared/interfaces/user';
import { Logs } from 'src/app/shared/interfaces/logs';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription, catchError, throwError } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { sortBy } from 'lodash-es';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/interfaces/product';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-boss-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './boss-page.component.html',
  styleUrl: './boss-page.component.css'
})
export class BossPageComponent implements OnInit, OnDestroy {
  userData: UserData | undefined;
  userDetailsSubscription: Subscription | undefined;
  users: AdminReadUsers[] = [];
  filteredUsers: AdminReadUsers[] = [];
  filteredlogs: Logs[] = [];
  adminReadUsersSubscription: Subscription | undefined;
  selectUpdateUser : any;
  bossReadLogs: Subscription | undefined;
  logs: Logs[] = [];
  searchQuery: string = '';
  logQuery: string = '';
 
  showButtons: boolean;
  updateUsersVisible: boolean = false;
  showUsers : boolean = false;
  logsvisible:boolean=false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private productService:ProductService) {}

  showlogs(){
    this.getLogs(); 
    this.showButtons=false;
    this.logsvisible=true;
}

closelogs(){
  this.showButtons=true;
  this.logsvisible=false;
}
 


  openUpdate(user:any): void{
    this.updateUserForm.patchValue({
      username: user.username,
  });
    this.selectUpdateUser = user;
    this.updateUsersVisible = true;
    this.showUsers = false;
    
  }

  closeUpdate(user:any): void{
    this.selectUpdateUser = null;
    this.updateUsersVisible = false;
    this.showUsers=true;
   
  }

  closeUsers(){
    this.showButtons=true;
    this.showUsers=false;
  }

  showAllUsers() {
    this.getAdminReadUsers();
    this.showButtons=false;
    this.showUsers=true;
  }

 

  ngOnInit(): void {
      
    this.showButtons=true;
    
    
   


    const token = localStorage.getItem('access_token');
    if (token) {
      this.getUserDetails(token);
      
    } else {
      console.error('JWT token not found in local storage');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private unsubscribe(): void {
    if (this.userDetailsSubscription) {
      this.userDetailsSubscription.unsubscribe();
    }
    
  }

  logout() {
    this.userService.logoutUser();
  }

 

  

  private getUserDetails(token: string): void {
    this.userDetailsSubscription = this.userService.getMyDetails(token)
      .pipe(
        catchError(error => {
          console.error('Error fetching user details:', error);
          return throwError(error);
        })
      )
      .subscribe(
        (userData: UserData) => {
          this.userData = userData;
          console.log('User details:', this.userData);
        }
      );
  }

  private getAdminReadUsers(): void {
    this.adminReadUsersSubscription = this.userService.getUsers()
      .pipe(
        catchError(error => {
          console.error('Error fetching users:', error);
         
          return throwError(error);
        })
      )
      .subscribe(
        (adminReadUsers: AdminReadUsers[]) => {
          this.users = adminReadUsers;
          console.log('Users:', this.users);
        }
      );
  }


  sortOrder = {
    firstname: 'none',
    lastname: 'none',
    email: 'none',
    phonenumber: 'none',
    roles_string: 'none'
  };

  sortData(sortKey: string) {
    if (this.sortOrder[sortKey] === 'asc') {
      this.sortOrder[sortKey] = 'desc';
      this.users = sortBy(this.users, sortKey).reverse();
    } else {
      this.sortOrder[sortKey] = 'asc';
      this.users = sortBy(this.users, sortKey);
    }

    for (const key in this.sortOrder) {
      if (key !== sortKey) {
        this.sortOrder[key] = 'none';
      }
    }
  }

  sortSign(sortKey: string): string {
    if (this.sortOrder[sortKey] === 'asc') {
      return '↑';
    } else if (this.sortOrder[sortKey] === 'desc') {
      return '↓';
    } else {
      return '';
    }
  }


  getRole(rolesString: string): string {
    switch (rolesString) {
      case 'truefalsefalse':
        return 'user';
      case 'truetruefalse':
        return 'admin';
      case 'truetruetrue':
        return 'boss';
      default:
        return 'unknown';
    }
  }

  


  searchUsers() {
    const query = this.searchQuery.trim().toLowerCase();
    console.log('Search query:', query); 
    if (query === '') {
      
      this.filteredUsers = this.users.slice(); 
    } else {
      
      this.filteredUsers = this.users.filter(user =>
        user.firstname.toLowerCase().includes(query) ||
        user.lastname.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phonenumber && user.phonenumber.toString().includes(query)) ||
        this.getRole(user.roles_string).toLowerCase().includes(query) 
      );
    }
  
    console.log('Filtered users:', this.filteredUsers); 
  }


  searchlogs() {
    const query = this.logQuery.trim().toLowerCase();
    if (query === '') {
      this.filteredlogs = this.logs.slice(); 
    } else {
      this.filteredlogs = this.logs.filter(log =>
       
        log.user.toLowerCase().includes(query) ||
        log.name.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) 
        
      );
    }
  }

  updateUserForm= this.formBuilder.group({
    username:[''],
    role: ['',],  
  
  })

  OpositegetRole(OpositerolesString: string): string {
    switch (OpositerolesString) {
      case 'user':
        return 'truefalsefalse';
      case 'admin':
        return 'truetruefalse';
      case 'boss':
        return 'truetruetrue';
      default:
        return 'unknown';
    }
  }



  updaterole(user: any) {
    const { username, role } = this.updateUserForm.value;
    const myrole = role  ? role : user.role; 
    
  this.userService.updateRole(username, this.OpositegetRole(role)).subscribe({
      next: (response) => {
        console.log('user updated successfully:', response);
       
        window.location.reload();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        if (error.status === 404) {
          console.error('User not found.');
        } else {
          console.error('An error occurred while updating the user.');
        }
      }
    });
  }


  getLogs(): void {
    this.bossReadLogs=this.productService.getlogs()
      .pipe(
        catchError(error => {
          console.error('Error fetching logs:', error);
          return throwError(error);
        })
      )
      .subscribe(
        (logs: Logs[]) => {
          this.logs = logs;
          console.log('LOGS:', this.logs);
        }
      );
  }

  formatDate(timestamp: Date | string | { $date: number }): string {
    if (!timestamp) {
      return ''; 
    }
  
    let date: Date;
    if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if ('$date' in timestamp) {
      date = new Date(timestamp.$date);
    } else {
      date = timestamp;
    }
  
    if (isNaN(date.getTime())) {
      return ''; 
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Europe/Athens' 
    };
    return date.toLocaleString('en-US', options);
  }
  
}
