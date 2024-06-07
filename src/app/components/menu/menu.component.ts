import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, NgModule, inject, OnInit, OnDestroy } from '@angular/core';
import { Menu, menuSections } from 'src/app/shared/interfaces/menu';
import { UserService } from 'src/app/shared/services/user.service';
import { UserData, AdminReadUsers } from 'src/app/shared/interfaces/user';
import { Subscription, catchError, throwError } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { sortBy } from 'lodash-es';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/interfaces/product';
import { ReactiveFormsModule } from '@angular/forms';





@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [NgFor, NgIf],
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

export class MenuComponent implements OnInit {
  userData: UserData | undefined;
  userDetailsSubscription: Subscription | undefined;
  productForm: FormGroup;
  products: Product[]=[];
  categories: string[];
  uniquecategories: string[];
  subcategories: string[];
  uniquesubcategories: string[];
  uniquesubcategoriesOfCategory: {};
  mySubs: string[];
  menuSubs: string[];
  uniquemenuSubs: string[];
  adminReadProductsSubscription: Subscription | undefined;
  selectedCategory: string;
  selectedSubcategory: string;
  dropdownvisible: boolean = false;
  isCollapsed = true;
    
    
  
    constructor(private formBuilder: FormBuilder, private userService: UserService, private productService:ProductService) {}
  
    
    
    showProducts: boolean;
    
  
   ngOnInit(): void {
        
    this.productForm = this.formBuilder.group({
        key: [''],
        category: ['', Validators.required],
        subcategory: ['', Validators.required],
        brand: ['', Validators.required],
        price: [0, Validators.required],
        amount: [0]
      });
  
     this.getAllProducts();
    }
    
  
    
    getAllProducts(): void {
      this.adminReadProductsSubscription = this.productService.getProducts()
        .pipe(
          catchError(error => {
            console.error('Error fetching users:', error);
           
            return throwError(error);
          })
        )
        .subscribe(
          (adminReadProducts: Product[]) => {
            this.products = adminReadProducts;
            console.log('PRODUCTS:', this.products);
  
            const productsArray = Object.values(this.products);
            console.log('Products Array:', productsArray);
    
            this.categories = this.extract(productsArray, "category");
            //console.log(this.categories)
            ; 
  
            this.uniquecategories = this.getUniqueValues(this.categories);
            //console.log(this.uniquecategories)
            ; 
            (productsuniquecategory: string[])=>{this.uniquecategories = productsuniquecategory}
  
            this.subcategories = this.extract(productsArray, "subcategory");
            //console.log(this.subcategories); 
  
            this.uniquesubcategories = this.getUniqueValues(this.subcategories);
            //console.log(this.uniquesubcategories)
            ; 
            (productsuniquesubcategory: string[])=>{this.uniquesubcategories = productsuniquesubcategory}

            this.uniquesubcategoriesOfCategory = {};
        this.uniquecategories.forEach(category => {
          const subcategoriesForCategory = productsArray
            .filter(product => product.category === category)
            .map(product => product.subcategory);
          this.uniquesubcategoriesOfCategory[category] = this.getUniqueValues(subcategoriesForCategory);})
          console.log('Unique Subcategories:', this.uniquesubcategoriesOfCategory )
          ;
          (productsuniquesubcategoryOfCategory: string[])=>{this.uniquesubcategoriesOfCategory = productsuniquesubcategoryOfCategory}
          console.log(this.uniquesubcategoriesOfCategory);

        }
        );
    }
  
    extract(objects: any[], key: string): any[] {
      if (!Array.isArray(objects)) {
        console.error('Input is not an array.');
        return [];
      }
    
      return objects.map(object => object[key]);
    }


    extractFromObject(object: any, key: string): any[] {
      if (typeof object !== 'object') {
        console.error('Input is not an object.');
        return [];
      }
    
      if (!(key in object)) {
        console.error(`Key '${key}' not found in the object.`);
        return [];
      }
    
      return Array.isArray(object[key]) ? object[key] : [object[key]];
    }


  
    getUniqueValues(strings: string[]): string[] {
      const uniqueValues: string[] = [];
    
      strings.forEach(value => {
        if (!uniqueValues.includes(value)) {
          uniqueValues.push(value);
        }
      });
    
      return uniqueValues;
    }

    separateStrings(strings: string[]): string[] {
      const separatedStrings: string[] = [];
    
      strings.forEach(str => {
        separatedStrings.push(str);
      });
    
      return separatedStrings;
    }

    showdropdown(){
      this.dropdownvisible=true
    }
   

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

 

logout() {
  this.userService.logoutUser();
}

  }

