import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Products } from '../interfaces/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private dbPathProducts = 'products';
  private productsRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
      this.productsRef = db.collection(this.dbPathProducts);
    }

    getAll(): AngularFirestoreCollection<any> {
        return this.productsRef;
    }

    create(products: Products) {
        return this.productsRef.add({ ...products });
    }

    update(id: string, data: Products): Promise<void> {
        return this.productsRef.doc(id).update(data);
    }

    delete(id: string): Promise<void> {
        return this.productsRef.doc(id).delete();
    }

}
