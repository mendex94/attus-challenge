import { Component, effect, inject, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../types/product';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product-update',
  imports: [
    CommonModule,
    ToastModule,
    ProgressSpinnerModule,
    ProductFormComponent,
    ButtonModule,
  ],
  providers: [MessageService, QueryClient],
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent {
  private productsService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private queryClient = inject(QueryClient);

  product = signal<Product | undefined>(undefined);
  categories = signal<string[]>([]);

  readonly productId = this.route.snapshot.paramMap.get('id');

  readonly productQuery = injectQuery(() => ({
    queryKey: ['product', this.productId],
    queryFn: () => {
      if (!this.productId) throw new Error('Product ID is required');
      return lastValueFrom(
        this.productsService.getProductById(+this.productId)
      );
    },
  }));

  readonly categoriesQuery = injectQuery(() => ({
    queryKey: ['categories'],
    queryFn: () => lastValueFrom(this.productsService.getCategories()),
  }));

  constructor() {
    effect(() => {
      this.product.set(this.productQuery.data());
    });

    effect(() => {
      this.categories.set(this.categoriesQuery.data() || []);
    });
  }

  mutation = injectMutation(() => ({
    mutationFn: (product: Omit<Product, 'created_at'>) =>
      lastValueFrom(this.productsService.updatedProduct(product)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['products'] });
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product updated successfully',
      });

      setTimeout(() => this.navigateBack(), 1500);
    },
    onError: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update product',
      });
    },
  }));

  async updateProduct(product: Partial<Product>) {
    if (!this.product()) return;
    if (!product) return;

    this.mutation.mutate({
      id: +this.productId!,
      name: product.name!,
      description: product.description!,
      price: product.price!,
      category: product.category!,
      featured: product.featured!,
    });
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }
}
