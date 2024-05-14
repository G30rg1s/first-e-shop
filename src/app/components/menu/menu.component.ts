import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Menu, menuSections } from 'src/app/shared/interfaces/menu';




@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  animations: [
    trigger('collapseAnimation', [
      state('false', style({ height: '0', display: 'none' })),
      state('true', style({ height: '*', display: 'block' })),
      transition('false <=> true', animate(200)),
    ]),
  ],
})

export class MenuComponent {
  menuSections: Menu[] = menuSections;

  isCollapsed = true;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

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

