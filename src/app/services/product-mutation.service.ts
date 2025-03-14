import { inject, Injectable } from '@angular/core';
import { ProductsService } from './products.service';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { Product } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class ProductMutationService {
  private productService = inject(ProductsService);
  private queryClient = inject(QueryClient);

  createProductMutation(options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }) {
    return injectMutation(() => ({
      mutationFn: (product: Omit<Product, 'id' | 'created_at'>) => {
        return lastValueFrom(this.productService.addProduct(product));
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['products'] });

        if (options?.onSuccess) {
          options.onSuccess();
        }
      },
      onError: (error: Error) => {
        console.error('Failed to create product:', error);

        if (options?.onError) {
          options.onError(error);
        }
      },
    }));
  }

  updateProductMutation(options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }) {
    return injectMutation(() => ({
      mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) => {
        return lastValueFrom(this.productService.updateProduct(id, data));
      },
      onSuccess: () => {
        this.queryClient.invalidateQueries({ queryKey: ['products'] });
        this.queryClient.invalidateQueries({ queryKey: ['product'] });

        if (options?.onSuccess) {
          options.onSuccess();
        }
      },
      onError: (error: Error) => {
        console.error('Failed to update product:', error);

        if (options?.onError) {
          options.onError(error);
        }
      },
    }));
  }
}
