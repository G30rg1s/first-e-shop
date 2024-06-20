import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Address, Credentials, LoggedInUser, User, UserData, AdminReadUsers } from '../interfaces/user';
import { Router } from '@angular/router';
import {jwtDecode } from 'jwt-decode';
import { Observable, catchError, throwError } from 'rxjs';

const API_URL = `${environment.apiURL}/user`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  user = signal<LoggedInUser | null>(null);

  constructor() {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      const decodedTokenSubject = jwtDecode(access_token)
        .sub as unknown as LoggedInUser;
      this.user.set({
        fullname: decodedTokenSubject.fullname,
        username: decodedTokenSubject.username,
        roles: decodedTokenSubject.roles
      });
    }

    effect(() => {
      if (this.user()) {
        console.log('USer loggedin', this.user().fullname);
      } else {
        console.log('No user Logged In');
      }
    });
  }

  
  getUser(): LoggedInUser | null {
    return this.user();
  }

  getUserRoles(): string | null {
    const loggedInUser = this.user();
    return loggedInUser ? loggedInUser.roles : null;
  }

  

  getUserusername(): string | null {
    const loggedInUser = this.user();
    return loggedInUser ? loggedInUser.username : null;
  }

  registerUser(user: User) {
    return this.http.post<{ msg: string }>(`${API_URL}/register`, user);
  }

  check_duplicate_email(email: string) {
    return this.http.get<{ msg: string }>(
      `${API_URL}/check_duplicate_email/${email}`,
    );
  }

  check_duplicate_username(username: string) {
    return this.http.get<{ msg: string }>(
      `${API_URL}/check_duplicate_username/${username}`,
    );
  }

  loginUser(credentials: Credentials) {
    return this.http.post<{ access_token: string }>(
      `${API_URL}/login`,
      credentials,
    );
  }

  logoutUser() {
    this.user.set(null);
    localStorage.removeItem('access_token');
    this.router.navigate(['login-form']);
  }

  decodeJwtToken(token: string): any {
    try {
      const decodedToken = jwtDecode(token);
      console.log('Decoded token:', decodedToken); 
      return decodedToken;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  getMyDetails(token: string): Observable<any> {
    const decodedToken = this.decodeJwtToken(token);
    const sub = decodedToken ? decodedToken.sub : null;
    const username = sub ? sub.username : null;
    console.log('--------username-------:', username);
    if (!username) {
      console.error('Username not found in JWT token');
      return null;
    }
  
    const url = `${API_URL}/myprofile/${username}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<any>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user details:', error);
        throw error;
      })
    );
  }

  addAddress(address: Address): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return throwError('JWT token not found');
    }
    const decodedToken = this.decodeJwtToken(token);
    const username = decodedToken ? decodedToken.sub.username : null;
    if (!username) {
      console.error('Username not found in JWT token');
      return throwError('Username not found in JWT token');
    }
    console.log('Address data:', address);
    const url = `${API_URL}/add_address/${username}`; 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post<any>(url, address, { headers }).pipe(
      catchError(error => {
        console.error('Error adding address:', error);
        throw error;
      })
    );
  }


  deleteAddress(address: Address): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return throwError('JWT token not found');
    }
    
    const decodedToken = this.decodeJwtToken(token);
    const username = decodedToken ? decodedToken.sub.username : null;
    if (!username) {
      console.error('Username not found in JWT token');
      return throwError('Username not found in JWT token');
    }
    
    console.log('Address data:', address);
    const url = `${API_URL}/delete_address/${username}/${address.key}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
  return this.http.delete<any>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting address:', error);
        throw error;
      })
    );
  }

  updateAddress( key: string , bell : string , specifications : string): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return throwError('JWT token not found');
    }
    
    const decodedToken = this.decodeJwtToken(token);
    const username = decodedToken ? decodedToken.sub.username : null;
    if (!username) {
      console.error('Username not found in JWT token');
      return throwError('Username not found in JWT token');
    }

    const url = `${API_URL}/update_address/${username}/${key}/${bell}/${specifications}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.patch<any>(url,{ headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }


  getUsers(): Observable<AdminReadUsers[]> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return throwError('JWT token not found');
    }
    const url = `${API_URL}/users`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<AdminReadUsers[]>(url, { headers })
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            
          }
          console.error('Error fetching users:', error);
          return throwError(error);
        })
      );
  }


  updateRole(username: string, role1 : string): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return throwError('JWT token not found');
    }
    console.log('the role is :', role1);
    console.log('the username is :', username);
    
    const url = `${API_URL}/update_role/${role1}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { username};
    
    return this.http.patch<any>(url, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }


}
  
  

  

    


 


  

 
  


