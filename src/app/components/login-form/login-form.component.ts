import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Credentials, LoggedInUser } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable, map } from 'rxjs';



@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [RouterLink,RouterLinkActive, RouterOutlet, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  

  userService = inject(UserService);
  router = inject(Router);

  invalidLogin = false;

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  convertToBoolean(value: any): boolean {
    return typeof value === 'string' ? value.toLowerCase() === 'true' : !!value;
  }

  /**firstEncrypt(text: string): string {
    let encryptedText = '';
    for (let i = 0; i < text.length; i++) {
      // Shift each character by 1 in the ASCII table
      encryptedText += String.fromCharCode(text.charCodeAt(i) + 1);
    }
    return encryptedText;
  }*/
 

  onSubmit() {
    const credentials = this.form.value as Credentials;
    this.userService.loginUser(credentials).subscribe({
      next: (response) => {
        const access_token = response.access_token;
        localStorage.setItem('access_token', access_token);
        const decodedTokenSubject = jwtDecode(access_token) 
          .sub as unknown as LoggedInUser;
         
          this.userService.user.set({
          fullname: decodedTokenSubject.fullname,
          username: decodedTokenSubject.username,
          roles: decodedTokenSubject.roles
        });

        
          const roles = decodedTokenSubject.roles;
          console.log('roles', roles, typeof roles);

          let string1 = 'truefalsefalse';
          let string2 = 'truetruefalse';
          let string3 = 'truetruetrue';
        
          let nextPage = '';

          /**console.log('roles:', roles.trim());
          console.log('string1:', string1, typeof string1);
          console.log('string2:', string2, typeof string2);
          console.log('string3:', string3, typeof string3);*/

          if (roles.trim() === string1) {
            nextPage = 'menu';
          } else if (roles.trim() === string2) {
            nextPage = 'admin-page';
          } else if (roles.trim() === string3) {
            nextPage = 'boss-page';
          } else {
            console.error('Unable to determine next page.');
          }

       //let nextPageEncrypted = this.firstEncrypt(nextPage)
          console.log('',nextPage)
          this.router.navigate(['define-role'], { queryParams: { nextPage: nextPage } });
          return nextPage;
        
      },
      error: (error) => {
        console.error('Login error:', error);
        this.invalidLogin = true;
      }
    });
    
  }
}
  

      

        
     




 
  

