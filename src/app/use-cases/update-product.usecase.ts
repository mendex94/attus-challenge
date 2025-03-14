import { inject, Injectable } from '@angular/core';
import { ProductRepository } from '../repository/product.repository';
import { Observable, switchMap, throwError } from 'rxjs';
import { Product } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class UpdateProductUseCase {
  private productRepository = inject(ProductRepository);

  execute(id: number, productData: Partial<Product>): Observable<Product> {
    if (Object.keys(productData).length === 0) {
      return throwError(() => new Error('No update data provided'));
    }

    if (productData.name !== undefined && !productData.name.trim()) {
      return throwError(() => new Error('Product name cannot be empty'));
    }

    if (
      productData.price !== undefined &&
      (isNaN(productData.price) || productData.price <= 0)
    ) {
      return throwError(
        () => new Error('Product price must be greater than zero')
      );
    }

    return this.productRepository.getProductById(id).pipe(
      switchMap((existingProduct) => {
        const { created_at, ...updateableData } = productData as any;

        const updatedProduct: Product = {
          ...existingProduct,
          ...updateableData,
          id,
        };

        return this.productRepository.updateProduct(updatedProduct);
      })
    );
  }
}
