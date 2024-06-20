import { Injectable } from '@angular/core';
import{UserNum} from '../interfaces/user';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NumService {
  private numKey = 'num'; 

  constructor() {}

  getNum(): number {
    return +localStorage.getItem(this.numKey) || 0; 
  }

  setNum(value: number): void {
    localStorage.setItem(this.numKey, value.toString()); 
  }


  
}



 /**private users: UserNum[] = []; // Store users in memory

  constructor() {}

  saveUserDetails(username: string): observable<any> {
    const newUser: UserNum = { username: username, num: 0 }; 
    this.users.push(newUser);
    return newUser;
  }

  getNum(username: string): number {
    let user = this.users.find(u => u.username === username);
    if (!user) {
     
      let neeuser = this.saveUserDetails(username);
        
          return newuser.num 
        })
      );
    } else {
      return user.num; 
    }
  }

  setNum(username: string, num: number): Observable<string> {
    const user = this.users.find(u => u.username === username);
    if (user) {
      user.num = num; // Update num for existing user
      return of('User number updated successfully'); 
    } else {
      return of('User not found or invalid username');
    }
  }*/
 
