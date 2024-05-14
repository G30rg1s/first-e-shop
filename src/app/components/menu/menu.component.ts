import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Menu, menuSections } from 'src/app/shared/interfaces/menu';



@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent {
  menuSections: Menu[] = menuSections;

  showChildDropdown: boolean = false;
  showWomanDropdown: boolean = false;
  showManDropdown: boolean = false;

  toggleDropdown(section: string): void {
    
    this.showChildDropdown = false;
    this.showWomanDropdown = false;
    this.showManDropdown = false;

    
    switch (section) {
        case 'child':
            this.showChildDropdown = true;
            break;
        case 'woman':
            this.showWomanDropdown = true;
            break;
        case 'man':
            this.showManDropdown = true;
            break;
        default:
            break;
    }
}

  


}

