import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgModule } from '@angular/core';
import { UserData, AdminReadUsers } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';
import { ProductService } from 'src/app/shared/services/product.service';

import { Subscription, catchError, throwError } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Product } from 'src/app/shared/interfaces/product';
import { NgForm, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-add-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-add-products.component.html',
  styleUrl: './admin-add-products.component.css'
})
export class AdminAddProductsComponent implements OnInit, OnDestroy {
  userData: UserData | undefined;
  userDetailsSubscription: Subscription | undefined;
  productForm: FormGroup;
  products: Product[]=[];
  categories: string[];
  uniquecategories: string[];
  subcategories: string[];
  uniquesubcategories: string[];
  adminReadProductsSubscription: Subscription | undefined;
  selectedCategory: string;
  selectedSubcategory: string;
  
 constructor( private formBuilder: FormBuilder, private productService: ProductService, private userService: UserService) {}


 ngOnInit(): void {

  this.getAllProducts();
  console.log(this.uniquecategories);
  
  
 const token = localStorage.getItem('access_token');
    if (token) {
      this.getUserDetails(token);
      
    } else {
      console.error('JWT token not found in local storage');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.productForm.patchValue({
      category: category
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectSubcategory(subcategory: string) {
    this.selectedSubcategory = subcategory;
    this.productForm.patchValue({
      subcategory: subcategory
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  

  private getUserDetails(token: string): void {
    this.userDetailsSubscription = this.userService.getMyDetails(token)
      .pipe(
        catchError(error => {
          console.error('Error fetching user details:', error);
          return throwError(error);
        })
      )
      .subscribe(
        (userData: UserData) => {
          this.userData = userData;
          console.log('User details:', this.userData);
        }
      );

      
      this.productForm = this.formBuilder.group({
        key: [''],
        category: ['', Validators.required],
        subcategory: ['', Validators.required],
        brand: ['', Validators.required],
        price: [0, Validators.required],
        amount: [0]
      });
  }

  private unsubscribe(): void {
    if (this.userDetailsSubscription) {
      this.userDetailsSubscription.unsubscribe();
    }
  }

  logout() {
    this.userService.logoutUser();
  }

  assignUniqueKeys(products: any[]): void {
    products.forEach(product => {
      product.key = Date.now().toString();
    });
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      this.assignUniqueKeys([productData]);
      console.log('Product Data:', productData);
      this.productService.registerProduct(productData).subscribe({
        next: response => {
          console.log(response.msg);
          // Reload the page after successfully adding the product
          location.reload();
        },
        error: error => console.error('Error registering product:', error)
      });
    } else {
      console.error('Invalid product form');
    }
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
          console.log(this.categories); 

          this.uniquecategories = this.getUniqueValues(this.categories);
          console.log(this.uniquecategories); 
          (productsuniquecategory: string[])=>{this.uniquecategories = productsuniquecategory}

          this.subcategories = this.extract(productsArray, "subcategory");
          console.log(this.subcategories); 

          this.uniquesubcategories = this.getUniqueValues(this.subcategories);
          console.log(this.uniquesubcategories); 
          (productsuniquesubcategory: string[])=>{this.uniquesubcategories = productsuniquesubcategory}


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

  getUniqueValues(strings: string[]): string[] {
    const uniqueValues: string[] = [];
  
    strings.forEach(value => {
      if (!uniqueValues.includes(value)) {
        uniqueValues.push(value);
      }
    });
  
    return uniqueValues;
  }
}
  







