import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../category.service';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy{
  products: any[] = [];
  //products$;
  filteredProducts: any[] = [];
  categories$;
  category: string;
  cart: any;
  subscription: Subscription;

  constructor(
    route: ActivatedRoute,
    productService: ProductService,
    categoryService: CategoryService,
    private cartService: ShoppingCartService) {

     // cartService.getCart();

    productService.getAll().subscribe(products => {
      this.products = products;
      //this.products$ = productService.getAll();

      route.queryParamMap.subscribe(params => {
        this.category = params.get('category');
  
        this.filteredProducts = (this.category) ?
        this.products.filter(p => p.category === this.category) :
        this.products;
    });

  });
    

    this.categories$ = categoryService.getCategories();
    console.log(this.categories$);
    
    //console.log(this.products$);
   }
  
 async ngOnInit(){
    this.subscription = (await this.cartService.getCart())
    //.subscribe(cart => this.cart = cart.payload.val());
    .subscribe(cart => this.cart = cart);
 }

 ngOnDestroy() {
  this.subscription.unsubscribe();
}
   
}
