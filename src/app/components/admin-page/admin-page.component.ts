import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserData, AdminReadUsers } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';
import { Box, ProductBuy } from 'src/app/shared/interfaces/box';
import { Subscription, catchError, throwError } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { sortBy } from 'lodash-es';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/interfaces/product';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIf,NgFor],  
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit, OnDestroy {
  massivedeleteproductForm: FormGroup;
  userData: UserData | undefined;
  users: AdminReadUsers[] = [];
  userRole:string;
  products: Product[]=[];
  deliveryboxes: Box[]=[];
  filteredUsers: AdminReadUsers[] = [];
  userDetailsSubscription: Subscription | undefined;
  adminReadUsersSubscription: Subscription | undefined;
  searchQuery: string = '';
  adminReadProductsSubscription: Subscription | undefined;
  adminDeliverySubscription: Subscription | undefined;
  searchQuery1: string = '';
  filteredProducts: Product[] = [];
  productForm: FormGroup;
  selectUpdateProduct : any;
  selectDeleteProduct : any;
  selectedCategory: string;
  selectedbrand: string;
  selectedSubcategory: string;
  categories: string[];
  uniquecategories: string[];
  subcategories: string[];
  uniquesubcategories: string[];
  uniquesubcategoriesOfCategory: {};
  brands: string[];
  uniquebrands: string[];
  detaileddeliverybox: Box;
  

  constructor(private formBuilder: FormBuilder, private userService: UserService, private productService:ProductService) {}

  showButtons: boolean;
  showUsers: boolean;
  showProducts: boolean;
  updateProductVisible: boolean =  false ;
  showDelete: boolean = false;
  massiveDeletevisible: boolean = false;
  deliveryboxesvisible: boolean = false;
  detaileddeliveryvisible: boolean = false;
  navVisible: boolean = true;

  opendeliveryboxes(){
    this.adminDoDelivery();
    this.deliveryboxesvisible=true;
    this.showButtons=false;
    //this.navVisible=false;
    
  }

  closedeliveryboxes(){
    this.deliveryboxesvisible=false;
    this.showButtons=true;
    this.navVisible=true;
  }

  opendetaileddelivery(Box : any){
    this.detaileddeliveryvisible=true;
    this.deliveryboxesvisible=false;
    this.detaileddeliverybox= Box;
  }

  closedetaileddelivery(){
    this.detaileddeliveryvisible=false;
    this.deliveryboxesvisible=true;
  }


  openMassiveDelete(){
    this.massiveDeletevisible = true;
    this.showButtons = false;
  }

  closeMssivedelete(){
    this.massiveDeletevisible = false;
    this.showButtons = true;
  }


  openUpdate(product:any): void{
    this.updateProductForm.patchValue({
      key: product.key,
  });
    this.selectUpdateProduct = product;
    this.updateProductVisible = true;
    this.showProducts = false;
  }

  closeUpdate(product:any): void{
    this.selectUpdateProduct = null;
    this.updateProductVisible = false;
    this.showProducts = true;
  }

  showAllUsers() {
    this.getAdminReadUsers();
    this.showButtons=false;
    this.showUsers=true;
  }

  closeUsers(){
    this.showButtons=true;
    this.showUsers=false;
  }

  showAllproducts() {
    this.getAllProducts();
    this.showButtons=false;
    this.showProducts=true;
  }

  closeProducts(){
    this.showButtons=true;
    this.showProducts=false;
  }

  openDelete(product:any): void{
    this.deleteProductForm.patchValue({
      key: product.key,
  });
    this.selectDeleteProduct = product;
    this.showProducts=false;
    this.showDelete=true;
  }

  closeDelete(product:any): void{
    this.selectDeleteProduct = null;
    this.showProducts=true;
    this.showDelete=false;
  }




  
  ngOnInit(): void {

    this.getAllProducts();
      
    this.showButtons=true;
    this.showUsers=false;
    this.showProducts=false;

    this.productForm = this.formBuilder.group({
      key: [''],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      brand: ['', Validators.required],
      price: [0, Validators.required],
      amount: [0]
    });


    this.massivedeleteproductForm = this.formBuilder.group({
      category: ['None', Validators.required],
      subcategory: ['None', Validators.required],
      brand: ['None', Validators.required]
      
    });


    const token = localStorage.getItem('access_token');
    if (token) {
      this.getUserDetails(token);
      this.userRole = this.userService.getUserRoles();
    } else {
      console.error('JWT token not found in local storage');
    }
  }


  ngOnDestroy(): void {
    this.unsubscribe();
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
  }

  private getAdminReadUsers(): void {
    this.adminReadUsersSubscription = this.userService.getUsers()
      .pipe(
        catchError(error => {
          console.error('Error fetching users:', error);
         
          return throwError(error);
        })
      )
      .subscribe(
        (adminReadUsers: AdminReadUsers[]) => {
          this.users = adminReadUsers;
          console.log('Users:', this.users);
        }
      );
  }



  adminDoDelivery(): void {
    this.adminDeliverySubscription = this.productService.deliveryPending()
      .pipe(
        catchError(error => {
          console.error('Error fetching boxes:', error);
         
          return throwError(error);
        })
      )
      .subscribe(
        (admindodelivery: Box[]) => {
          this.deliveryboxes = admindodelivery;
          console.log('PRODUCTS:', this.deliveryboxes);
        }
      );
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

          this.brands = this.extract(productsArray, "brand");
          console.log(this.subcategories); 

          this.uniquebrands = this.getUniqueValues(this.brands);
          console.log(this.uniquebrands); 
          (productsuniquebrands: string[])=>{this.uniquebrands = productsuniquebrands}



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

  logout() {
    this.userService.logoutUser();
  }

  
//shorting users

  sortOrder = {
    firstname: 'none',
    lastname: 'none',
    email: 'none',
    phonenumber: 'none',
    roles_string: 'none'
  };

  sortData(sortKey: string) {
    if (this.sortOrder[sortKey] === 'asc') {
      this.sortOrder[sortKey] = 'desc';
      this.users = sortBy(this.users, sortKey).reverse();
    } else {
      this.sortOrder[sortKey] = 'asc';
      this.users = sortBy(this.users, sortKey);
    }

    for (const key in this.sortOrder) {
      if (key !== sortKey) {
        this.sortOrder[key] = 'none';
      }
    }
  }

  //end shorting users

  //shorting products
  sortOrder1 = {
    category: 'none',
    subcategory: 'none',
    brand: 'none',
    price: 'none',
    amount: 'none'
  };

  
  sortData1(sortKey: string) {
    if (this.sortOrder1[sortKey] === 'asc') {
      this.sortOrder1[sortKey] = 'desc';
      this.products = sortBy(this.products, [sortKey]).reverse(); 
    } else {
      this.sortOrder1[sortKey] = 'asc';
      this.products = sortBy(this.products, [sortKey]); 
    }

    for (const key in this.sortOrder) {
      if (key !== sortKey) {
        this.sortOrder[key] = 'none';
      }
    }
  }
  //end shorting products

  sortSign(sortKey: string): string {
    if (this.sortOrder[sortKey] === 'asc') {
      return '↑';
    } else if (this.sortOrder[sortKey] === 'desc') {
      return '↓';
    } else {
      return '';
    }
  }


  getRole(rolesString: string): string {
    switch (rolesString) {
      case 'truefalsefalse':
        return 'user';
      case 'truetruefalse':
        return 'admin';
      case 'truetruetrue':
        return 'boss';
      default:
        return 'unknown';
    }
  }


  searchUsers() {
    const query = this.searchQuery.trim().toLowerCase();
    console.log('Search query:', query); 
    if (query === '') {
      
      this.filteredUsers = this.users.slice(); 
    } else {
      
      this.filteredUsers = this.users.filter(user =>
        user.firstname.toLowerCase().includes(query) ||
        user.lastname.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phonenumber && user.phonenumber.toString().includes(query)) ||
        this.getRole(user.roles_string).toLowerCase().includes(query) 
      );
    }
  
    console.log('Filtered users:', this.filteredUsers); 
  }


  searchProducts() {
    const query = this.searchQuery1.trim().toLowerCase();
    console.log('Search query:', query); 
    if (query === '') {
      
      this.filteredProducts = this.products.slice(); 
    } else {
      
      this.filteredProducts = this.products.filter(product =>
        product.category.toLowerCase().includes(query) ||
        product.subcategory.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        (product.price && product.price.toString().includes(query)) ||
        (product.amount && product.amount.toString().includes(query)) 
      );
    }
  
    console.log('Filtered users:', this.filteredProducts); 
  }


  updateProductForm= this.formBuilder.group({
    key:[''],
    price: ['', Validators.pattern("^[0-9]*$")],  
    amount: ['', Validators.pattern("^[0-9]*$")] 
  })

  deleteProductForm= this.formBuilder.group({
    key:[''],
    
  })

 

  updateProduct(product: any) {
    const { key, price, amount } = this.updateProductForm.value; 
    const myprice = price  ? price : product.price; 
    const myamount = amount  ? amount : product.amount; 
    this.productService.updateProduct(key, myprice, myamount).subscribe({
      next: (response) => {
        console.log('product updated successfully:', response);
       
       
        window.location.reload();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        if (error.status === 404) {
          console.error('User not found.');
        } else {
          console.error('An error occurred while updating the product.');
        }
      }
    });
    
  }
  
    
 deleteOneProduct( product: any) {    
   const { key } = product.key;
    this.productService.deleteProduct(product).subscribe({
      next: (response) => {
        console.log('Product deleted successfully:', response);
        location.reload();
        },
      error: (error) => {
        console.error('Error deleting product:', error);
        if (error.status === 404) {
          console.error('User not found.');
        } else {
          console.error('An error occurred while deleting the product.');
        }
      }
    });
 }


 selectCategory(category: string) {
  this.selectedCategory = category;
  this.massivedeleteproductForm.patchValue({
    category: category
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
}

selectSubcategory(subcategory: string) {
  this.selectedSubcategory = subcategory;
  this.massivedeleteproductForm.patchValue({
    subcategory: subcategory
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}



selectBrand(brand: string) {
  this.selectedbrand = brand;
  this.massivedeleteproductForm.patchValue({
    brand: brand
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

 
private unsubscribe(): void {
  if (this.userDetailsSubscription) {
    this.userDetailsSubscription.unsubscribe();
  }
}





massivedeleteProducts(): void {
  if (this.massivedeleteproductForm.valid) {
    const category = this.massivedeleteproductForm.get('category').value;
    const subcategory = this.massivedeleteproductForm.get('subcategory').value;
    const brand = this.massivedeleteproductForm.get('brand').value;

    console.log('Category:', category);
    console.log('Subcategory:', subcategory);
    console.log('Brand:', brand);

    this.productService.massiveDeleteProducts(category, subcategory, brand ).subscribe({
      next: response => {
        console.log(response.message);
        location.reload(); // Reload the page after deletion (consider using a more refined approach)
      },
      error: error => console.error('Error massive delete product:', error)
    });
  } else {
    console.error('Invalid product form');
  }
}
  
}