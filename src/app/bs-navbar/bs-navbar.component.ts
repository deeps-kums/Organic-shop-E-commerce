import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppUser } from '../models/app-user';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';
import { SnapshotAction } from 'angularfire2/database';

@Component({
  selector: 'app-bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit{
  appUser: AppUser;
  shoppingCartItemCount: number;
 // cart:any;
  cart$: Observable<ShoppingCart>;

  constructor(
    private auth: AuthService,
    private cartService: ShoppingCartService
    ) {}

  async ngOnInit(){
    //Authentication

    this.auth.appUser$.subscribe(appUser => this.appUser = appUser);

    //Dispaying shopping cart number in navbar Old code
    /*let cart$ = await this.cartService.getCart();
    cart$.subscribe(cart => {
      this.shoppingCartItemCount = 0;
      this.cart=cart;
      const items = this.cart.payload.val().items;
      console.log(items);
      for(let productId in items){
        this.shoppingCartItemCount += items[productId].quantity;
      }
    }) */

    //New code
    this.cart$ = await this.cartService.getCart();

  }

   logout(){
     this.auth.logout();
   }

}
