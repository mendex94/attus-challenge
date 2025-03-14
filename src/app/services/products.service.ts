import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../types/product';
import { IProductsService } from './products.interface';
import { GetProductsUseCase } from '../use-cases/get-products.usecase';
import { CreateProductUseCase } from '../use-cases/create-product.usecase';
import { UpdateProductUseCase } from '../use-cases/update-product.usecase';

@Injectable({
  providedIn: 'root',
})
export class ProductsService implements IProductsService {
  private getProductUseCase = inject(GetProductsUseCase);
  private createProductUseCase = inject(CreateProductUseCase);
  private updateProductUseCase = inject(UpdateProductUseCase);

  getAllProducts(): Observable<Product[]> {
    return this.getProductUseCase.getAll();
  }

  getProductById(id: number): Observable<Product> {
    return this.getProductUseCase.getById(id);
  }

  filterProducts(name?: string, category?: string): Observable<Product[]> {
    return this.getProductUseCase.getFiltered(name, category);
  }

  getCategories(): Observable<string[]> {
    return this.getProductUseCase.getProductsCategory();
  }

  addProduct(product: Omit<Product, 'id' | 'created_at'>): Observable<Product> {
    return this.createProductUseCase.execute(product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.updateProductUseCase.execute(id, product);
  }
}
