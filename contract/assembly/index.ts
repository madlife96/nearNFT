/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import { Context, logging, storage } from 'near-sdk-as'
import { Product, products} from './model';

const INIT_ID = 0;

export function addProduct(name: string, description: string, brand: string, image: string, price: i32):bool {
  let product_owner = Context.sender;
  let product_id = products.length + 1;
  let product = new Product(product_id, product_owner, name, description, brand, image, price, false);
  let index = products.push(product);
  
  if(index) {
    return true;
  }
  else {
    return false;
  }
}

export function getProducts() : Product[] {
  let results = new Array<Product>();

  for(let i = 0; i < products.length; i ++) {
      results.push(products[i]);
  }
  return results;
}
export function buyProduct(_id: i32, _newOwner: string):bool {
  for(let i = 0; i < products.length; i ++) {
    let id = products[i].id;

    if(id == _id) {
      let name = products[i].name;
      let description = products[i].description;
      let brand = products[i].brand;
      let image = products[i].image;
      let price = products[i].price;

      //increase price +10%
        price = price + price * 10 / 100;
        
      let updatedProduct = new Product(id, _newOwner, name, description, brand, image, price, true);
      products.replace(i, updatedProduct);
      return true;
    }
  }
  return false;
}

export function getProductOwner(_id: i32):string {
  let owner:string = '';
  for(let i = 0; i < products.length; i ++) {
    let id = products[i].id;
    if(id == _id) {
      owner = products[i].owner;      
    }
  }
  return owner;
}

export function sellProduct(_id: i32, _owner: string):bool {
  for(let i = 0; i < products.length; i ++) {
    let id = products[i].id;
    let forSale = products[i].forSale;

    if(id == _id && !forSale) {
      let name = products[i].name;
      let description = products[i].description;
      let brand = products[i].brand;
      let image = products[i].image;
      let price = products[i].price;
          price = price + price * 10 / 100;
        
      let updatedProduct = new Product(id, _owner, name, description, brand, image, price, true);
      products.replace(i, updatedProduct);
      return true;
    }
  }
  return false;
}

export function cancelSellProduct(_id: i32, _owner:string):bool {
  for(let i = 0; i < products.length; i ++) {
    let id = products[i].id;
    let forSale = products[i].forSale;

    if(id == _id && forSale) {
      let name = products[i].name;
      let description = products[i].description;
      let brand = products[i].brand;
      let image = products[i].image;
      let price = products[i].price;
          price = price - price * 10 / 100;
        
      let updatedProduct = new Product(id, _owner, name, description, brand, image, price, false);
      products.replace(i, updatedProduct);
      return true;
    }
  }
  return false;
}


