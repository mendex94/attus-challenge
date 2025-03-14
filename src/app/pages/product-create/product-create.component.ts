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
import { ProductMutationService } from '../../services/product-mutation.service';
import { ProductQueryService } from '../../services/product-query.service';

@Component({
  selector: 'app-product-create',
  imports: [CommonModule, ProductFormComponent, ToastModule],
  providers: [MessageService],
  templateUrl: './product-create.component.html',
})
export class ProductCreateComponent {
  private productsService = inject(ProductsService);
  private productMutationService = inject(ProductMutationService);
  private productQueryService = inject(ProductQueryService);
  private queryClient = inject(QueryClient);
  private router = inject(Router);
  private messageService = inject(MessageService);

  categories = signal<string[]>([]);

  readonly categoriesQuery = this.productQueryService.getCategoriesQuery();

  constructor() {
    effect(() => {
      this.categories.set(this.categoriesQuery.data() || []);
    });
  }

  readonly createProductMutation =
    this.productMutationService.createProductMutation({
      onSuccess: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product created successfully',
        });

        setTimeout(() => this.navigateBack(), 1500);
      },
      onError: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create product',
        });
      },
    });

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
    this.createProductMutation.mutate({
      ...product,
    });
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }
}
