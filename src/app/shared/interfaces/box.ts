import { Product } from "./product";
import{Address} from "./user"; 


export interface ProductBuy {
  product: Product;  
  purchaseamount: number;
}

export interface Box {
  timestamp: Date;
  boxkey: string; 
  username: string;
  fullname: string;
  products: ProductBuy[]; 
  deliveryaddress: Address;
  userpending: boolean;
  adminpending: boolean;
}