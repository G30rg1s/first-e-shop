import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TempboxService {
  private boxKey = 'box_key'; 
  

  constructor() {}

  getBoxKey(): string {
    return localStorage.getItem(this.boxKey) || '';
  }

  setBoxKey(value: string): void {
    localStorage.setItem(this.boxKey, value);
  }

  

  
}
