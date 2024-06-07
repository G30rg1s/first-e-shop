export interface Address {
   key: string;
   city: string;
   area: string;
   code: string;
   road: string;
   number: string;
   floor: string;
   bell: string;
   specifications : string; 
}

export interface MySimpleAddress {
    road: string;
    number: string;
    code: string;
    area: string;
}


export interface User {
   firstname: string;
   lastname: string;
   phonenumber: string;
   email:string;
   address: Address[];
   username: string;
   password: string;
   roles: string;
   
    
}


export interface Credentials {
   username: string;
   password: string;
 }
 
 export interface LoggedInUser {
      fullname: string;
      username: string;
      roles: string;
      
 }

 export interface UserData {
   firstname: string;
   lastname: string;
   phonenumber: string;
   email:string;
   address: Address[];
   username: string;
   roles: string;
   
 }

 export interface AdminReadUsers {
   firstname: string;
   lastname: string;
   phonenumber: string;
   email:string;
   address: Address[];
   roles: string;
   roles_string : string;
 }

