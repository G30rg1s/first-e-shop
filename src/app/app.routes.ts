import { Routes } from '@angular/router';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', component: WelcomeComponent },
    {path:'login-form' , component:LoginFormComponent},
    {path:'signup-form' , component:SignupFormComponent},
    {path:'home', component:HomeComponent}
];
