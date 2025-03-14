import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
  effect,
  computed,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { Product } from '../../types/product';
import { ProductSearchComponent } from '../../components/product-search/product-search.component';
import { ProductCategoryFilterComponent } from '../../components/product-category-filter/product-category-filter.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-products-page',
  imports: [
    ProductSearchComponent,
    ProductCategoryFilterComponent,
    ProductListComponent,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent {
  private productsService = inject(ProductsService);
  private router = inject(Router);

  products = signal<Product[] | undefined>(undefined);
  categories = signal<string[]>([]);
  searchTerm = signal('');
  selectedCategory = signal('');

  readonly featuredProducts = computed(
    () => this.products()?.filter((product) => product.featured) || []
  );

  readonly regularProducts = computed(
    () => this.products()?.filter((product) => !product.featured) || []
  );

  readonly productsQuery = injectQuery(() => ({
    queryKey: ['products', this.searchTerm(), this.selectedCategory()],
    queryFn: () => {
      return lastValueFrom(
        this.productsService.filterProducts(
          this.searchTerm(),
          this.selectedCategory()
        )
      );
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  }));

  readonly categoriesQuery = injectQuery(() => ({
    queryKey: ['categories'],
    queryFn: () => {
      return lastValueFrom(this.productsService.getCategories());
    },
  }));

  constructor() {
    effect(() => {
      this.products.set(this.productsQuery.data());
    });

    effect(() => {
      this.categories.set(this.categoriesQuery.data() || []);
    });
  }

  updateSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  updateCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  navigateToCreate(): void {
    this.router.navigate(['/products/create']);
  }
}
