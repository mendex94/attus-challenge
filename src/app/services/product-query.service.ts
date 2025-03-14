import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ProductsService } from './products.service';
import {
  injectQuery,
  keepPreviousData,
  QueryObserverResult,
} from '@tanstack/angular-query-experimental';
import { Product } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class ProductQueryService {
  private productsService = inject(ProductsService);

  private productsQueryFactory = (name?: string, category?: string) =>
    injectQuery(() => ({
      queryKey: ['products', name, category],
      queryFn: () =>
        lastValueFrom(this.productsService.filterProducts(name, category)),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 1,
    }));

  private productQueryFactory = (id: number) =>
    injectQuery(() => ({
      queryKey: ['product', id],
      queryFn: () => {
        if (!id) throw new Error('Product ID is required');
        return lastValueFrom(this.productsService.getProductById(id));
      },
    }));

  private categoriesQueryFactory = injectQuery(() => ({
    queryKey: ['categories'],
    queryFn: () => lastValueFrom(this.productsService.getCategories()),
  }));

  getProductsQuery(name?: string, category?: string) {
    return this.productsQueryFactory(name, category);
  }

  getProductQuery(id: number) {
    return this.productQueryFactory(id);
  }

  getCategoriesQuery() {
    return this.categoriesQueryFactory;
  }
}
