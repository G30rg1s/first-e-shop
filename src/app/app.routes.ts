import { Routes } from '@angular/router';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';

export const routes: Routes = [
    { path: '', component: LoginFormComponent },
    {path:'signup-form' , component:SignupFormComponent}
];
