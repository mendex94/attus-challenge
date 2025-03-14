import { Component, effect, inject, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../types/product';
import { ButtonModule } from 'primeng/button';
import { ProductQueryService } from '../../services/product-query.service';
import { ProductMutationService } from '../../services/product-mutation.service';

@Component({
  selector: 'app-product-update',
  imports: [
    CommonModule,
    ToastModule,
    ProgressSpinnerModule,
    ProductFormComponent,
    ButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent {
  private productQueryService = inject(ProductQueryService);
  private productMutationService = inject(ProductMutationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  product = signal<Product | undefined>(undefined);
  categories = signal<string[]>([]);

  readonly productId = Number(this.route.snapshot.paramMap.get('id'));

  // Initialize queries at component creation time
  readonly productQuery = this.productQueryService.getProductQuery(
    +this.productId!
  );

  // Initialize categories query here, not in the effect
  readonly categoriesQuery = this.productQueryService.getCategoriesQuery();

  readonly updateProductMutation =
    this.productMutationService.updateProductMutation({
      onSuccess: () => {
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
    });

  constructor() {
    effect(() => {
      if (!this.productId) throw new Error('Product ID is required');
      this.product.set(this.productQuery.data());
    });

    // Use the already initialized categoriesQuery
    effect(() => {
      this.categories.set(this.categoriesQuery.data() || []);
    });
  }

  async updateProduct(id: number, product: Partial<Product>) {
    if (!this.product()) return;
    if (!product) return;

    this.updateProductMutation.mutate({ id, data: product });
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }
}
