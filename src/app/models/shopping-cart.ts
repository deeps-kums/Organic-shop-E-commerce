import { Product } from "./product";
import { ShoppingCartItem } from "./shopping-cart-item";

export class ShoppingCart {
    items: ShoppingCartItem[] = [];

    constructor(private itemsMap: { [productId: string]: ShoppingCartItem }) {
        this.itemsMap = itemsMap || {};
        for(let productId in itemsMap){
            let item = itemsMap[productId];
            this.items.push(new ShoppingCartItem(item.product, item.quantity));
        }            
    }

    /*get productIds() {
        //console.log(Object.keys(this.items));
        return Object.keys(this.items);   //JS method to convert keys in objects as arrays
    }*/

    getQuantity(product: Product) {        
        let item = this.itemsMap[product.key];
        //console.log(item);
        return item ? item.quantity : 0;
    }
      
    get totalPrice(){
        let sum = 0;
        for(let productId in this.items){
            sum += this.items[productId].totalPrice;
        }
        return sum;
    }

   get totalItemsCount(){
        let count = 0;
        for(let productId in this.items)
            count += this.items[productId].quantity;
        return count;
    }
}