import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Product } from './models/product';
import { take } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ShoppingCart } from './models/shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  private create(){
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId)
    .snapshotChanges()   //till here is the old  code
    .pipe
    (map((x:any) => {
      const items = x.payload.val().items;
      return new ShoppingCart(items);
      })
    )
}

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
     if(cartId)
        return cartId;
      
       const result = await this.create();
       localStorage.setItem('cartId', result.key);
       return result.key;
          
    }

  //addTocart and removeFromCart are basically the implementation of same method

  async addToCart(product: Product){
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId,product.key);
    
    item$.snapshotChanges().pipe(take(1)).subscribe((item: any) => {
     // console.log(item);
      if(item.payload.val())
          item$.update({ quantity: item.payload.val().quantity + 1});
      else
          item$.set({ product: product, quantity: 1});
    })
  }

  async removeFromCart(product: Product){
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId,product.key);
    
    item$.snapshotChanges().pipe(take(1)).subscribe((item: any) => {
      //console.log(item);
         let quantity = (item.payload.val().quantity  || 0) - 1;
         if(quantity === 0)
            item$.remove();
         else
            item$.update({  product: product,quantity: quantity });
    });
  }

  async clearCart(){
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

}
