import { inject, Injectable, Signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ProductsService } from './products.service';
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';

@Injectable({
  providedIn: 'root',
})
export class ProductQueryService {
  private productsService = inject(ProductsService);

  private productsQueryFactory = (
    searchTerm: Signal<string | undefined>,
    selectedCategory: Signal<string | undefined>
  ) =>
    injectQuery(() => ({
      queryKey: ['products', searchTerm(), selectedCategory()],
      queryFn: () =>
        lastValueFrom(
          this.productsService.filterProducts(searchTerm(), selectedCategory())
        ),
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

  getProductsQuery(
    searchTerm: Signal<string | undefined>,
    selectedCategory: Signal<string | undefined>
  ) {
    return this.productsQueryFactory(searchTerm, selectedCategory);
  }

  getProductQuery(id: number) {
    return this.productQueryFactory(id);
  }

  getCategoriesQuery() {
    return this.categoriesQueryFactory;
  }
}
