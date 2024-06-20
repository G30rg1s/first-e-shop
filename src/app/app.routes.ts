import { Routes } from '@angular/router';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomeComponent } from './components/home/home.component';
import { AddressComponent } from './components/address/address.component';
import { MenuComponent } from './components/menu/menu.component';
import { ContactShopComponent } from './components/contact-shop/contact-shop.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SimpleAddressComponent } from './components/simple-address/simple-address.component';
import { authGuard } from './shared/guards/auth.guard';
import { roleauthGuard } from './shared/guards/role-auth.guard';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { BossPageComponent } from './components/boss-page/boss-page.component';
import { DefineRoleComponent } from './components/define-role/define-role.component';
import { AnauthorizedComponent } from './components/anauthorized/anauthorized.component';
import { AdminAddProductsComponent } from './components/admin-add-products/admin-add-products.component';


export const routes: Routes = [
    { path: '', component: WelcomeComponent },
    {path:'login-form' , component:LoginFormComponent},
    {path:'signup-form' , component:SignupFormComponent},
    {path:'home', component:HomeComponent},
    {path:'address-input', component: AddressComponent},
    {path:'menu', component: MenuComponent,canActivate: [roleauthGuard],data: { roles: 'truefalsefalse' }},
    {path:'admin-page', component: AdminPageComponent, canActivate: [roleauthGuard],data: { roles: 'truetruefalse' }},
    {path:'boss-page', component: BossPageComponent, canActivate: [roleauthGuard],data: { roles: 'truetruetrue' }},
    {path:'define-role', component: DefineRoleComponent, canActivate: [authGuard]},
    {path:'unauthorized', component: AnauthorizedComponent},
    {path:'contact-shop', component:ContactShopComponent},
    {path:'profile', component: ProfileComponent},
    {path:'simple', component: SimpleAddressComponent},
    {path:'adminaddproducts', component:AdminAddProductsComponent, canActivate: [roleauthGuard],data: { roles: 'truetruefalse' }},
   
   
];
