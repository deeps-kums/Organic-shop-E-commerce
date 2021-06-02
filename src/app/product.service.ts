import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  //p$;

  constructor(public db: AngularFireDatabase) { }

  create(product){
    return this.db.list('/products').push(product);
  }

  getAll(){
   //return this.db.list('/products');
       return this.db.list('/products').snapshotChanges()
        .pipe(map(actions => actions.map(a=> ({ key:a.key, ...a.payload.val() as {} }))));
  }

  get(productId) {
   // return this.db.object('/products/' + productId).snapshotChanges() as Observable<any>;
   return this.db.object('/products/' + productId).valueChanges();
   //return this.db.object('/products/' + productId)
  }

  update(productId,product){
    return this.db.object('/products/'+productId).update(product);   //we do not send the id as parameter because firebase does not like those parameters which are immutable
  }

  delete(productId){
    return this.db.object('/products/'+ productId).remove();
  }
}
