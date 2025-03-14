import { inject, Injectable } from '@angular/core';
import { ProductRepository } from '../repository/product.repository';
import { Product } from '../types/product';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateProductUseCase {
  private productRepository = inject(ProductRepository);

  execute(product: Omit<Product, 'id' | 'created_at'>): Observable<Product> {
    if (!product.name || !product.price) {
      return throwError(() => new Error('Product name and price are required'));
    }

    const newProduct = {
      ...product,
      created_at: new Date().toISOString(),
    };

    return this.productRepository.addProduct(newProduct);
  }
}
