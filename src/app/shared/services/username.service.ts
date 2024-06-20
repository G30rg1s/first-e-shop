import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {
  private curentuser = 'localuser'; 
  

  constructor() {}

  getusername(): string {
    return localStorage.getItem(this.curentuser) || '';
  }

  setusername(value: string): void {
    localStorage.setItem(this.curentuser, value);
  }

  
}
