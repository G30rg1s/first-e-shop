import { Component } from '@angular/core';
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterLink, RouterOutlet, LoginFormComponent, SignupFormComponent,RouterLinkActive]
})
export class AppComponent {
  title = 'final-project-cf5';
}
