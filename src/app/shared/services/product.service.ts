import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Address, Credentials, LoggedInUser, User, UserData, AdminReadUsers } from '../interfaces/user';
import { Product } from '../interfaces/product';
import { Router } from '@angular/router';
import {jwtDecode } from 'jwt-decode';
import { Observable, catchError, throwError } from 'rxjs';

const API_URL = `${environment.apiURL}/product`;

@Injectable({
  providedIn: 'root'
})
export class ProductService {
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

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  getUser(): LoggedInUser | null {
    return this.user();
  }

  getUserRoles(): string | null {
    const loggedInUser = this.user();
    return loggedInUser ? loggedInUser.roles : null;
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

  registerProduct(product: Product): Observable<any> {
    const token = localStorage.getItem('access_token');
    const url = `${API_URL}/add_product`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post<{ msg: string }>(url, product, {headers});
  }


  getProducts(): Observable<Product[]> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return throwError('JWT token not found');
    }
    const url = `${API_URL}/allproducts`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<Product[]>(url, { headers })
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            
          }
          console.error('Error fetching products:', error);
          return throwError(error);
        })
      );
  }



  updateProduct(key: string, price: number, amount: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return throwError('JWT token not found');
    }
    
    const url = `${API_URL}/update_product/${key}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { price, amount };
    
    return this.http.patch<any>(url, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteProduct(product: Product): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return throwError('JWT token not found');
    }
    
    const url = `${API_URL}/delete_product/${product.key}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
  return this.http.delete<any>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting address:', error);
        throw error;
      })
    );
  }

  
}
  


