import { inject, Injectable } from '@angular/core';
import { ProductRepository } from '../repository/product.repository';
import { map, Observable } from 'rxjs';
import { Product } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class GetProductsUseCase {
  private productRepository = inject(ProductRepository);

  getAll(): Observable<Product[]> {
    return this.productRepository.filterProducts();
  }

  getById(id: number): Observable<Product> {
    return this.productRepository.getProductById(id);
  }

  getFiltered(name?: string, category?: string): Observable<Product[]> {
    return this.productRepository.filterProducts(name, category);
  }

  getProductsCategory(): Observable<string[]> {
    return this.productRepository.getAllProducts().pipe(
      map((products) => {
        const categories = products.map((product) => product.category);
        return [...new Set(categories)].filter(Boolean).sort();
      })
    );
  }
}
