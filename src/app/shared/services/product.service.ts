import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Address, Credentials, LoggedInUser, User, UserData, AdminReadUsers } from '../interfaces/user';
import { Product } from '../interfaces/product';
import { Router } from '@angular/router';
import {jwtDecode } from 'jwt-decode';
import { Observable, catchError, throwError } from 'rxjs';
import { Logs } from 'src/app/shared/interfaces/logs';
import { Box, ProductBuy } from '../interfaces/box';


const API_URL = `${environment.apiURL}/product`;
const API_URL_LOGS =  `${environment.apiURL}/logs`;
const API_URL_BOX = `${environment.apiURL}/purchase`;

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
          console.error('Error fetching logs:', error);
          return throwError(error);
        })
      );
  }

  getlogs(): Observable<Logs[]> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return throwError('JWT token not found');
    }
    const url = `${API_URL_LOGS}/bossgetlogs`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<Logs[]>(url, { headers })
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            
          }
          console.error('Error fetching logs:', error);
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


  massiveDeleteProducts(category: string, subcategory: string, brand: string): Observable<any> {
    console.log('dlt', category, subcategory,brand);
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return throwError('JWT token not found');
    }
    
    const url = `${API_URL}/massive_delete_products/${category}/${subcategory}/${brand}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   
    
    return this.http.delete<any>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  

  registerbox(boxkey: string, username: string, productkey: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const url = `${API_URL_BOX}/add_purchase`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const fullname = this.decodeJwtToken(token).sub.fullname;
    
    const body = {boxkey, username,fullname, productkey };
    
    return this.http.post<{ msg: string }>(url, body, {headers});
  }


  addmoretobox(boxkey: string, username: string, productkey: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const url = `${API_URL_BOX}/add_more`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   

    const body = {boxkey, username, productkey };
    
    return this.http.post<{ msg: string }>(url, body, {headers});
  }


  tempBox(username: string): Observable<any>{
    const token = localStorage.getItem('access_token');
    const url = `${API_URL_BOX}/user_tempbox/${username}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<{ msg: string, purchases?: any[] }>(url, { headers });
  }

  deliveryPending(): Observable<any>{
    const token = localStorage.getItem('access_token');
    const url = `${API_URL_BOX}/delivery_pending`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<{ msg: string, purchases?: any[] }>(url, { headers });
  }

  adminFinishDelivery(boxkey: string): Observable<{ msg: string, purchases?: any[] }> {
    const token = localStorage.getItem('access_token');
    const url = `${API_URL_BOX}/finish_delivery/${boxkey}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.patch<{ msg: string, purchases?: any[] }>(url, {}, { headers });
  }

  detailedPastBox(username: string, boxkey: string): Observable<any>{
    const token = localStorage.getItem('access_token');
    const url = `${API_URL_BOX}/detailed_pastbox/${username}/${boxkey}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<{ msg: string, purchases?: any[] }>(url, { headers });
  }


  pastBoxes(username: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const url = `${API_URL_BOX}/user_pasttempboxes/${username}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<{ msg: string, purchases?: any[] }>(url, { headers });
  }



  checkoutservice(boxkey: string, username: string, deliveryaddress : Address, products: ProductBuy[]): Observable<{ msg: string, purchases?: any[] }> {
    console.log('proserv', products);
    console.log('deliveryto', deliveryaddress);
    const token = localStorage.getItem('access_token');
    const url = `${API_URL_BOX}/checkout_box/${boxkey}/${username}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {deliveryaddress, products };  // Include products in the body
  
    return this.http.patch<{ msg: string, purchases?: any[] }>(url, body, { headers });
  }



  Deletetempbox(boxkey: string , username: string): Observable<any> {
    console.log('deletebox', boxkey, username);
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return throwError('JWT token not found');
    }
    
    const url = `${API_URL_BOX}/delete_tempbox/${boxkey}/${username}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   
    
    return this.http.delete<any>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );

  }

  DeleteProductFromTempbox(boxkey: string, username: string, productkey: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const url = `${API_URL_BOX}/delete_tempbox_product/${boxkey}/${username}/${productkey}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<{ msg: string }>(url,{headers});
  }
  
  
}
  


