import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../types/product';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-product-create',
  imports: [CommonModule, ProductFormComponent, ToastModule],
  providers: [MessageService, QueryClient],
  templateUrl: './product-create.component.html',
})
export class ProductCreateComponent {
  private productsService = inject(ProductsService);
  private queryClient = inject(QueryClient);
  private router = inject(Router);
  private messageService = inject(MessageService);

  categories = signal<string[]>([]);

  readonly categoriesQuery = injectQuery(() => ({
    queryKey: ['categories'],
    queryFn: () => lastValueFrom(this.productsService.getCategories()),
  }));

  constructor() {
    effect(() => {
      this.categories.set(this.categoriesQuery.data() || []);
    });
  }

  mutation = injectMutation(() => ({
    mutationFn: (product: Omit<Product, 'id'>) =>
      lastValueFrom(this.productsService.addProduct(product)),
    onSuccess: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product created successfully',
      });

      this.queryClient.invalidateQueries({ queryKey: ['products'] });

      setTimeout(() => this.navigateBack(), 1500);
    },
    onError: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create product',
      });
    },
  }));

  async createProduct(product: Omit<Product, 'id' | 'created_at'>) {
    this.mutation.mutate({
      ...product,
      created_at: new Date().toISOString(),
    });
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }
}
