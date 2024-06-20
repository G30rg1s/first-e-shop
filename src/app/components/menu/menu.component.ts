import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, NgModule, inject, OnInit, OnDestroy } from '@angular/core';
import { Menu, menuSections } from 'src/app/shared/interfaces/menu';
import { UserService } from 'src/app/shared/services/user.service';
import { UserData, AdminReadUsers, Address, UserNum } from 'src/app/shared/interfaces/user';
import { Subscription, catchError, throwError } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { sortBy } from 'lodash-es';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/interfaces/product';
import { ReactiveFormsModule } from '@angular/forms';
import { Box, ProductBuy } from 'src/app/shared/interfaces/box';
import { NumService } from 'src/app/shared/services/num.service';
import { UsernameService } from 'src/app/shared/services/username.service';
import { TempboxService } from 'src/app/shared/services/tempbox.service';





@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, FormsModule, ReactiveFormsModule],
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
  totalprice : number;
  totalproducts : number;
  isClicked: boolean = false;
  myAddressesVisible : boolean = false;
  myDeliveryAddress : Address;
  finalstepvisible: boolean = false;  
  tempboxvisible: boolean = false;  
  tempbox : Box;
  selectBoxProduct : any;
  num1=0;
  num : number;
  boxstring : string;
  tempBoxSubscription: Subscription | undefined;
  userData: UserData | undefined;
  userRole: string;
  userUsername: string;
  userDetailsSubscription: Subscription | undefined;
  productForm: FormGroup;
  products1: Product[]=[];
  products: Product[]=[];
  category : string;
  subcategory : string;
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
  isHoveringSubcategory: boolean = false;
  subcategoryTimeout: { [key: string]: any } = {};
  isCollapsed = true;
  dropdownvisible: { [key: string]: boolean } = {};
  isMouseOverButton: boolean = false; 
  filteredProducts: Product[] = [];
  filteredProducts1: Product[] = [];
  navbarvisible: boolean = true;
  menunavbarvisible: boolean = true;
  myproducrbuy : ProductBuy;
  myproductsbuy : ProductBuy[];
  mypurchaseamount : number;
  deletetempboxvisible : boolean = false;
  pastboxesvisible:boolean = false;
  pastBoxesSubscription: Subscription | undefined;
  mypastBoxes: Box[];
  mydetailedpastbox: Box;
  detailedpastboxvisible: boolean = false;
  curentuser: string;


  
  selectedFilteredCategory: string = '';
  selectedFilteredSubcategory: string = '';
  
  searchQuery1: string = '';
  searchQuery: string = '';
  showfilteredproducts:boolean = false
  
  

 
    
    
  
    constructor(private usernameservice: UsernameService, private tempboxService: TempboxService,private numService: NumService,private formBuilder: FormBuilder, private userService: UserService, private productService:ProductService) {
      this.curentuser = this.usernameservice.getusername();
      this.num = this.numService.getNum();
      this.boxstring = this.tempboxService.getBoxKey();
    }
  
    
    
    showproducts: boolean;


    showAllproducts() {
      this.getAllProducts();
      this.showfilteredproducts = false; 
      this.showproducts=true;
    }
  
    closeProducts(){
    this.showfilteredproducts=false;
    }

    closeAllProducts(){
      this.showproducts = false;
    }

    showFilteredProducts(category: string, subcategory: string): void {
      this.showproducts=false;
      this.showfilteredproducts = true;
      this.filterAndSearchProducts(category, subcategory, this.searchQuery1);
    }

    opentempbox(tempBox:any){
      this.tempboxvisible = true;
      this.showproducts = false;
      this.showfilteredproducts = false;
      this.navbarvisible = false;
      this.menunavbarvisible = false;
      this.totalPrice(tempBox);
      this.totalProduct(tempBox);
    }

    openpastboxes(){
      this.tempboxvisible = false;
      this.pastboxesvisible = true;
      this.getPastBoxes();
    }

    closepastboxes(){
      this.tempboxvisible = true;
      this.pastboxesvisible = false;
    }

    opeandetailedpastbox(Box: any){
      this.getdetailedPastBox(Box);
      this.pastboxesvisible = false;
      this.detailedpastboxvisible = true;
    }

    closedetailedpastbox(){
      this.pastboxesvisible = true;
      this.detailedpastboxvisible = false;
    }

    openMyAddresses(){
      this,this.myAddressesVisible = true;
      this.tempboxvisible = false;
     
   }

   closeMyAddresses(){
    this.myAddressesVisible = false;
    this.tempboxvisible = true;
   }

   opendeletetempbox(){
    this.deletetempboxvisible=true
    this.tempboxvisible = false;

   }

    openfinalstep(){
      this.tempboxvisible = false;
      this.finalstepvisible=true;
    }

    finalcheckout(){
      this.numService.setNum(0);
      this.num= this.numService.getNum();
      this.tempboxService.setBoxKey('');
      this.boxstring = this.tempboxService.getBoxKey();
      window.location.reload();
    }
  
    filterAndSearchProducts(category: string, subcategory: string, query: string): void {
      query = query.trim().toLowerCase();
      
     
      let filtered = this.products.filter(product => 
        product.category === category && product.subcategory === subcategory
      );
  
      
      if (query !== '') {
        filtered = filtered.filter(product =>
          product.category.toLowerCase().includes(query) ||
          product.subcategory.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          (product.price && product.price.toString().includes(query)) ||
          (product.amount && product.amount.toString().includes(query))
        );
      }
      this.category = category;
      this.subcategory = subcategory;
      this.filteredProducts = filtered;
      console.log('Filtered products:', this.filteredProducts);
    }


    searchProducts() {
      const query = this.searchQuery.trim().toLowerCase();
      console.log('Search query:', query); 
      if (query === '') {
        
        this.filteredProducts1 = this.products.slice(); 
      } else {
        
        this.filteredProducts1 = this.products.filter(product =>
          product.category.toLowerCase().includes(query) ||
          product.subcategory.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          (product.price && product.price.toString().includes(query)) ||
          (product.amount && product.amount.toString().includes(query)) 
        );
      }
    
      console.log('Filtered products:', this.filteredProducts); 
    }
    
    
  
   ngOnInit(): void {
    this.userUsername = this.userService.getUserusername();
    if(this.userUsername != this.usernameservice.getusername()){
        this.numService.setNum(0);
        this.num = this.numService.getNum();
        this.deletetempboxOnInit();
        //this.tempboxService.setBoxKey(''); 
        this.usernameservice.setusername(this.userUsername); 
      }
    
    console.log('curent',this.curentuser)
    

    this.detailedpastboxvisible= false;
    
    console.log('num = ', this.num);

    const token = localStorage.getItem('access_token');
    if (token) {
     
      this.userDetailsSubscription = this.userService.getMyDetails(token).subscribe(
        (userData: UserData) => {
          this.userData = userData;
          console.log('User details:', this.userData);
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
      this.userRole = this.userService.getUserRoles();
      this.userUsername = this.userService.getUserusername();
      
    

      this.tempBoxSubscription = this.productService.tempBox(this.userUsername).subscribe(
        (tempBox: Box) => {
          this.tempbox = tempBox;
          console.log('tempbox:', this.tempbox);
          this.myproductsbuy=this.tempbox.products;
          this.mypurchaseamount = this.myproducrbuy.purchaseamount;
          

        });
      
    } else {
      console.error('JWT token not found in local storage');
    }
  

    this.showproducts=false;
        
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


     toggleDropdown(category: string) {
        this.dropdownvisible[category] = !this.dropdownvisible[category];
      }
      toggleDropdown2(category: string) {
        this.dropdownvisible[category] = true;
      }

      startTimeout(category: string) {
        
        setTimeout(() => {
          if (!this.mouseStillOver(category)) {
            this.dropdownvisible[category] = false;
          }
        }, 1000);
      }
    
      mouseStillOver(category: string): boolean {
        return false;
      }
    
      onMouseLeave() {
        this.isMouseOverButton = false;
      }

   

      startSubcategoryTimeout(category: string) {
        this.subcategoryTimeout[category] = setTimeout(() => {
          this.isHoveringSubcategory[category] = false;
        }, 500);
      }
      
      clearTimeout() {
        Object.keys(this.subcategoryTimeout).forEach(category => {
          clearTimeout(this.subcategoryTimeout[category]);
        });
      }
    
    
   

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  sortOrder = {
    category: 'none',
    subcategory: 'none',
    brand: 'none',
    price: 'none',
    amount: 'none'
  };


  sortData1(sortKey: string) {
    if (this.sortOrder[sortKey] === 'asc') {
      this.sortOrder[sortKey] = 'desc';
      this.products = sortBy(this.products, [sortKey]).reverse(); 
    } else {
      this.sortOrder[sortKey] = 'asc';
      this.products = sortBy(this.products, [sortKey]); 
    }

    for (const key in this.sortOrder) {
      if (key !== sortKey) {
        this.sortOrder[key] = 'none';
      }
    }
  }
  

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


 
 
 
  createbox(product:any) {
    const boxkey = Date.now().toString();
    const username = this.userUsername; 
    const boxproductkey = product.key;

    this.productService.registerbox(boxkey, username, boxproductkey).subscribe({
      next: (response) => {
        console.log('Product updated successfully:', response);
        
        

        this.numService.setNum(1);
        this.num = this.numService.getNum();
        this.tempboxService.setBoxKey(boxkey); 
        

      
        
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
}

   addmore(product:any){
    const boxkey = this.tempboxService.getBoxKey();
    const username = this.userUsername; 
    const boxproductkey = product.key;
    console.log('',boxkey,username,boxproductkey);
    this.productService.addmoretobox(boxkey, username, product).subscribe({
      next: (response) => {
        console.log('Product updated successfully:', response);
        console.log('num = ', this.num)
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
    
  }

   handleClick(product: any) {
    if (this.num === 0) {
      this.createbox(product);
    } else {
      this.addmore(product);
    }
  }


  getTempBox(){
    let username = this.userUsername;
    this.productService.tempBox(username).subscribe({
      next: (response) => {
        console.log('Product found successfully:', response);
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
  }

  getdetailedPastBox(Box: any){
    let onepastbox = Box;
    let username = this.userUsername;
    let boxkey = Box.boxkey;
    console.log('pastkey', boxkey);
    this.productService.detailedPastBox(username,boxkey).subscribe({
      next: (response) => {
        console.log('Product found successfully:', response);
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
    this.mydetailedpastbox = onepastbox;
    
  }


  getPastBoxes(): void {
    const username = this.userUsername;
    if (username) {
      this.pastBoxesSubscription = this.productService.pastBoxes(username).subscribe({
        next: (response) => {
          console.log('Product found successfully:', response);
          this.mypastBoxes = response.purchases || [];
          this.mypastBoxes.forEach(box => {
            console.log('box:', box);
            this.myproductsbuy = box.products;
            this.mypurchaseamount = this.myproductsbuy.reduce((total, product) => total + product.purchaseamount, 0);
          });
        },
        error: (error) => {
          console.error('Error fetching past boxes:', error);
        }
      });
    } else {
      console.error('Username is not defined');
    }
  }

   


  selectAddress(address: any) {
    this.myDeliveryAddress = address;
    this.isClicked = false; 
    this.userData.address.forEach(addr => {
      if (addr === address) {
        this.isClicked = true; 
      }
    });
  }

  deletetempbox(){
    const boxkey = this.tempboxService.getBoxKey();
    const username = this.userUsername; 
    
    console.log('',boxkey,username);
    this.productService.Deletetempbox(boxkey, username).subscribe({
      next: (response) => {
        console.log('Product updated successfully:', response);
        console.log('num = ', this.num)
      },
     
      error: (error) => {
        console.error('Error updating product:', error);
      }
      
    });
    this.opendeletetempbox();
  }



  deletetempboxOnInit(){
    const boxkey = this.tempboxService.getBoxKey();
    const username = this.curentuser; 
    
    console.log('',boxkey,username);
    this.productService.Deletetempbox(boxkey, username).subscribe({
      next: (response) => {
        console.log('Product updated successfully:', response);
        console.log('num = ', this.num)
      },
     
      error: (error) => {
        console.error('Error updating product:', error);
      }
      
    });
    //this.opendeletetempbox();
  }


  deleteproductfromtempbox(product : any){
    const boxkey = this.tempboxService.getBoxKey();
    const username = this.userUsername; 
    const boxproductkey = product.key;
    console.log('',boxkey,username,product);
    this.productService.DeleteProductFromTempbox(boxkey, username, boxproductkey).subscribe({
      next: (response) => {
        console.log('Product updated successfully:', response);
        console.log('num = ', this.num)
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
      
    });
    

  }

  

  
  checkout(products: any[]){
    const boxkey = this.tempboxService.getBoxKey();
    const deliveryaddress = this.myDeliveryAddress;
    console.log('boxkey', boxkey);
    console.log('purchaseprod', products );
    console.log('address', deliveryaddress);

    const username = this.userUsername;
    this.productService.checkoutservice(boxkey, username, deliveryaddress, products).subscribe({
      next: (response) => {
        console.log('Product updated successfully:', response);
        console.log('num = ', this.num)
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
   this.openfinalstep();
  }





  /**-----------------------------------------event emiter start---------------------------------*/ 
  times: number = 1;

  incrementTimes(productBuy: any) {
    if (!productBuy.purchaseamount) {
      productBuy.purchaseamount = 1;
    }
    if (productBuy.purchaseamount < productBuy.product.amount) {
      productBuy.purchaseamount++;
    } else {
      console.log('Cannot add more, maximum quantity reached.');
    }
    this.totalPrice(productBuy);
    this.totalProduct(productBuy);
  }
  
  decrementTimes(productBuy: any) {
    if (productBuy.purchaseamount > 1) {
      productBuy.purchaseamount--;
    }

    this.totalPrice(productBuy);
    this.totalProduct(productBuy);
  }


  totalPrice(productBuy : any) {
    this.totalprice = 0; 
    
    for (let productBuy of this.tempbox.products) {
      
      let subtotal = productBuy.product.price * (productBuy.purchaseamount || 1);
      this.totalprice += subtotal;
    }
  }


  totalProduct(productBuy : any) {
    this.totalproducts = 0; 
    
    for (let productBuy of this.tempbox.products) {
      let subtotal = productBuy.purchaseamount || 0;
      this.totalproducts += subtotal;
  }
}

  

 

  
  /**-----------------------------------------event emiter end---------------------------------*/ 

  /**-------------- format date ------------------------------------------------------------------------- */

  formatDate(timestamp: Date | string | { $date: number }): string {
    if (!timestamp) {
      return ''; 
    }
  
    let date: Date;
    if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if ('$date' in timestamp) {
      date = new Date(timestamp.$date);
    } else {
      date = timestamp;
    }
  
    if (isNaN(date.getTime())) {
      return ''; 
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Europe/Athens' 
    };
    return date.toLocaleString('en-US', options);
  }
  

  /**-------------- formar date end ---------------------------------------------------------------------- */

  getTotalPrice() {
    return this.mydetailedpastbox.products.reduce((total, product) => {
      return total + (product.purchaseamount * product.product.price);
    }, 0);
  }


 

logout() {
  this.userService.logoutUser();
  //this.numService.setNum(0);
  //this.tempboxService.setBoxKey('');
  //localStorage.clear();
  
}

  }

