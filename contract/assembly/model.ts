import { env, PersistentVector, PersistentMap } from "near-sdk-as";
@nearBindgen
export class Product {
  id: i32;
  owner: string;
  name: string;
  description: string;
  brand: string;
  image: string;
  price: i32;
  forSale: bool;

  constructor(id: i32, owner: string, name: string, description: string, brand: string, 
    image: string, price: i32, forSale: bool) {
    this.id = id;
    this.owner = owner;
    this.name = name;
    this.description = description;
    this.brand = brand;
    this.image = image;
    this.price = price;
    this.forSale = forSale;
  }

}// An array that stores products on the blockchain
export const products = new PersistentVector<Product>("prds");


